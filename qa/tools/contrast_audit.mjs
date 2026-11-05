// Detailed WCAG AA colour-contrast audit (axe-core) across EN/HI/AR at mobile and desktop widths.
// usage: QA_NODE_MODULES=/path/with/puppeteer-core+axe-core node contrast_audit.mjs <origin> <out.json>
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";

const modules = process.env.QA_NODE_MODULES;
const require = createRequire(path.join(modules, "noop.js"));
const puppeteer = require("puppeteer-core");
const axeSource = fs.readFileSync(path.join(modules, "axe-core/axe.min.js"), "utf8");
const [origin, outFile] = process.argv.slice(2);
// QA_PAGES="engineering/,machinery/cyclone/" limits the run to specific pages.
const allPaths = ["", "about/", "engineering/", "salt-refinery-plants/", "machinery/", "machinery/belt-conveyor/", "machinery/screw-conveyor/", "contact/", "projects/", "projects/jk-salt-santalpur/", "projects/jagdamba-salt-15tph/", "projects/royal-salt-jambusar/", "machinery/cyclone/", "machinery/dryer/"];
const paths = process.env.QA_PAGES ? process.env.QA_PAGES.split(",") : allPaths;
const locales = ["", "hi/", "ar/"];
const viewports = [{ name: "mobile", width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }, { name: "desktop", width: 1440, height: 900 }];
const browser = await puppeteer.launch({ executablePath: process.env.CHROME || "/usr/bin/google-chrome", headless: true, args: ["--no-sandbox"] });
const all = [];
for (const vp of viewports) for (const loc of locales) for (const p of paths) {
  const url = `${origin}/${loc}${p}`;
  const page = await browser.newPage();
  await page.setViewport(vp);
  // Reduced motion: every reveal is in its final state, so contrast is measured on settled content.
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await page.goto(url, { waitUntil: "networkidle2", timeout: 90000 }).catch(() => {});
  await page.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 30)); } window.scrollTo(0, 0); });
  await new Promise((r) => setTimeout(r, 500));
  await page.addScriptTag({ content: axeSource });
  const nodes = await page.evaluate(async () => {
    const res = await window.axe.run(document, { runOnly: ["color-contrast"], resultTypes: ["violations", "incomplete"] });
    const out = [];
    for (const v of res.violations) for (const n of v.nodes) {
      const d = n.any[0]?.data || {};
      const el = document.querySelector(n.target[0]);
      out.push({ selector: n.target.join(" "), cls: el ? [...el.classList].join(".") : "", text: (el?.textContent || "").trim().slice(0, 40), fg: d.fgColor, bg: d.bgColor, ratio: d.contrastRatio, need: d.expectedContrastRatio, size: d.fontSize, weight: d.fontWeight });
    }
    return out;
  });
  for (const n of nodes) all.push({ viewport: vp.name, url: `/${loc}${p}`, ...n });

  // Interactive states: force :hover and :focus-visible on every visible link/button and re-check it.
  const cdp = await page.createCDPSession();
  await cdp.send("DOM.enable"); await cdp.send("CSS.enable");
  const { root } = await cdp.send("DOM.getDocument", { depth: 0 });
  const { nodeIds } = await cdp.send("DOM.querySelectorAll", { nodeId: root.nodeId, selector: "a[href], button, summary, [role='menuitemradio']" });
  for (const state of [["hover"], ["focus", "focus-visible"]]) {
    for (const nodeId of nodeIds) await cdp.send("CSS.forcePseudoState", { nodeId, forcedPseudoClasses: state }).catch(() => {});
    await new Promise((r) => setTimeout(r, 400)); // let colour transitions settle
    const stateNodes = await page.evaluate(async () => {
      const targets = [...document.querySelectorAll("a[href], button, summary, [role='menuitemradio']")].filter((el) => { const r = el.getBoundingClientRect(); return r.width && r.height && getComputedStyle(el).visibility !== "hidden"; });
      const res = await window.axe.run(targets, { runOnly: ["color-contrast"], resultTypes: ["violations"] });
      return res.violations.flatMap((v) => v.nodes.map((n) => { const d = n.any[0]?.data || {}; const el = document.querySelector(n.target[0]); return { selector: n.target.join(" "), cls: el ? [...el.classList].join(".") : "", text: (el?.textContent || "").trim().slice(0, 40), fg: d.fgColor, bg: d.bgColor, ratio: d.contrastRatio, need: d.expectedContrastRatio, size: d.fontSize, weight: d.fontWeight }; }));
    });
    for (const n of stateNodes) all.push({ viewport: vp.name, url: `/${loc}${p}`, state: state.at(-1), ...n });
    for (const nodeId of nodeIds) await cdp.send("CSS.forcePseudoState", { nodeId, forcedPseudoClasses: [] }).catch(() => {});
  }
  await page.close();
}
await browser.close();
fs.writeFileSync(outFile, JSON.stringify(all, null, 1));
console.log(`${all.length} contrast violations`);
