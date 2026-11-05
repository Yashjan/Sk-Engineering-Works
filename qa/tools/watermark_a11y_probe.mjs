// Confirms the decorative .about-page-regions watermark is aria-hidden and absent from the accessibility tree (EN/HI/AR About).
// usage: node qa/tools/watermark_a11y_probe.mjs <node_modules with puppeteer-core> <origin>
import { createRequire } from "node:module"; import path from "node:path";
const load = createRequire(path.join(process.argv[2], "x.js")); const puppeteer = load("puppeteer-core");
const browser = await puppeteer.launch({ executablePath: "/usr/bin/google-chrome", headless: true, args: ["--no-sandbox"] });
for (const loc of ["", "hi/", "ar/"]) {
  const page = await browser.newPage(); await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`${process.argv[3]}/${loc}about/`, { waitUntil: "networkidle2" });
  await page.waitForFunction(() => document.documentElement.dataset.skIntro === "done", { timeout: 20000 }).catch(() => {});
  const el = await page.$(".about-page-regions");
  const node = await page.accessibility.snapshot({ root: el, interestingOnly: false });
  const info = await page.evaluate(() => { const r = document.querySelector(".about-page-regions"); return { ariaHidden: r.getAttribute("aria-hidden"), text: r.textContent, focusable: r.querySelectorAll("a,button,input,[tabindex]").length }; });
  const tree = await page.accessibility.snapshot(); const flat = JSON.stringify(tree);
  console.log(`${loc || "en/"} aria-hidden=${info.ariaHidden} focusable=${info.focusable} axNode=${node ? JSON.stringify(node) : "none"} text="${info.text}" spans-in-tree=${["RAJASTHAN", "GUJARAT", info.text.slice(0, 6)].map((t) => flat.includes(`"name":"${t}"`)).join("/")}`);
  await page.close();
}
await browser.close();
