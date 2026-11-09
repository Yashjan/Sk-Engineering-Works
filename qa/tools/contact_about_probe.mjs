// Contact and About as a visitor sees them in EN/HI/AR, after the client translation runtime has run:
// the labels corrected in the Arabic dictionary, any raw token left in the page, JS errors, overflow, and the contact links.
// usage: node qa/tools/contact_about_probe.mjs <node_modules with puppeteer-core> <origin> [screenshot dir]
import { createRequire } from "node:module";
import path from "node:path";
const load = createRequire(path.join(process.argv[2], "x.js"));
const puppeteer = load("puppeteer-core");
const [, , , origin, shots] = process.argv;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const token = /×|\bx\d+x\b|_{3,}|\{\{|\}\}|%[sd]\b|\$\{|\[object|\bundefined\b/;
const viewports = { desktop: { width: 1440, height: 900 }, mobile: { width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 2 } };
const expected = {
  contact: {
    meta: { "": "CONTACT / S.K. ENGINEERING WORKS", "hi/": "संपर्क / S.K. ENGINEERING WORKS", "ar/": "اتصل بنا / S.K. ENGINEERING WORKS" },
    chat: { "": "CHAT ON WHATSAPP", "hi/": "WHATSAPP पर चैट करें", "ar/": "تحدث معنا عبر واتساب" },
  },
  about: {
    caption: { "": "OUR MANUFACTURING BASE / SAMBHAR LAKE, RAJASTHAN", "hi/": "हमारे विनिर्माण आधार / SAMBHAR LAKE, RAJASTHAN", "ar/": "قاعدة تصنيعنا / بحيرة سامبهار، راجستان" },
    expansion: { "": "EXPANSION / GUJARAT", "hi/": "विस्तार / GUJARAT", "ar/": "التوسّع / غوجارات" },
  },
};
let failures = 0;
const check = (ok, label) => { if (!ok) failures++; console.log(`  ${ok ? "ok  " : "FAIL"} ${label}`); };

for (const loc of ["", "hi/", "ar/"]) {
  for (const [vpName, viewport] of Object.entries(viewports)) {
    // A separate browser for each run: the site remembers the chosen language and would otherwise redirect.
    const browser = await puppeteer.launch({ executablePath: process.env.CHROME || "/usr/bin/google-chrome", headless: true, args: ["--no-sandbox"] });
    for (const name of ["contact", "about"]) {
      console.log(`\n## /${loc}${name}/ (${vpName})`);
      const page = await browser.newPage();
      await page.setViewport(viewport);
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto(`${origin}/${loc}${name}/`, { waitUntil: "networkidle2" });
      await page.waitForFunction(() => document.documentElement.dataset.skIntro === "done", { timeout: 20000 }).catch(() => {});
      await wait(1500);
      const facts = await page.evaluate((src) => {
        const pattern = new RegExp(src);
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        const texts = [];
        while (walker.nextNode()) {
          const parent = walker.currentNode.parentElement;
          if (parent && !["SCRIPT", "STYLE"].includes(parent.tagName)) texts.push(walker.currentNode.textContent.replace(/\s+/g, " ").trim());
        }
        const attrs = [...document.querySelectorAll("[aria-label],[alt],[title],[placeholder]")].flatMap((e) => ["aria-label", "alt", "title", "placeholder"].map((a) => e.getAttribute(a) || ""));
        return {
          lang: document.documentElement.lang, dir: document.documentElement.dir,
          overflow: document.documentElement.scrollWidth - innerWidth,
          texts: texts.filter(Boolean),
          tokens: [...new Set([...texts, ...attrs, document.title])].filter((t) => pattern.test(t)),
          whatsapp: [...document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp"]')].map((a) => a.href.split("?")[0]),
          phones: [...document.querySelectorAll('a[href^="tel:"]')].map((a) => a.getAttribute("href")),
        };
      }, token.source);
      check(facts.dir === (loc === "ar/" ? "rtl" : "ltr"), `lang ${facts.lang}, dir ${facts.dir}`);
      check(facts.tokens.length === 0, `no raw tokens in text, attributes or title${facts.tokens.length ? ": " + JSON.stringify(facts.tokens) : ""}`);
      for (const [label, values] of Object.entries(expected[name])) {
        check(facts.texts.includes(values[loc]), `${label}: ${values[loc]}`);
      }
      check(facts.overflow <= 0, `no horizontal overflow (${facts.overflow}px)`);
      check(!errors.length, `no JS errors${errors.length ? ": " + errors.join("; ") : ""}`);
      if (name === "contact") {
        check(facts.whatsapp.length > 0 && new Set(facts.whatsapp).size === 1, `WhatsApp links: ${[...new Set(facts.whatsapp)].join(", ")} (${facts.whatsapp.length})`);
        console.log(`       phone links: ${[...new Set(facts.phones)].join(", ")}`);
      }
      if (shots && loc === "ar/") {
        for (const [shot, text] of Object.entries(expected[name])) {
          const found = await page.evaluateHandle((wanted) => {
            const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
            while (walker.nextNode()) if (walker.currentNode.textContent.replace(/\s+/g, " ").trim() === wanted) return walker.currentNode.parentElement;
            return null;
          }, text["ar/"]);
          if (!(await found.jsonValue())) { console.log(`       no element for screenshot ${shot}`); continue; }
          await found.evaluate((e) => e.scrollIntoView({ block: "center" }));
          await wait(1500);
          await page.screenshot({ path: path.join(shots, `ar_${vpName}_${name}_${shot}.jpg`), type: "jpeg", quality: 72 });
        }
      }
      await page.close();
    }
    await browser.close();
  }
}
console.log(`\nfailures: ${failures}`);
process.exit(failures ? 1 : 0);
