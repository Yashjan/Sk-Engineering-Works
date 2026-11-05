import { createRequire } from "node:module"; const require = createRequire(process.argv[2] + "/x.js");
const puppeteer = require("puppeteer-core");
const b = await puppeteer.launch({ executablePath: "/usr/bin/google-chrome", headless: true, args: ["--no-sandbox"] });
for (const [label, origin] of [["base", process.argv[3]], ["curr", process.argv[4]]]) for (const [vpName, vp, reduce] of [["desktop", { width: 1440, height: 900 }, "no-preference"], ["desktop-reduced", { width: 1440, height: 900 }, "reduce"], ["mobile", { width: 390, height: 844, isMobile: true, deviceScaleFactor: 2 }, "no-preference"]]) {
  const ctx = await b.createBrowserContext(); const page = await ctx.newPage(); await page.setViewport(vp);
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: reduce }]);
  await page.goto(origin + "/projects/", { waitUntil: "networkidle2" });
  await page.waitForFunction(() => document.documentElement.dataset.skIntro === "done", { timeout: 20000 }).catch(() => {});
  await page.evaluate(() => { const g = document.querySelector(".projects-visual-gallery-card"); const y = g.getBoundingClientRect().top + scrollY - 200; if (window.__lenis) window.__lenis.scrollTo(y + 1400, { immediate: true }); else scrollTo(0, y + 1400); });
  await new Promise((r) => setTimeout(r, 2000));
  const rows = await page.evaluate(() => [...document.querySelectorAll(".projects-visual-gallery-card")].slice(0, 5).map((c) => {
    const m = c.querySelector(".projects-visual-gallery-media"); const r = c.getBoundingClientRect();
    return `${c.dataset.active === "true" ? "A" : "-"} card=${(+getComputedStyle(c).opacity).toFixed(2)}${c.style.opacity ? "(inline)" : "(css)"} media=${(+getComputedStyle(m).opacity).toFixed(2)} → photo=${(getComputedStyle(c).opacity * getComputedStyle(m).opacity).toFixed(2)} caption=${(+getComputedStyle(c).opacity).toFixed(2)} ${r.right > 0 && r.left < innerWidth && r.bottom > 0 && r.top < innerHeight ? "visible" : ""}`; }));
  console.log(`${label} ${vpName}\n   ${rows.join("\n   ")}`);
  await ctx.close();
}
await b.close();
