// Salt-process stepper: effective text and divider-line opacity (row opacity × colour alpha) per step, idle / hover / mobile.
// usage: node qa/tools/stepper_probe.mjs <node_modules with puppeteer-core> <base origin> <current origin>
import { createRequire } from "node:module";
import path from "node:path";
const load = createRequire(path.join(process.argv[2], "x.js"));
const puppeteer = load("puppeteer-core");
const [, , , baseOrigin, currOrigin] = process.argv;
const browser = await puppeteer.launch({ executablePath: process.env.CHROME || "/usr/bin/google-chrome", headless: true, args: ["--no-sandbox"] });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const measure = (listSel) => [...document.querySelectorAll(`${listSel} .raw-process-stage-item`)].slice(0, 4).map((li) => {
  const op = +getComputedStyle(li).opacity;
  const alpha = (el) => { const parts = getComputedStyle(el).color.match(/\(([^)]+)\)/)[1].split(/[ ,/]+/).filter(Boolean); return parts.length > 3 ? +parts[3] : 1; };
  const name = li.querySelector("strong"), num = li.querySelector(".raw-process-stage-number");
  const row = li.querySelector("button"), line = getComputedStyle(row).borderBottomColor;
  const lineAlpha = (() => { const parts = line.match(/\(([^)]+)\)/)[1].split(/[ ,/]+/).filter(Boolean); return parts.length > 3 ? +parts[3] : 1; })();
  return `${li.dataset.active === "true" ? "ACTIVE  " : "inactive"} name=${(op * alpha(name)).toFixed(2)} number=${(op * alpha(num)).toFixed(2)} line=${(op * lineAlpha * 100).toFixed(1)}%`;
});
for (const [label, origin] of [["base", baseOrigin], ["curr", currOrigin]]) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`${origin}/salt-refinery-plants/`, { waitUntil: "networkidle2" });
  await page.waitForFunction(() => document.documentElement.dataset.skIntro === "done", { timeout: 20000 }).catch(() => {});
  await page.evaluate(() => document.querySelector(".raw-process-desktop-list").scrollIntoView({ block: "center" }));
  await wait(1500);
  const idle = await page.evaluate(measure, ".raw-process-desktop-list");
  const items = await page.$$(".raw-process-desktop-list .raw-process-stage-item");
  const box = await items[2].boundingBox();
  await page.mouse.move(box.x + 40, box.y + box.height / 2);
  await wait(700);
  const hover = await page.evaluate(measure, ".raw-process-desktop-list");
  await page.close();
  const mob = await browser.newPage();
  await mob.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await mob.goto(`${origin}/salt-refinery-plants/`, { waitUntil: "networkidle2" });
  await mob.waitForFunction(() => document.documentElement.dataset.skIntro === "done", { timeout: 20000 }).catch(() => {});
  await mob.evaluate(() => document.querySelector(".raw-process-mobile-list")?.scrollIntoView({ block: "center" }));
  await wait(1200);
  const mobile = await mob.evaluate(measure, ".raw-process-mobile-list");
  await mob.close();
  console.log(`${label}\n  desktop idle:        ${idle.join(" | ")}\n  desktop hover row 3: ${hover.join(" | ")}\n  mobile:              ${mobile.join(" | ")}`);
}
await browser.close();
