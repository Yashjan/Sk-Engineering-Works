// Observed (not simulated) mobile LCP under throttling, with intro timing markers.
// usage: QA_NODE_MODULES=… node lcp_trace.mjs <origin> <runs> <path...>
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(path.join(process.env.QA_NODE_MODULES, "noop.js"));
const puppeteer = require("puppeteer-core");
const [origin, runsArg, ...paths] = process.argv.slice(2);
const runs = Number(runsArg) || 3;
const browser = await puppeteer.launch({ executablePath: process.env.CHROME || "/usr/bin/google-chrome", headless: true, args: ["--no-sandbox"] });
const median = (xs) => { const s = [...xs].sort((a, b) => a - b); return s[Math.floor(s.length / 2)]; };

for (const p of paths) {
  const samples = [];
  for (let i = 0; i < runs; i++) {
    const ctx = await browser.createBrowserContext(); // cold cache per run
    const page = await ctx.newPage();
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 3 });
    const cdp = await page.createCDPSession();
    await cdp.send("Network.enable");
    await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    await page.evaluateOnNewDocument(() => {
      window.__lcp = []; window.__marks = {};
      new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lcp.push({ t: e.startTime, size: e.size, el: e.element ? `${e.element.tagName.toLowerCase()}.${[...e.element.classList].slice(0, 2).join(".")}` : "(removed)", url: e.url ? e.url.split("/").pop() : "" }); }).observe({ type: "largest-contentful-paint", buffered: true });
      new PerformanceObserver((l) => { for (const e of l.getEntries()) if (e.name === "first-contentful-paint") window.__marks.fcp = e.startTime; }).observe({ type: "paint", buffered: true });
      const mo = new MutationObserver(() => {
        const d = document.documentElement.dataset;
        if (d.skIntroRevealing && !window.__marks.reveal) window.__marks.reveal = performance.now();
        if (d.skIntro === "done" && !window.__marks.done) window.__marks.done = performance.now();
      });
      document.addEventListener("DOMContentLoaded", () => { window.__marks.dcl = performance.now(); mo.observe(document.documentElement, { attributes: true }); });
      window.addEventListener("load", () => { window.__marks.load = performance.now(); });
    });
    await page.goto(origin + p, { waitUntil: "load", timeout: 120000 });
    await page.waitForFunction(() => document.documentElement.dataset.skIntro === "done", { timeout: 60000 }).catch(() => {});
    await new Promise((r) => setTimeout(r, 1500));
    const r = await page.evaluate(() => ({ lcp: window.__lcp, marks: window.__marks }));
    // Hydration marker: first time a React root-attached listener exists is hard to read; use intro start ≈ first visible intro frame.
    samples.push(r);
    await ctx.close();
  }
  const last = samples[samples.length - 1];
  const lcpT = samples.map((s) => s.lcp.at(-1)?.t ?? NaN);
  const pick = (k) => Math.round(median(samples.map((s) => s.marks[k] ?? NaN)));
  console.log(`${p.padEnd(26)} LCP ${Math.round(median(lcpT))}ms  FCP ${pick("fcp")}  DCL ${pick("dcl")}  load ${pick("load")}  introReveal ${pick("reveal")}  introDone ${pick("done")}  runs=[${lcpT.map(Math.round).join(",")}]`);
  console.log(`   candidates (last run): ${last.lcp.map((e) => `${Math.round(e.t)}ms ${e.el} ${e.size}px²${e.url ? " " + e.url : ""}`).join("  →  ")}`);
}
await browser.close();
