"""Compute minimal, hue-preserving colour adjustments for each CSS rule that fails WCAG AA,
and locate the source declaration in src/**/*.css.

usage: python3 contrast_fix_plan.py <contrast_sources.json> [--apply]

Rules:
  * opaque colour on a light background  -> mix toward black just enough
  * opaque colour on a dark background   -> mix toward white just enough
  * translucent rgb(r g b / a)           -> raise alpha just enough (keeps the exact ink hue)
  * target 4.6:1 (4.5 + rounding margin); text >= 24px (or >= 18.66px bold) targets 3.1:1
  * the worst background the rule actually sits on is used
Rules whose failure comes from element opacity or that are decorative are reported as MANUAL.
"""
import glob, json, re, sys, collections

def lum(c):
    def ch(v):
        v /= 255
        return v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4
    return 0.2126 * ch(c[0]) + 0.7152 * ch(c[1]) + 0.0722 * ch(c[2])

def ratio(a, b):
    la, lb = sorted([lum(a), lum(b)], reverse=True)
    return (la + 0.05) / (lb + 0.05)

def hexrgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))

def blend(fg, a, bg):
    return tuple(fg[i] * a + bg[i] * (1 - a) for i in range(3))

def parse_color(v):
    v = v.replace("!important", "").strip()
    m = re.match(r"rgba?\(\s*([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)(?:\s*[,/]\s*([\d.]+)(%?))?\s*\)", v)
    if m:
        a = 1.0
        if m.group(4):
            a = float(m.group(4)) / (100 if m.group(5) else 1)
        return (float(m.group(1)), float(m.group(2)), float(m.group(3))), a
    if v.startswith("#"):
        h = v[1:]
        if len(h) == 3: h = "".join(c * 2 for c in h)
        a = int(h[6:8], 16) / 255 if len(h) == 8 else 1.0
        return hexrgb(h[:6]), a
    return None, None

def solve(rgb, alpha, bgs, target):
    worst = min(bgs, key=lambda b: ratio(blend(rgb, alpha, b), b))
    dark_bg = lum(worst) < 0.2
    if alpha < 1:  # raise alpha
        a = alpha
        while a < 1 and min(ratio(blend(rgb, a, b), b) for b in bgs) < target:
            a = round(a + 0.01, 2)
        ok = min(ratio(blend(rgb, a, b), b) for b in bgs) >= target
        return ("alpha", a, ok)
    t = 0.0
    def mixed(t):
        return tuple(round(c + (255 - c) * t) if dark_bg else round(c * (1 - t)) for c in rgb)
    while t < 1 and min(ratio(mixed(t), b) for b in bgs) < target:
        t = round(t + 0.01, 2)
    return ("rgb", mixed(t), min(ratio(mixed(t), b) for b in bgs) >= target)

def norm_sel(s):
    s = re.sub(r"\s*([>+~,])\s*", r"\1", s.strip())
    return re.sub(r"\s+", " ", s)

css_files = {f: open(f, encoding="utf-8").read() for f in glob.glob("src/**/*.css", recursive=True)}
rule_re = re.compile(r"([^{}@;]+)\{([^{}]*)\}")

def find_decls(selector):
    target = norm_sel(selector)
    hits = []
    for f, text in css_files.items():
        for m in rule_re.finditer(text):
            if norm_sel(m.group(1)) == target:
                body = m.group(2)
                for cm in re.finditer(r"(?<![-\w])color\s*:\s*([^;}]+)", body):
                    hits.append((f, m.start(2) + cm.start(1), m.start(2) + cm.end(1), cm.group(1).strip()))
    return hits

