// Real-browser checks against a served export: overflow, RTL, keyboard, language menu, reduced motion, axe.
// usage: QA_NODE_MODULES=/path/with/puppeteer-core+axe-core node qa/tools/browser_checks.mjs <origin>
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
const require = createRequire(path.join(process.env.QA_NODE_MODULES, "noop.js"));
const puppeteer = require("puppeteer-core");
const ORIGIN = process.argv[2]; // e.g. http://localhost:4200/Sk-Engineering-Works
const axeSource = fs.readFileSync(path.join(process.env.QA_NODE_MODULES, "axe-core/axe.min.js"), "utf8");
const paths = ["", "about/", "engineering/", "salt-refinery-plants/", "machinery/", "machinery/belt-conveyor/", "contact/", "projects/"];
const locales = ["", "hi/", "ar/"];
const results = [];
const fail = (url, cause) => results.push(`FAIL ${url} :: ${cause}`);
const browser = await puppeteer.launch({ executablePath: "/usr/bin/google-chrome", headless: true, args: ["--no-sandbox", "--autoplay-policy=no-user-gesture-required"] });

async function open(url, { width, height, mobile = false, reduce = false }) {
  const page = await browser.newPage();
  page.on("pageerror", (e) => fail(url, `JS error: ${e.message.slice(0, 140)}`));
  await page.setViewport({ width, height, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: mobile ? 2 : 1 });
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: reduce ? "reduce" : "no-preference" }]);
  const resp = await page.goto(url, { waitUntil: "networkidle2", timeout: 90000 }).catch((e) => { fail(url, `navigation: ${e.message}`); return null; });
  if (resp && resp.status() >= 400) fail(url, `HTTP ${resp.status()}`);
  return page;
}

