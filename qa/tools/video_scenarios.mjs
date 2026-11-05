import { createRequire } from "node:module"; const require = createRequire(process.argv[2] + "/x.js");
const puppeteer = require("puppeteer-core");
const b = await puppeteer.launch({ executablePath: "/usr/bin/google-chrome", headless: true, args: ["--no-sandbox", "--autoplay-policy=no-user-gesture-required"] });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const state = (page, t) => page.evaluate((t) => { const v = document.querySelector(t); if (!v) return "MISSING"; const r = v.getBoundingClientRect(); const vis = r.bottom > 0 && r.top < innerHeight; return `${vis ? "" : "(offscreen)"}${v.paused ? "PAUSED" : "playing"}`; }, t);
const ready = async (page) => { await page.waitForFunction(() => document.documentElement.dataset.skIntro === "done", { timeout: 20000 }).catch(() => {}); await wait(1000); };
const yOf = (page, t) => page.evaluate((t) => { const v = document.querySelector(t); return Math.round(v.getBoundingClientRect().top + scrollY - innerHeight / 3); }, t);
const scenarios = {
  "lenis-jump": async (page, t) => { const y = await yOf(page, t); await page.evaluate((y) => window.__lenis.scrollTo(y, { immediate: true }), y); },
  "scrollbar-jump": async (page, t) => { const y = await yOf(page, t); await page.evaluate((y) => { document.documentElement.scrollTop = y; }, y); },
  "anchor-link": async (page, t) => { await page.evaluate((t) => { const sec = document.querySelector(t).closest("section"); const a = document.createElement("a"); a.href = "#" + sec.id; a.textContent = "x"; document.body.prepend(a); a.click(); }, t); },
  "wheel": async (page, t) => { await page.mouse.move(700, 450); for (let k = 0; k < 300; k++) { const top = await page.evaluate((t) => document.querySelector(t).getBoundingClientRect().top, t); if (top < 500) break; await page.mouse.wheel({ deltaY: 500 }); await wait(50); } },
  "back-navigation": async (page, t) => { const y = await yOf(page, t); await page.evaluate((y) => window.__lenis.scrollTo(y, { immediate: true }), y); await wait(2500); await page.evaluate(() => document.querySelector(".desktop-links a[href$='/machinery/']").click()); await page.waitForFunction(() => location.pathname.endsWith("/machinery/"), { timeout: 15000 }); await wait(2500); await page.goBack(); await page.waitForFunction(() => !location.pathname.endsWith("/machinery/"), { timeout: 15000 }); await wait(1500); const y2 = await yOf(page, t); const top = await page.evaluate((t) => document.querySelector(t).getBoundingClientRect().top, t); if (top > innerHeightGuess() || top < -400) await page.evaluate((y) => window.__lenis.scrollTo(y, { immediate: true }), y2); },
  "reload-restored": async (page, t) => { const y = await yOf(page, t); await page.evaluate((y) => window.__lenis.scrollTo(y, { immediate: true }), y); await wait(1500); await page.reload({ waitUntil: "networkidle2" }); await page.waitForFunction(() => document.documentElement.dataset.skIntro === "done", { timeout: 20000 }).catch(() => {}); await wait(800); },
};
function innerHeightGuess() { return 900; }
for (const [label, origin] of [["base", process.argv[3]], ["curr", process.argv[4]]]) {
  for (const t of [".projects-video", ".manufacturing-video"]) for (const [name, fn] of Object.entries(scenarios)) {
    const res = [];
    for (let run = 0; run < 3; run++) {
      const ctx = await b.createBrowserContext(); const page = await ctx.newPage(); await page.setViewport({ width: 1440, height: 900 });
      await page.goto(origin + "/", { waitUntil: "networkidle2" }); await ready(page);
      try { await fn(page, t, origin); await wait(3000); res.push(await state(page, t)); } catch (e) { res.push("ERR " + e.message.slice(0, 40)); }
      await ctx.close();
    }
    console.log(`${label} ${t.padEnd(20)} ${name.padEnd(16)} ${res.join("  ")}`);
  }
}
// initial-load network: are deferred video bytes or the cover poster fetched before scrolling?
for (const [label, origin] of [["base", process.argv[3]], ["curr", process.argv[4]]]) {
  const ctx = await b.createBrowserContext(); const page = await ctx.newPage(); await page.setViewport({ width: 1440, height: 900 });
  const hits = []; page.on("request", (r) => { if (/fabrication\.mp4|Cinematic_720p\.mp4|cover-image\.webp/.test(r.url())) hits.push(r.url().split("/").pop()); });
  await page.goto(origin + "/", { waitUntil: "networkidle2" }); await ready(page);
  console.log(`${label} initial-load requests for deferred media: ${hits.length ? [...new Set(hits)].join(", ") : "none"}`);
  await ctx.close();
}
await b.close();
