// JavaScript a page actually downloads: every .js response in a real browser, raw and gzip-compressed, plus the page HTML.
// Also reports which long sentences (given as a JSON list of {locale,text}) appear in those scripts.
// usage: node qa/tools/js_weight.mjs <node_modules with puppeteer-core> <origin> [strings.json] [page ...]
import { createRequire } from "node:module";
import { gzipSync } from "node:zlib";
import fs from "node:fs";
import path from "node:path";
const load = createRequire(path.join(process.argv[2], "x.js"));
const puppeteer = load("puppeteer-core");
const [, , , origin, stringsFile, ...rest] = process.argv;
const pages = rest.length ? rest : ["machinery/belt-conveyor/", "hi/machinery/belt-conveyor/", "ar/machinery/belt-conveyor/", "", "hi/", "ar/", "machinery/wet-mill/", "hi/machinery/wet-mill/", "ar/machinery/wet-mill/"];
const strings = stringsFile && stringsFile !== "-" ? JSON.parse(fs.readFileSync(stringsFile, "utf8")) : [];
const decode = (s) => s.replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
const kb = (n) => (n / 1024).toFixed(1).padStart(8);
const launch = () => puppeteer.launch({ executablePath: process.env.CHROME || "/usr/bin/google-chrome", headless: true, args: ["--no-sandbox"] });
const sum = (buffers) => [buffers.reduce((n, b) => n + b.length, 0), buffers.reduce((n, b) => n + gzipSync(b).length, 0)];
console.log(`${"page".padEnd(32)}${"required raw".padStart(13)}${"required gz".padStart(12)}${"+prefetch gz".padStart(13)}${"HTML gz".padStart(9)}  long sentences in required JS | in all JS`);
for (const p of pages) {
  const browser = await launch(); // fresh browser per page, so no script comes from an earlier page's cache
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  const scripts = new Map();
  let html = "";
  page.on("response", async (res) => {
    const url = res.url();
    try {
      if (/\.js(\?|$)/.test(url)) scripts.set(url, await res.buffer());
      else if (url === `${origin}/${p}`) html = await res.text();
    } catch { /* navigated away */ }
  });
  await page.goto(`${origin}/${p}`, { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 5000));
  // Required = referenced by the page's HTML/RSC payload; the rest are prefetches of other routes.
  const unescaped = html.replace(/\\"/g, '"').replace(/\\u0026/g, "&");
  const isRequired = (url) => unescaped.includes(new URL(url).pathname.split("/").pop());
  const required = [...scripts].filter(([url]) => isRequired(url)).map(([, b]) => b), all = [...scripts.values()];
  const [raw, gz] = sum(required), [, gzAll] = sum(all);
  const count = (buffers) => { const text = decode(buffers.map((b) => b.toString("utf8")).join("\n")); const found = {}; for (const { locale, text: t } of strings) if (text.includes(t)) found[locale] = (found[locale] ?? 0) + 1; return JSON.stringify(found); };
  console.log(`${("/" + p).padEnd(32)}${kb(raw).padStart(13)}${kb(gz).padStart(12)}${kb(gzAll).padStart(13)}${kb(gzipSync(html).length).padStart(9)}  ${strings.length ? `${count(required)} | ${count(all)}` : ""}`);
  await browser.close();
}