for (const loc of locales) for (const p of paths) {
  const url = `${ORIGIN}/${loc}${p}`;
  // Mobile overflow (375px) + reduced motion: intro must finish immediately, content interactive.
  let page = await open(url, { width: 375, height: 812, mobile: true, reduce: true });
  await new Promise((r) => setTimeout(r, 600));
  const m = await page.evaluate(async () => {
    const doc = document.documentElement;
    // Scroll through the page so lazily-mounted sections render, then measure.
    for (let y = 0; y < doc.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); }
    window.scrollTo(0, 0);
    const vw = doc.clientWidth;
    const offenders = [];
    for (const el of document.querySelectorAll("body *")) {
      const r = el.getBoundingClientRect();
      if (!r.width || getComputedStyle(el).position === "fixed") continue;
      if (r.right > vw + 1 || r.left < -1) {
        // ignore elements inside a clipping/scrolling ancestor
        let a = el.parentElement, clipped = false;
        while (a && a !== document.body) { const s = getComputedStyle(a); if (/(hidden|auto|scroll|clip)/.test(s.overflowX)) { const ar = a.getBoundingClientRect(); if (ar.right <= vw + 1 && ar.left >= -1) { clipped = true; break; } } a = a.parentElement; }
        if (!clipped) offenders.push(`${el.tagName.toLowerCase()}.${[...el.classList].slice(0, 2).join(".")} [${Math.round(r.left)},${Math.round(r.right)}]`);
      }
    }
    return {
      scrollW: doc.scrollWidth, vw, offenders: offenders.slice(0, 4), intro: doc.dataset.skIntro,
      inert: [...document.querySelectorAll("#main, [data-navbar]")].some((e) => e.inert),
      dir: doc.dir, lang: doc.lang, bodyDir: getComputedStyle(document.body).direction,
      runningAnims: document.getAnimations().filter((a) => a.playState === "running" && !(a.effect?.target?.closest?.(".progressive-image,.progressive-video"))).length,
    };
  });
  if (m.scrollW > m.vw + 1) fail(url, `mobile 375px horizontal overflow: scrollWidth ${m.scrollW} > ${m.vw}; ${m.offenders.join(" | ")}`);
  if (m.intro !== "done" || m.inert) fail(url, `reduced-motion: intro=${m.intro} inert=${m.inert}`);
  const wantDir = loc === "ar/" ? "rtl" : "ltr";
  if (m.dir !== wantDir || m.bodyDir !== wantDir) fail(url, `dir after hydration html=${m.dir} body=${m.bodyDir}, expected ${wantDir}`);
  const wantLang = loc === "ar/" ? "ar" : loc === "hi/" ? "hi" : "en-IN";
  if (m.lang !== wantLang) fail(url, `lang after hydration ${m.lang}, expected ${wantLang}`);
  if (m.runningAnims) fail(url, `reduced-motion: ${m.runningAnims} CSS/WAAPI animations still running`);
  // axe (WCAG A/AA) on mobile render
  await page.addScriptTag({ content: axeSource });
  const axe = await page.evaluate(async () => (await window.axe.run(document, { runOnly: ["wcag2a", "wcag2aa", "wcag21aa"], resultTypes: ["violations"] })).violations.map((v) => `${v.id}(${v.impact}) x${v.nodes.length}: ${v.nodes[0].target.join(" ")}`));
  for (const v of axe) fail(url, `axe ${v}`);
  await page.close();

  // Desktop keyboard: wait for intro, Tab through first 12 stops; each must be visible with a focus indicator.
  if (p === "" || p === "machinery/" || p === "contact/") {
    page = await open(url, { width: 1440, height: 900 });
    await page.waitForFunction(() => document.documentElement.dataset.skIntro === "done", { timeout: 15000 }).catch(() => fail(url, "intro never finished"));
    await new Promise((r) => setTimeout(r, 1500));
    const stops = [];
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press("Tab");
      stops.push(await page.evaluate(() => {
        const el = document.activeElement; if (!el || el === document.body) return { name: "body" };
        const r = el.getBoundingClientRect(); const s = getComputedStyle(el);
        const visible = r.width > 0 && r.height > 0 && s.visibility !== "hidden" && Number(s.opacity) > 0.05;
        // A ring may be drawn on the element or on a wrapper via :has()/:focus-within (e.g. the machinery search field).
        const hasRing = (n) => { const c = getComputedStyle(n); return c.outlineStyle !== "none" && parseFloat(c.outlineWidth) > 0 || c.boxShadow !== "none"; };
        const ring = hasRing(el) || (el.parentElement && hasRing(el.parentElement)) || (el.parentElement?.parentElement && hasRing(el.parentElement.parentElement));
        return { name: `${el.tagName.toLowerCase()}${el.className && typeof el.className === "string" ? "." + el.className.split(" ")[0] : ""} "${(el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 30)}"`, visible, ring, inViewport: r.bottom > 0 && r.top < innerHeight };
      }));
    }
    const first = stops[0]?.name || "";
    if (!/skip/i.test(first)) fail(url, `first Tab stop is not a skip link: ${first}`);
    for (const s of stops) {
      if (s.name === "body") { fail(url, "focus fell to <body> during Tab sequence"); break; }
      if (!s.visible) fail(url, `Tab stop not visible: ${s.name}`);
      else if (!s.ring) fail(url, `Tab stop has no focus indicator: ${s.name}`);
    }
    // Language selector: Enter opens + focuses current item; ArrowDown moves; Tab closes.
    const lang = await page.evaluate(() => { const b = document.querySelector(".language-selector-toggle"); b.focus(); return !!b; });
    if (lang) {
      await page.keyboard.press("Enter"); await new Promise((r) => setTimeout(r, 150));
      const st1 = await page.evaluate(() => ({ open: !document.querySelector(".language-selector-menu").hidden, focus: document.activeElement?.getAttribute("role"), checked: document.activeElement?.getAttribute("aria-checked"), lang: document.activeElement?.getAttribute("lang") }));
      if (!st1.open) fail(url, "language menu did not open with Enter");
      if (st1.focus !== "menuitemradio" || st1.checked !== "true") fail(url, `language menu open: focus not on current language (role=${st1.focus})`);
      await page.keyboard.press("ArrowDown");
      const moved = await page.evaluate(() => document.activeElement?.getAttribute("aria-checked"));
      if (moved !== "false") fail(url, "ArrowDown did not move to another language");
      await page.keyboard.press("Tab"); await new Promise((r) => setTimeout(r, 150));
      if (await page.evaluate(() => !document.querySelector(".language-selector-menu").hidden)) fail(url, "language menu stays open after Tab leaves it");
      // Escape returns focus to toggle
      await page.evaluate(() => document.querySelector(".language-selector-toggle").focus());
      await page.keyboard.press("Enter"); await new Promise((r) => setTimeout(r, 100)); await page.keyboard.press("Escape");
      if (await page.evaluate(() => !document.activeElement?.classList.contains("language-selector-toggle"))) fail(url, "Escape did not return focus to language toggle");
    }
    await page.close();
  }
}
await browser.close();
console.log(results.length ? results.join("\n") : "ALL BROWSER CHECKS PASSED");
console.log(`\n${results.length} failures`);
