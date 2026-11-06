// Video control labels as a screen reader gets them: for every play/pause/sound button, the
// accessible name (Chrome accessibility tree) and visible text before and after one click, in EN/HI/AR.
// Buttons are matched by their position among English video controls, so the same control is compared across locales.
// usage: node qa/tools/video_labels_probe.mjs <node_modules with puppeteer-core> <origin>
import { createRequire } from "node:module";
import path from "node:path";
const load = createRequire(path.join(process.argv[2], "x.js"));
const puppeteer = load("puppeteer-core");
const origin = process.argv[3];
const pages = ["", "machinery/", "projects/jagdamba-salt-15tph/", "projects/jk-salt-santalpur/", "projects/royal-salt-jambusar/", "projects/belt-conveyor/"];
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const launch = () => puppeteer.launch({ executablePath: process.env.CHROME || "/usr/bin/google-chrome", headless: true, args: ["--no-sandbox", "--autoplay-policy=no-user-gesture-required"] });
let browser;
const controlPattern = /^(Play|Pause|Mute|Turn) .*(video|film|footage|clip \d+|sound on)$/;

async function open(url) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(url, { waitUntil: "networkidle2" });
  await page.waitForFunction(() => document.documentElement.dataset.skIntro === "done", { timeout: 20000 }).catch(() => {});
  return page;
}
async function describe(page, index) {
  const handle = (await page.$$("button"))[index];
  const ax = await page.accessibility.snapshot({ root: handle, interestingOnly: false });
  const text = await handle.evaluate((b) => b.textContent.replace(/\s+/g, " ").trim());
  return `"${ax?.name ?? "(none)"}" [${text}]`;
}

let missing = 0;
for (const p of pages) {
  browser = await launch(); // a fresh browser per page: state left by one page must not affect the next
  const en = await open(`${origin}/${p}`);
  const indices = await en.evaluate((src) => [...document.querySelectorAll("button")].map((b, i) => [i, b.getAttribute("aria-label") || ""]).filter(([, l]) => new RegExp(src).test(l)).map(([i]) => i), controlPattern.source);
  await en.close();
  console.log(`\n## /${p || ""}  (${indices.length} controls)`);
  for (const loc of ["", "hi/", "ar/"]) {
    const page = await open(`${origin}/${loc}${p}`);
    for (const i of indices) {
      await page.evaluate((i) => document.querySelectorAll("button")[i].scrollIntoView({ block: "center" }), i);
      await wait(1500);
      const before = await describe(page, i);
      await page.evaluate((i) => document.querySelectorAll("button")[i].click(), i);
      await wait(800);
      const after = await describe(page, i);
      if (loc && /"(Play|Pause|Mute|Turn) /.test(before + after)) missing++;
      console.log(`  ${(loc || "en/").padEnd(4)} #${i}  ${before}  ->click->  ${after}`);
      await page.evaluate((i) => document.querySelectorAll("button")[i].click(), i);
      await wait(300);
    }
    await page.close();
  }
  await browser.close();
}
console.log(`\nuntranslated names in hi/ar: ${missing}`);
