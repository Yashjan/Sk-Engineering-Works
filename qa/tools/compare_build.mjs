// Behavioural snapshot of one build: motion enabled, intro allowed to finish, scroll through each page.
// usage: node compare.mjs <node_modules> <origin> <label> <outdir>
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
const [modules, origin, label, outdir] = process.argv.slice(2);
const require = createRequire(path.join(modules, "x.js"));
const puppeteer = require("puppeteer-core");
fs.mkdirSync(path.join(outdir, label), { recursive: true });

const runs = [
  ...["", "about/", "engineering/", "salt-refinery-plants/", "machinery/", "machinery/belt-conveyor/", "machinery/screw-conveyor/", "projects/", "projects/jk-salt-santalpur/", "contact/"].map((p) => ({ p, vp: "desktop" })),
  ...["", "about/", "salt-refinery-plants/", "projects/", "machinery/screw-conveyor/"].map((p) => ({ p, vp: "mobile" })),
  { p: "ar/", vp: "desktop" }, { p: "hi/machinery/", vp: "desktop" },
];
const VP = { desktop: { width: 1440, height: 900 }, mobile: { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 } };
const browser = await puppeteer.launch({ executablePath: "/usr/bin/google-chrome", headless: true, args: ["--no-sandbox", "--autoplay-policy=no-user-gesture-required", "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const result = {};

const state = () => ({
  y: Math.round(scrollY), h: document.documentElement.scrollHeight,
  pins: document.querySelectorAll(".pin-spacer").length,
  pinned: [...document.querySelectorAll(".pin-spacer > *")].filter((e) => getComputedStyle(e).position === "fixed").length,
  lenis: !!window.__lenis, lenisClass: document.documentElement.className.match(/lenis[\w-]*/g)?.join(" ") || "",
  intro: document.documentElement.dataset.skIntro,
  videos: [...document.querySelectorAll("video")].map((v) => { const r = v.getBoundingClientRect(); return { cls: (v.className || "").replace(/progressive-video|is-media-load(ed|ing)/g, "").trim().slice(0, 40), src: (v.currentSrc || v.getAttribute("src") || "").split("/").pop(), hasPoster: !!v.getAttribute("poster"), inView: r.bottom > 0 && r.top < innerHeight && r.width > 0, paused: v.paused, ready: v.readyState }; }),
  canvases: [...document.querySelectorAll("canvas")].map((c) => { const r = c.getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height), inView: r.bottom > 0 && r.top < innerHeight }; }),
  gsapStyled: [...document.querySelectorAll("[style*='transform'], [style*='opacity'], [style*='visibility']")].length,
});

for (const { p, vp } of runs) {
  const key = `${vp}:/${p}`;
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message.slice(0, 160)));
  page.on("console", (m) => { if (m.type() === "error") errors.push("console: " + m.text().slice(0, 160)); });
  await page.setViewport(VP[vp]);
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }]);
  await page.goto(`${origin}/${p}`, { waitUntil: "networkidle2", timeout: 90000 }).catch((e) => errors.push("goto " + e.message));
  await page.waitForFunction(() => document.documentElement.dataset.skIntro === "done", { timeout: 20000 }).catch(() => errors.push("intro not done"));
  await new Promise((r) => setTimeout(r, 1800));
  const snaps = [];
  const total = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  const steps = Math.min(16, Math.max(4, Math.ceil(total / 900)));
  for (let i = 0; i <= steps; i++) {
    const y = Math.round((total * i) / steps);
    await page.evaluate((y) => { if (window.__lenis) window.__lenis.scrollTo(y, { immediate: true }); else window.scrollTo(0, y); }, y);
    await new Promise((r) => setTimeout(r, 1400));
    const s = await page.evaluate(state);
    // mask time-dependent media (video frames, WebGL) so pixel diffs show only DOM/CSS differences
    await page.evaluate(() => { for (const el of document.querySelectorAll("video, canvas")) el.style.setProperty("visibility", "hidden", "important"); document.querySelectorAll(".about-marquee-track").forEach((t) => t.style.setProperty("animation-play-state", "paused", "important")); });
    const file = path.join(outdir, label, `${vp}_${p.replace(/\//g, "_") || "home"}_${String(i).padStart(2, "0")}.png`);
    await page.screenshot({ path: file });
    await page.evaluate(() => { for (const el of document.querySelectorAll("video, canvas")) el.style.removeProperty("visibility"); });
    snaps.push({ ...s, shot: path.basename(file) });
  }
  result[key] = { errors, snaps };
  await page.close();
}