def fmt(orig, kind, val, rgb):
    """Write the new colour in the same notation family as the source."""
    imp = " !important" if "!important" in orig else ""
    o = orig.replace("!important", "").strip()
    if kind == "alpha":
        m = re.match(r"rgba?\(\s*([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)\s*[,/]\s*([\d.]+)(%?)\s*\)", o)
        if m:
            if m.group(5) or "/" in o:
                pct = f"{round(val * 100)}%" if m.group(5) else f"{val:g}"
                return f"rgb({m.group(1)} {m.group(2)} {m.group(3)} / {pct}){imp}"
            return f"rgba({m.group(1)}, {m.group(2)}, {m.group(3)}, {val:g}){imp}"
        if o.startswith("#"):
            return f"{o[:7]}{round(val * 255):02x}{imp}"
    r, g, b = val
    if o.startswith("#"):
        return f"#{r:02x}{g:02x}{b:02x}{imp}"
    return f"rgb({r} {g} {b}){imp}"

data = json.load(open(sys.argv[1]))
groups = collections.defaultdict(lambda: {"bgs": set(), "sizes": [], "op": 1.0, "n": 0, "inh": 0})
for v in data:
    s = v.get("source")
    if not s: continue
    k = (s["selector"], s["value"], s.get("media", ""))
    g = groups[k]
    g.setdefault("fgs", set()).add((v["fg"], v["bg"], v["ratio"]))
    g["n"] += 1; g["bgs"].add(v["bg"]); g["op"] = min(g["op"], v.get("opacity") or 1)
    px = float(re.search(r"([\d.]+)px", v["size"]).group(1)); bold = int(v.get("weight") or 400) >= 700 if str(v.get("weight") or "").isdigit() else v.get("weight") == "bold"
    g["sizes"].append((px, bold)); g["inh"] = max(g["inh"], v.get("inheritedDepth") or 0)

plan, manual = [], []
for (sel, value, media), g in sorted(groups.items()):
    rgb, alpha = parse_color(value)
    large = all(px >= 24 or (bold and px >= 18.66) for px, bold in g["sizes"])
    target = 3.1 if large else 4.6
    # The authored colour must reproduce axe's measurement; otherwise something else
    # (overrides, filters, inherited opacity) is involved and the rule needs a manual look.
    reproduces = rgb is not None and all(abs(ratio(blend(rgb, alpha, hexrgb(bg)), hexrgb(bg)) - r) < 0.15 for _, bg, r in g["fgs"])
    if rgb is None or g["op"] < 0.99 or not reproduces or (large and max(px for px, _ in g["sizes"]) >= 48):
        manual.append((sel, value, media, g)); continue
    kind, val, ok = solve(rgb, alpha, [hexrgb(b) for b in g["bgs"]], target)
    decls = [d for d in find_decls(sel) if parse_color(d[3])[0] is not None]
    plan.append((sel, value, media, g, kind, val, ok, decls))

for sel, value, media, g, kind, val, ok, decls in plan:
    loc = "; ".join(f"{f}" for f, *_ in decls) or "NOT FOUND"
    newv = fmt(decls[0][3], kind, val, None) if decls else str(val)
    print(f"{'OK ' if ok else 'XX '} {sel[:80]:80} {value:28} -> {newv:30} n={g['n']:<4} decls={len(decls)} {loc}")
print("\nMANUAL (opacity / decorative / unparsable):")
for sel, value, media, g in manual:
    print(f"   {sel[:90]:90} {value:26} op={g['op']:.2f} sizes={sorted(set(px for px, _ in g['sizes']))} n={g['n']} axe={sorted(g['fgs'])[:2]}")

if "--apply" in sys.argv:
    edits = collections.defaultdict(list)
    for sel, value, media, g, kind, val, ok, decls in plan:
        if not ok or len(decls) != 1:
            print("SKIP (needs manual)", sel, len(decls)); continue
        f, s, e, orig = decls[0]
        edits[f].append((s, e, fmt(orig, kind, val, None)))
    for f, es in edits.items():
        text = css_files[f]
        for s, e, new in sorted(set(es), reverse=True):
            text = text[:s] + new + text[e:]
        open(f, "w", encoding="utf-8").write(text)
    print("applied to", len(edits), "files")
