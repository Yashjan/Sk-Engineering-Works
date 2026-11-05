"""Validate a Next static export for GitHub Pages (base path /Sk-Engineering-Works)."""
import html, os, re, sys, urllib.parse
from html.parser import HTMLParser

OUT = sys.argv[1]
BASE = "/Sk-Engineering-Works"
SITE = "https://yashjan.github.io" + BASE
EXPECT = {"en": ("en-IN", "ltr"), "hi": ("hi", "ltr"), "ar": ("ar", "rtl")}
fails = []

def fail(url, cause):
    fails.append((url, cause))

class P(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.html = {}; self.links = []; self.metas = []; self.anchors = []; self.assets = []
        self.imgs = []; self.headings = []; self.text = []; self._h = None; self._skip = 0; self.title = ""; self._t = False
        self.ids = set(); self.labels_for = set(); self.inputs = []
    def handle_starttag(self, tag, a):
        a = dict(a)
        if "id" in a: self.ids.add(a["id"])
        if tag == "html": self.html = a
        elif tag == "link": self.links.append(a)
        elif tag == "meta": self.metas.append(a)
        elif tag == "a": self.anchors.append(a)
        elif tag == "title": self._t = True
        elif tag == "label" and a.get("for"): self.labels_for.add(a["for"])
        elif tag in ("input", "select", "textarea") and a.get("type") not in ("hidden", "submit", "button"): self.inputs.append(a)
        if tag in ("script", "style"): self._skip += 1
        if tag == "img": self.imgs.append(a)
        for k in ("src", "poster", "href"):
            v = a.get(k)
            if v and tag in ("img", "video", "source", "script", "link") and not (tag == "link" and a.get("rel") in ("canonical", "alternate")):
                self.assets.append((tag, v))
        for k in ("srcset", "imagesrcset"):
            if a.get(k):
                for part in a[k].split(","):
                    u = part.strip().split(" ")[0]
                    if u: self.assets.append((tag, u))
        if re.fullmatch(r"h[1-6]", tag): self._h = [int(tag[1]), ""]
    def handle_endtag(self, tag):
        if tag in ("script", "style"): self._skip -= 1
        if tag == "title": self._t = False
        if self._h and tag == f"h{self._h[0]}": self.headings.append(tuple(self._h)); self._h = None
    def handle_data(self, d):
        if self._t: self.title += d
        if self._skip: return
        if self._h: self._h[1] += d
        self.text.append(d)

def url_for(rel):
    p = rel.replace(os.sep, "/")
    p = "" if p == "index.html" else p[: -len("index.html")]
    return f"{SITE}/{p}"

def resolve(path):
    """Map a /Sk-Engineering-Works/... URL path to a file in OUT; return True if it exists."""
    path = urllib.parse.unquote(path.split("#")[0].split("?")[0])
    if not path.startswith(BASE + "/") and path != BASE:
        return False
    rel = path[len(BASE):].lstrip("/")
    cand = os.path.join(OUT, rel)
    if os.path.isfile(cand): return True
    if os.path.isfile(os.path.join(cand, "index.html")): return True
    return False

pages = {}
for root, _, files in os.walk(OUT):
    for f in files:
        if f == "index.html":
            rel = os.path.relpath(os.path.join(root, f), OUT)
            if rel.startswith(("_not-found", "404")): continue
            pages[rel] = url_for(rel)

alts_by_url = {}
checked_assets = {}
for rel, url in sorted(pages.items()):
    src = open(os.path.join(OUT, rel), encoding="utf-8").read()
    p = P(); p.feed(src)
    first = rel.split("/")[0]
    loc = first if first in ("hi", "ar") else "en"
    lang, d = EXPECT[loc]
    if p.html.get("lang") != lang: fail(url, f"html lang={p.html.get('lang')!r}, expected {lang!r}")
    if p.html.get("dir") != d: fail(url, f"html dir={p.html.get('dir')!r}, expected {d!r}")
    canon = [l["href"] for l in p.links if l.get("rel") == "canonical"]
    if canon != [url]: fail(url, f"canonical {canon} != self")
    robots = [m.get("content") for m in p.metas if m.get("name") == "robots"]
    noindex = any("noindex" in (r or "") for r in robots)
    alts = {l.get("hreflang"): l["href"] for l in p.links if l.get("rel") == "alternate" and l.get("hreflang")}
    alts_by_url[url] = (alts, noindex)
    if not noindex:
        for need in ("en", "hi", "ar", "x-default"):
            if need not in alts: fail(url, f"missing hreflang {need}")
        if alts.get(loc) != url: fail(url, f"hreflang {loc} points to {alts.get(loc)}, not self")
    if not p.title.strip(): fail(url, "empty <title>")
    desc = [m.get("content") for m in p.metas if m.get("name") == "description"]
    if not desc or not desc[0].strip(): fail(url, "missing meta description")
    ogurl = [m.get("content") for m in p.metas if m.get("property") == "og:url"]
    if ogurl and ogurl[0] != url: fail(url, f"og:url {ogurl[0]} != canonical")
    text = " ".join(p.text)
    # Localized text check: proportion of script characters in visible text and title
    letters = re.findall(r"[A-Za-zऀ-ॿ؀-ۿ]", text)
    if loc == "hi":
        share = len(re.findall(r"[ऀ-ॿ]", text)) / max(1, len(letters))
        if share < 0.5: fail(url, f"Hindi page visible text only {share:.0%} Devanagari")
        if not re.search(r"[ऀ-ॿ]", p.title): fail(url, "title not in Hindi")
    if loc == "ar":
        share = len(re.findall(r"[؀-ۿ]", text)) / max(1, len(letters))
        if share < 0.5: fail(url, f"Arabic page visible text only {share:.0%} Arabic script")
        if not re.search(r"[؀-ۿ]", p.title): fail(url, "title not in Arabic")
    if loc == "en" and re.search(r"[ऀ-ॿ؀-ۿ]{4,}", " ".join(h[1] for h in p.headings)):
        fail(url, "English page heading contains Hindi/Arabic text")
    # Headings
    h1 = [h for h in p.headings if h[0] == 1]
    if len(h1) != 1: fail(url, f"{len(h1)} <h1> elements")
    prev = 0
    for lvl, t in p.headings:
        if prev and lvl > prev + 1:
            fail(url, f"heading level skip h{prev}->h{lvl} ('{t.strip()[:40]}')"); break
        prev = lvl
    # Images alt
    for img in p.imgs:
        if "alt" not in img: fail(url, f"<img> without alt: {img.get('src','')[:80]}")
    # Form labelling
    for i in p.inputs:
        if not (i.get("aria-label") or i.get("aria-labelledby") or (i.get("id") in p.labels_for)):
            # might be wrapped in <label>; check textual wrapper
            pat = re.escape(f'name="{i.get("name","")}"')
            if not re.search(r"<label[^>]*>(?:(?!</label>).)*" + pat, src, re.S):
                fail(url, f"form control without label: name={i.get('name')}")
    # Internal links
    for a in p.anchors:
        h = a.get("href")
        if not h or h.startswith(("mailto:", "tel:", "https://wa.me", "javascript:")): continue
        if h.startswith("#"):
            if len(h) > 1 and h[1:] not in p.ids: fail(url, f"in-page anchor {h} has no target")
            continue
        if h.startswith(SITE): h = h[len("https://yashjan.github.io"):]
        if h.startswith("http"): continue
        if not h.startswith("/"): fail(url, f"relative href {h}"); continue
        if not h.startswith(BASE + "/") and h != BASE: fail(url, f"link missing base path: {h}"); continue
        if not resolve(h): fail(url, f"broken internal link {h}")
        elif not h.split("#")[0].split("?")[0].endswith("/") and "." not in h.rsplit("/", 1)[-1]:
            fail(url, f"link without trailing slash (redirect hop): {h}")
    for tag, v in p.assets:
        if v.startswith(("data:", "http", "blob:")): continue
        if not v.startswith(BASE + "/"): fail(url, f"<{tag}> asset missing base path: {v}"); continue
        if v not in checked_assets: checked_assets[v] = resolve(v)
        if not checked_assets[v]: fail(url, f"<{tag}> asset 404: {v}")

# hreflang reciprocity + targets exist
for url, (alts, noindex) in alts_by_url.items():
    for k, target in alts.items():
        if target not in alts_by_url: fail(url, f"hreflang {k} target not exported: {target}"); continue
        back = alts_by_url[target][0]
        if url not in back.values(): fail(url, f"hreflang {k} -> {target} is not reciprocal")

# Sitemap
sm = open(os.path.join(OUT, "sitemap.xml"), encoding="utf-8").read()
locs = set(re.findall(r"<loc>(.*?)</loc>", sm))
for l in locs:
    if l not in alts_by_url: fail(f"{SITE}/sitemap.xml", f"sitemap URL not exported: {l}")
    elif alts_by_url[l][1]: fail(f"{SITE}/sitemap.xml", f"sitemap lists noindex page: {l}")
for url, (alts, noindex) in alts_by_url.items():
    if not noindex and url not in locs: fail(url, "indexable page missing from sitemap.xml")
if not os.path.isfile(os.path.join(OUT, "robots.txt")): fail(f"{SITE}/robots.txt", "robots.txt not generated in export")
else:
    r = open(os.path.join(OUT, "robots.txt")).read()
    if f"Sitemap: {SITE}/sitemap.xml" not in r: fail(f"{SITE}/robots.txt", "Sitemap line missing/wrong")
if not os.path.isfile(os.path.join(OUT, "404.html")): fail(f"{SITE}/404.html", "missing 404.html")

print(f"pages={len(pages)} sitemap_urls={len(locs)} assets_checked={len(checked_assets)} failures={len(fails)}")
from collections import Counter
causes = Counter(re.sub(r"(/Sk-Engineering-Works\S*|'[^']*'|\d+%)", "…", c) for _, c in fails)
for c, n in causes.most_common(): print(f"  {n:4d}  {c}")
print()
for u, c in fails: print(f"FAIL {u} :: {c}")