// Lenis smoothing probe + page transition probe (home, desktop)
{
  const page = await browser.newPage(); await page.setViewport(VP.desktop);
  await page.goto(`${origin}/`, { waitUntil: "networkidle2" });
  await page.waitForFunction(() => document.documentElement.dataset.skIntro === "done", { timeout: 20000 }).catch(() => {});
  await new Promise((r) => setTimeout(r, 1500));
  await page.mouse.move(700, 450);
  await page.mouse.wheel({ deltaY: 600 });
  const trace = [];
  for (let i = 0; i < 12; i++) { await new Promise((r) => setTimeout(r, 50)); trace.push(await page.evaluate(() => Math.round(scrollY))); }
  // transition: click the Machinery nav link and sample overlay + URL
  await page.evaluate(() => window.scrollTo(0, 0)); await new Promise((r) => setTimeout(r, 800));
  const link = await page.$(".desktop-links a[href$='/machinery/']");
  const t0 = Date.now(); await link.click();
  const samples = [];
  for (let i = 0; i < 30; i++) {
    samples.push(await page.evaluate((t) => { const o = document.querySelector(".route-transition-overlay"); const cs = o && getComputedStyle(o); return { t: Date.now() - t, path: location.pathname.replace("/Sk-Engineering-Works", ""), overlay: o ? `${cs.visibility}/${(+cs.opacity).toFixed(2)}/${o.className.replace("route-transition-overlay", "").trim()}` : "none" }; }, t0));
    await new Promise((r) => setTimeout(r, 100));
  }
  result.probes = { lenisWheelTrace: trace, transition: samples.filter((s, i, a) => i === 0 || JSON.stringify({ ...s, t: 0 }) !== JSON.stringify({ ...a[i - 1], t: 0 })) };
  await page.close();
}

// Home projects showcase: switch project and media tabs, check the video plays (exercises deferUntilNear)
{
  const page = await browser.newPage(); await page.setViewport(VP.desktop);
  await page.goto(`${origin}/`, { waitUntil: "networkidle2" });
  await page.waitForFunction(() => document.documentElement.dataset.skIntro === "done", { timeout: 20000 }).catch(() => {});
  const out = [];
  const vid = () => page.evaluate(() => { const v = document.querySelector(".projects-video"); return v ? { src: (v.currentSrc || v.getAttribute("src") || "").split("/").pop(), paused: v.paused, ready: v.readyState, poster: (v.getAttribute("poster") || "").split("/").pop() } : null; });
  await page.evaluate(() => document.querySelector(".projects-video, .projects-image, .projects-image-placeholder")?.scrollIntoView({ block: "center" }));
  await new Promise((r) => setTimeout(r, 2500));
  out.push({ step: "scrolled into view", v: await vid() });
  const buttons = await page.$$eval("#projects button, .projects-section button", (bs) => bs.map((b, i) => ({ i, text: b.textContent.trim().slice(0, 30), label: b.getAttribute("aria-label") || "" })));
  out.push({ step: "buttons", list: buttons.slice(0, 14) });
  const all = await page.$$("#projects button, .projects-section button");
  for (const idx of [1, 2, 3]) {
    if (!all[idx]) continue;
    await all[idx].click().catch(() => {}); await new Promise((r) => setTimeout(r, 2500));
    out.push({ step: `click ${buttons[idx]?.text || buttons[idx]?.label}`, v: await vid() });
  }
  result.projectsShowcase = out;
  await page.close();
}

// 3D: screw conveyor canvas renders and reacts to pointer drag
{
  const page = await browser.newPage(); await page.setViewport(VP.desktop);
  await page.goto(`${origin}/machinery/screw-conveyor/`, { waitUntil: "networkidle2", timeout: 90000 });
  await page.waitForFunction(() => document.documentElement.dataset.skIntro === "done", { timeout: 20000 }).catch(() => {});
  await page.waitForSelector("canvas", { timeout: 60000 }).catch(() => {});
  await new Promise((r) => setTimeout(r, 6000));
  const c = await page.$("canvas");
  const info = { canvas: !!c };
  if (c) {
    const box = await c.boundingBox(); info.box = box && { w: Math.round(box.width), h: Math.round(box.height), y: Math.round(box.y) };
    info.webgl = await page.evaluate(() => { const cv = document.querySelector("canvas"); return !!(cv.getContext("webgl2") || cv.getContext("webgl")); });
    const a = await c.screenshot({ path: path.join(outdir, label, "3d_before.png") }).catch(() => null);
    if (box) { await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2); await page.mouse.down(); await page.mouse.move(box.x + box.width / 2 + 220, box.y + box.height / 2 + 40, { steps: 12 }); await page.mouse.up(); }
    await new Promise((r) => setTimeout(r, 1500));
    await c.screenshot({ path: path.join(outdir, label, "3d_after_drag.png") }).catch(() => null);
    info.shot = !!a;
  }
  result.threeD = info;
  await page.close();
}
await browser.close();
fs.writeFileSync(path.join(outdir, `${label}.json`), JSON.stringify(result, null, 1));
console.log("done", label);
