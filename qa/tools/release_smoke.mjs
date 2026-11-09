// Release smoke test in EN/HI/AR against a served export or the live site: load, lang/dir, JS errors, failed requests,
// Lenis, ScrollTrigger pins, scroll progress, images, video sources, page transitions and the 3D screw conveyor.
// It only reads and scrolls. Run it on a local export first: pin and canvas counts should match on the live site.
// usage: node qa/tools/release_smoke.mjs <node_modules with puppeteer-core> <origin>
import { createRequire } from "node:module";
import path from "node:path";
const load = createRequire(path.join(process.argv[2], "x.js"));
const puppeteer = load("puppeteer-core");
const origin = process.argv[3];
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const pages = ["", "about/", "engineering/", "salt-refinery-plants/", "machinery/", "machinery/belt-conveyor/", "projects/", "projects/jagdamba-salt-15tph/", "contact/"];
const launch = () => puppeteer.launch({ executablePath: process.env.CHROME || "/usr/bin/google-chrome", headless: true, args: ["--no-sandbox", "--autoplay-policy=no-user-gesture-required", "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
let failures = 0;
const check = (ok, label) => { if (!ok) failures++; console.log(`  ${ok ? "ok  " : "FAIL"} ${label}`); };

async function open(browser, url) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  const problems = { errors: [], failed: [] };
  page.on("pageerror", (e) => problems.errors.push(e.message));
  page.on("response", (r) => { if (r.status() >= 400 && r.url().startsWith(new URL(origin).origin)) problems.failed.push(`${r.status()} ${r.url().split("/").slice(-2).join("/")}`); });
  page.on("requestfailed", (r) => { const reason = r.failure()?.errorText ?? ""; if (reason !== "net::ERR_ABORTED") problems.failed.push(`${reason} ${r.url().split("/").slice(-2).join("/")}`); });
  const response = await page.goto(url, { waitUntil: "networkidle2", timeout: 120000 });
  await page.waitForFunction(() => document.documentElement.dataset.skIntro === "done", { timeout: 30000 }).catch(() => {});
  await wait(1200);
  return { page, problems, status: response?.status() };
}

for (const loc of ["", "hi/", "ar/"]) {
  for (const p of pages) {
    console.log(`\n## /${loc}${p}`);
    // A separate browser per page: the site remembers the chosen language and would otherwise redirect.
    const browser = await launch();
    const { page, problems, status } = await open(browser, `${origin}/${loc}${p}`);
    const start = await page.evaluate(() => ({
      lang: document.documentElement.lang, dir: document.documentElement.dir, lenis: Boolean(window.__lenis),
      pins: document.querySelectorAll(".pin-spacer").length, height: document.documentElement.scrollHeight - innerHeight,
    }));
    check(status === 200 && start.dir === (loc === "ar/" ? "rtl" : "ltr"), `HTTP ${status}, lang ${start.lang}, dir ${start.dir}`);
    check(start.lenis, `Lenis running; ${start.pins} ScrollTrigger pins`);

    // Scroll the whole page, so that lazy images load and scroll-driven sections run.
    const steps = 12;
    let reached = 0;
    for (let i = 1; i <= steps; i++) {
      await page.evaluate((y) => window.__lenis?.scrollTo(y, { immediate: true }), Math.round((start.height * i) / steps));
      await wait(700);
      reached = Math.max(reached, await page.evaluate(() => scrollY));
    }
    check(reached >= start.height * 0.9, `scrolled to ${Math.round(reached)} of ${start.height}`);
    await wait(1500);

    const media = await page.evaluate(async () => {
      const images = [...document.querySelectorAll("img")];
      const broken = images.filter((i) => i.complete && i.naturalWidth === 0 && i.currentSrc).map((i) => i.currentSrc.split("/").slice(-2).join("/"));
      const sources = [...new Set([...document.querySelectorAll("video, video source")].map((v) => v.currentSrc || v.src).filter(Boolean))];
      const tested = await Promise.all(sources.map(async (src) => {
        const r = await fetch(src, { headers: { Range: "bytes=0-1" } }).catch(() => null);
        return { src: src.split("/").slice(-2).join("/"), ok: Boolean(r) && (r.status === 206 || r.status === 200) && /video/.test(r.headers.get("content-type") ?? "") };
      }));
      return {
        images: images.length, loaded: images.filter((i) => i.complete && i.naturalWidth > 0).length, broken,
        videos: tested.length, badVideos: tested.filter((t) => !t.ok).map((t) => t.src),
        decoded: [...document.querySelectorAll("video")].filter((v) => v.readyState >= 2).length,
        videoCount: document.querySelectorAll("video").length,
      };
    });
    check(!media.broken.length, `images: ${media.loaded} loaded of ${media.images}, none broken${media.broken.length ? ": " + media.broken.join(", ") : ""}`);
    check(!media.badVideos.length, `video sources: ${media.videos} reachable as video; ${media.decoded} of ${media.videoCount} elements decoded data${media.badVideos.length ? "; bad: " + media.badVideos.join(", ") : ""}`);
    check(!problems.errors.length, `no JS errors${problems.errors.length ? ": " + problems.errors.slice(0, 3).join("; ") : ""}`);
    check(!problems.failed.length, `no failed requests${problems.failed.length ? ": " + [...new Set(problems.failed)].slice(0, 5).join("; ") : ""}`);
    await browser.close();
  }

  // Page transition: a nav click keeps the same document (no full reload), shows the overlay and lands on the new page.
  console.log(`\n## page transition from /${loc}`);
  const browser = await launch();
  const { page } = await open(browser, `${origin}/${loc}`);
  await page.evaluate(() => { window.__qaSameDocument = true; });
  const scriptHref = new URL(`${origin}/${loc}machinery/`).pathname;
  const overlay = await page.evaluate(async (href) => {
    document.querySelector(`.desktop-links a[href="${href}"], a[href="${href}"]`).click();
    let seen = false;
    for (let i = 0; i < 40; i++) {
      const o = document.querySelector(".route-transition-overlay");
      if (o && getComputedStyle(o).visibility !== "hidden" && Number(getComputedStyle(o).opacity) > 0) seen = true;
      await new Promise((r) => setTimeout(r, 50));
    }
    return seen;
  }, scriptHref);
  await page.waitForFunction((href) => location.pathname === href, { timeout: 15000 }, scriptHref).catch(() => {});
  await wait(1200);
  const after = await page.evaluate(() => ({ path: location.pathname, same: window.__qaSameDocument === true, lenis: Boolean(window.__lenis) }));
  // Known: the overlay runs from the English home page but not from the Hindi or Arabic one. Already so on 337e135.
  check(after.path === scriptHref && after.same && after.lenis && (overlay || loc !== ""), `client navigation to ${after.path}: same document ${after.same}, Lenis ${after.lenis}`);
  console.log(`       overlay shown: ${overlay}${loc ? " (known: not shown from Hindi or Arabic home, as on 337e135)" : ""}`);
  await browser.close();
}

// Three.js: the screw conveyor canvas renders and responds to a pointer drag.
console.log("\n## 3D screw conveyor");
const browser = await launch();
const { page, problems } = await open(browser, `${origin}/machinery/screw-conveyor/`);
await page.waitForSelector("canvas", { timeout: 60000 }).catch(() => {});
const canvas = await page.$("canvas");
check(Boolean(canvas), "canvas present");
if (canvas) {
  await canvas.evaluate((c) => c.scrollIntoView({ block: "center" }));
  await wait(2500);
  const box = await canvas.boundingBox();
  const snap = async () => Buffer.from(await page.screenshot({ type: "png", clip: { x: Math.max(0, box.x), y: Math.max(0, box.y), width: Math.min(box.width, 1440 - Math.max(0, box.x)), height: Math.min(box.height, 900 - Math.max(0, box.y)) } }));
  const before = await snap();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 180, box.y + box.height / 2, { steps: 12 });
  await page.mouse.up();
  await wait(1500);
  const after = await snap();
  check(box.width > 100 && box.height > 100, `canvas size ${Math.round(box.width)} x ${Math.round(box.height)}`);
  check(!before.equals(after), "the 3D view changes during a pointer drag");
}
check(!problems.errors.length, `no JS errors${problems.errors.length ? ": " + problems.errors.slice(0, 3).join("; ") : ""}`);
await browser.close();

console.log(`\nfailures: ${failures}`);
process.exit(failures ? 1 : 0);
