// For every element axe flags for colour contrast, find the CSS rule that supplies its `color`
// (via CDP CSS.getMatchedStylesForNode), so fixes can be made at the source declaration.
// usage: QA_NODE_MODULES=… node contrast_sources.mjs <origin> <contrast.json> <out.json>
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";

const require = createRequire(path.join(process.env.QA_NODE_MODULES, "noop.js"));
const puppeteer = require("puppeteer-core");
const [origin, inFile, outFile] = process.argv.slice(2);
const violations = JSON.parse(fs.readFileSync(inFile, "utf8"));
const byPage = new Map();
for (const v of violations) {
  const k = `${v.viewport} ${v.url}`;
  if (!byPage.has(k)) byPage.set(k, []);
  byPage.get(k).push(v);
}
const browser = await puppeteer.launch({ executablePath: process.env.CHROME || "/usr/bin/google-chrome", headless: true, args: ["--no-sandbox"] });
const results = [];
for (const [k, list] of byPage) {
  const [vpName, url] = k.split(" ");
  const page = await browser.newPage();
  await page.setViewport(vpName === "mobile" ? { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 } : { width: 1440, height: 900 });
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await page.goto(origin + url, { waitUntil: "networkidle2", timeout: 90000 }).catch(() => {});
  await page.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 30)); } });
  const cdp = await page.createCDPSession();
  await cdp.send("DOM.enable"); await cdp.send("CSS.enable");
  const { root } = await cdp.send("DOM.getDocument", { depth: -1, pierce: false });
  for (const v of list) {
    const sel = v.selector.split(" ").length > 1 && !v.selector.includes(">") ? v.selector : v.selector;
    let nodeId;
    try { ({ nodeId } = await cdp.send("DOM.querySelector", { nodeId: root.nodeId, selector: sel })); } catch { nodeId = 0; }
    if (!nodeId) { results.push({ ...v, source: null }); continue; }
    const m = await cdp.send("CSS.getMatchedStylesForNode", { nodeId });
    const pick = (rules) => {
      for (let i = rules.length - 1; i >= 0; i--) {
        const r = rules[i].rule;
        const prop = r.style.cssProperties.filter((p) => p.name === "color" && !p.disabled && p.parsedOk !== false).pop();
        if (prop) return { selector: r.selectorList.text, value: prop.value, media: (r.media || []).map((x) => x.text).join(" & ") };
      }
      return null;
    };
    let source = null, inheritedDepth = 0;
    const inlineColor = m.inlineStyle?.cssProperties.find((p) => p.name === "color");
    if (inlineColor) source = { selector: "(inline style)", value: inlineColor.value };
    else source = pick(m.matchedCSSRules || []);
    if (!source) for (const inh of m.inherited || []) { inheritedDepth++; source = pick(inh.matchedCSSRules || []); if (source) break; }
    // Opacity on the element or ancestors also lowers effective contrast.
    const opacity = await page.evaluate((s) => { let el = document.querySelector(s), o = 1; while (el) { o *= Number(getComputedStyle(el).opacity); el = el.parentElement; } return o; }, sel).catch(() => null);
    results.push({ ...v, source, inheritedDepth, opacity });
  }
  await page.close();
}
await browser.close();
fs.writeFileSync(outFile, JSON.stringify(results, null, 1));
console.log(`mapped ${results.filter((r) => r.source).length}/${results.length}`);
