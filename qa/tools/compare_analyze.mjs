// Compare base vs current behavioural snapshots + pixel diffs.
// usage: node qa/tools/compare_analyze.mjs <dir containing base.json, current.json, base/, current/>  (run from the repo root so sharp resolves)
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
const load = createRequire(path.join(process.cwd(), "package.json"));
const sharp = load("sharp");
const dir = process.argv[2];
const A = JSON.parse(fs.readFileSync(path.join(dir, "base.json"))), B = JSON.parse(fs.readFileSync(path.join(dir, "current.json")));
const strip = (s) => Object.fromEntries(Object.entries(s).filter(([k]) => k !== "shot" && k !== "gsapStyled"));
(async () => {
  const pix = [];
  for (const key of Object.keys(A).filter((k) => k.includes(":"))) {
    const a = A[key], b = B[key];
    if (!b) { console.log("MISSING in current", key); continue; }
    if (a.errors.join() !== b.errors.join()) console.log(`ERRORS differ ${key}\n   base: ${JSON.stringify(a.errors)}\n   curr: ${JSON.stringify(b.errors)}`);
    else if (a.errors.length) console.log(`errors (same in both) ${key}: ${JSON.stringify(a.errors)}`);
    if (a.snaps.length !== b.snaps.length) console.log(`STEP COUNT differs ${key}: ${a.snaps.length} vs ${b.snaps.length}`);
    for (let i = 0; i < Math.min(a.snaps.length, b.snaps.length); i++) {
      const sa = strip(a.snaps[i]), sb = strip(b.snaps[i]);
      for (const f of ["y", "h", "pins", "pinned", "lenis", "lenisClass", "intro"]) if (JSON.stringify(sa[f]) !== JSON.stringify(sb[f])) console.log(`STATE ${key} #${i} ${f}: ${JSON.stringify(sa[f])} -> ${JSON.stringify(sb[f])}`);
      const vk = (v) => `${v.cls}|${v.src}|${v.hasPoster}|inView=${v.inView}|paused=${v.paused}|ready=${v.ready >= 2 ? "data" : v.ready}`;
      const va = sa.videos.map(vk).join("\n"), vb = sb.videos.map(vk).join("\n");
      if (va !== vb) {
        const la = va.split("\n"), lb = vb.split("\n");
        for (let j = 0; j < Math.max(la.length, lb.length); j++) if (la[j] !== lb[j]) console.log(`VIDEO ${key} #${i} [${j}]\n   base: ${la[j]}\n   curr: ${lb[j]}`);
      }
      if (JSON.stringify(sa.canvases) !== JSON.stringify(sb.canvases)) console.log(`CANVAS ${key} #${i}: ${JSON.stringify(sa.canvases)} -> ${JSON.stringify(sb.canvases)}`);
      if (Math.abs(a.snaps[i].gsapStyled - b.snaps[i].gsapStyled) > 0) console.log(`inline-styled element count ${key} #${i}: ${a.snaps[i].gsapStyled} -> ${b.snaps[i].gsapStyled}`);
      // pixel diff
      const fa = path.join(dir, "base", a.snaps[i].shot), fb = path.join(dir, "current", b.snaps[i].shot);
      const [ra, rb] = await Promise.all([sharp(fa).raw().toBuffer({ resolveWithObject: true }), sharp(fb).raw().toBuffer({ resolveWithObject: true })]);
      if (ra.info.width !== rb.info.width || ra.info.height !== rb.info.height) { console.log("SIZE differs", key, i); continue; }
      const { width: W, height: H, channels: C } = ra.info; let changed = 0; let minX = W, minY = H, maxX = 0, maxY = 0;
      const mask = Buffer.alloc(W * H * 3);
      for (let p = 0; p < W * H; p++) {
        let d = 0; for (let c = 0; c < 3; c++) d = Math.max(d, Math.abs(ra.data[p * C + c] - rb.data[p * C + c]));
        if (d > 20) { changed++; const x = p % W, y = (p / W) | 0; minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y); mask[p * 3] = 255; }
        else { const g = ra.data[p * C] * 0.3; mask[p * 3] = mask[p * 3 + 1] = mask[p * 3 + 2] = g; }
      }
      const pct = (100 * changed) / (W * H);
      pix.push({ key, i, pct, box: changed ? [minX, minY, maxX, maxY] : null, shot: a.snaps[i].shot });
      if (pct > 0.05) {
        await sharp({ create: { width: W * 3 + 20, height: H, channels: 3, background: "#f00" } }).composite([
          { input: await sharp(fa).removeAlpha().png().toBuffer(), left: 0, top: 0 },
          { input: await sharp(fb).removeAlpha().png().toBuffer(), left: W + 10, top: 0 },
          { input: await sharp(mask, { raw: { width: W, height: H, channels: 3 } }).png().toBuffer(), left: 2 * W + 20, top: 0 },
        ]).png().toBuffer().then((buf) => sharp(buf).resize({ width: Math.min(2400, W * 3 + 20) }).jpeg({ quality: 70 }).toFile(path.join(dir, "diff_" + a.snaps[i].shot.replace(".png", ".jpg"))));
      }
    }
  }
  console.log("\nPIXEL DIFF (>0.05% of pixels changed by >20/255; video+canvas masked):");
  for (const r of pix.filter((r) => r.pct > 0.05).sort((x, y) => y.pct - x.pct)) console.log(`  ${r.pct.toFixed(2).padStart(6)}%  ${r.key} #${r.i}  box=${JSON.stringify(r.box)}  ${r.shot}`);
  console.log(`  ${pix.filter((r) => r.pct <= 0.05).length}/${pix.length} screenshots identical within noise`);
  console.log("\nPROBES base:", JSON.stringify(A.probes), "\nPROBES curr:", JSON.stringify(B.probes));
  console.log("\nPROJECTS SHOWCASE base:", JSON.stringify(A.projectsShowcase), "\nPROJECTS SHOWCASE curr:", JSON.stringify(B.projectsShowcase));
  console.log("\n3D base:", JSON.stringify(A.threeD), "\n3D curr:", JSON.stringify(B.threeD));
})();
