// Complete Salt Refinery Plants page in EN/HI/AR, desktop and mobile: metadata, JSON-LD, headings, overflow, inline links,
// every process stage and configuration factor, enquiry actions, the plant drawing, and unconfirmed claims.
// With a second origin, it also compares section geometry and motion state against that build.
// usage: node qa/tools/plants_page_probe.mjs <node_modules with puppeteer-core> <origin> [baseline origin] [screenshot dir]
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
const load = createRequire(path.join(process.argv[2], "x.js"));
const puppeteer = load("puppeteer-core");
const [, , , origin, baseline, shots] = process.argv;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const viewports = { desktop: { width: 1440, height: 900 }, mobile: { width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 2 } };
const content = { "hi/": JSON.parse(fs.readFileSync("src/i18n/plant-content/salt-refinery-plants.hi.json", "utf8")), "ar/": JSON.parse(fs.readFileSync("src/i18n/plant-content/salt-refinery-plants.ar.json", "utf8")) };
const source = fs.readFileSync("src/i18n/plant-content/salt-refinery-plants.en.ts", "utf8");
const stageIds = ["raw-salt", "crushing", "washing", "centrifuging", "drying", "screening", "grinding", "material-handling", "storage-packing"];
const stageSources = Object.fromEntries(stageIds.map((id) => [id, source.match(new RegExp(`"?${id}"?: "((?:[^"\\\\]|\\\\.)*)"`))[1]]));
const say = (loc, en) => (loc ? content[loc][en] : en);
const plain = (text) => text.replace(/\[\[[^|]+\|([^\]]+)\]\]/g, "$1");
const titles = { "": "Complete Salt Refinery Plants & Engineering", "hi/": "संपूर्ण नमक रिफाइनरी संयंत्र और इंजीनियरिंग", "ar/": "مصانع تكرير الملح المتكاملة والهندسة" };
// Claims this page must not make until engineering confirms them, including in page data.
const unconfirmed = /ready-to-run|turnkey|guarantee|stainless|\bROI\b|तैयार करने के लिए रन|جاهزة للتصريف|الفولاذ المقاوم/i;
const visibleText = (markup) => markup.slice(markup.indexOf("<body")).replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, "").replace(/<[^>]+>/g, " ");
let failures = 0;
const check = (ok, label) => { if (!ok) failures++; console.log(`  ${ok ? "ok  " : "FAIL"} ${label}`); };
const launch = async () => {
  // Chrome occasionally fails to start right after another instance closes.
  for (let attempt = 1; ; attempt++) {
    try {
      return await puppeteer.launch({ executablePath: process.env.CHROME || "/usr/bin/google-chrome", headless: true, args: ["--no-sandbox", "--autoplay-policy=no-user-gesture-required", "--blink-settings=primaryHoverType=2,availableHoverTypes=2,primaryPointerType=4,availablePointerTypes=4"] });
    } catch (error) {
      if (attempt === 4) throw error;
      await wait(3000);
    }
  }
};

async function open(browser, url, viewport) {
  const page = await browser.newPage();
  await page.setViewport(viewport);
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(url, { waitUntil: "networkidle2", timeout: 120000 });
  await page.waitForFunction(() => document.documentElement.dataset.skIntro === "done", { timeout: 30000 }).catch(() => {});
  await wait(1500);
  return { page, errors };
}
const geometry = (page) => page.evaluate(() => ({
  pins: document.querySelectorAll(".pin-spacer").length,
  lenis: Boolean(window.__lenis),
  videos: [...document.querySelectorAll("main video")].length,
  images: [...new Set([...document.querySelectorAll("main img")].map((i) => (i.getAttribute("src") || "").replace(/.*\//, "")))].sort().join(),
  sections: Object.fromEntries([...document.querySelectorAll("main > section")].map((s) => [s.className.split(" ")[0], Math.round(s.getBoundingClientRect().height)])),
  animated: document.querySelectorAll("main [style*='transform'], main [style*='opacity'], main [style*='visibility']").length,
}));

for (const loc of ["", "hi/", "ar/"]) {
  for (const [vpName, viewport] of Object.entries(viewports)) {
    console.log(`\n## /${loc}salt-refinery-plants/ (${vpName})`);
    const browser = await launch();
    const { page, errors } = await open(browser, `${origin}/${loc}salt-refinery-plants/`, viewport);
    const facts = await page.evaluate(() => ({
      lang: document.documentElement.lang, dir: document.documentElement.dir,
      title: document.title, desc: document.querySelector('meta[name="description"]')?.content,
      og: document.querySelector('meta[property="og:title"]')?.content,
      canonical: document.querySelector('link[rel="canonical"]')?.href,
      hreflang: [...document.querySelectorAll('link[rel="alternate"][hreflang]')].map((l) => l.hreflang).sort().join(),
      robots: document.querySelector('meta[name="robots"]')?.content ?? "",
      h1: [...document.querySelectorAll("h1")].map((h) => h.textContent),
      headings: [...document.querySelectorAll("main h1, main h2, main h3")].filter((h) => h.getClientRects().length).map((h) => Number(h.tagName[1])),
      overflow: document.documentElement.scrollWidth - innerWidth,
      ld: [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => JSON.parse(s.textContent)),
      alts: [...document.querySelectorAll("main img")].filter((i) => !i.alt.trim()).length,
      support: document.querySelector(".raw-process-support").textContent,
      hero: document.querySelector(".salt-hero-support").textContent,
      eyebrow: document.querySelector(".salt-hero-eyebrow").textContent,
      statement: document.querySelector(".configuration-statement-copy").textContent,
      execSupport: document.querySelector(".execution-support").textContent,
      enquiry: document.querySelector(".enquiry-support").textContent,
      rows: [...document.querySelectorAll(".execution-stage-row")].filter((r) => r.getClientRects().length).map((r) => r.querySelector("p").textContent),
      processDescriptions: [...document.querySelectorAll(".raw-process-mobile-list .raw-process-description")].map((p) => p.textContent),
      factors: [...document.querySelectorAll(".configuration-factor-panel p")].map((p) => p.textContent),
      links: [...document.querySelectorAll(".raw-process-support a, .execution-stage-row a")].filter((a) => a.getClientRects().length).map((a) => a.getAttribute("href")),
      tel: [...document.querySelectorAll('.project-enquiry a[href^="tel:"]')].map((a) => a.getAttribute("href")),
      whatsapp: [...document.querySelectorAll('.project-enquiry a[href*="wa.me"]')].map((a) => a.href),
    }));
    const html = await fetch(`${origin}/${loc}salt-refinery-plants/`).then((r) => r.text());
    check(facts.dir === (loc === "ar/" ? "rtl" : "ltr"), `lang ${facts.lang}, dir ${facts.dir}`);
    check(facts.title.includes(titles[loc]) && facts.title.includes("S.K. Engineering Works") && facts.og === facts.title, `title (${facts.title.length}): ${facts.title}`);
    check(Boolean(facts.desc) && facts.desc.length <= 190, `description (${facts.desc?.length})`);
    check(facts.canonical?.endsWith(`/${loc}salt-refinery-plants/`) && facts.hreflang === "ar,en,hi,x-default" && !/noindex/.test(facts.robots), "canonical, hreflang and indexable");
    check(facts.h1.length === 1, `one h1: ${facts.h1[0]}`);
    check(facts.headings[0] === 1 && facts.headings.every((h, i) => !i || h - facts.headings[i - 1] <= 1), "heading levels do not skip");
    check(facts.overflow <= 0, `no horizontal overflow (${facts.overflow}px)`);
    check(facts.alts === 0, "images have alt text");
    const crumbs = facts.ld.find((d) => d["@type"] === "BreadcrumbList"), service = facts.ld.find((d) => d["@type"] === "Service");
    check(crumbs?.itemListElement.length === 2 && crumbs.itemListElement[1].item === facts.canonical && crumbs.itemListElement[0].item.endsWith(`/Sk-Engineering-Works/${loc}`), `breadcrumb in this language: ${crumbs?.itemListElement.map((i) => i.name).join(" > ")}`);
    check(Boolean(service) && service.url === facts.canonical && service.description === facts.desc && service.provider?.["@id"]?.endsWith("#organization") && !/offers|price|availability|rating|review|areaServed/i.test(JSON.stringify(service)), `Service JSON-LD without offers, prices or ratings: ${service?.name}`);
    check(facts.ld.some((d) => d["@graph"]?.some((n) => n["@type"] === "Organization")), "Organization JSON-LD present");
    const claim = html.match(unconfirmed)?.[0], percent = visibleText(html).match(/\d+(\.\d+)?\s?%/)?.[0];
    check(!claim && !percent, `no unconfirmed claims in the page source or percentages in its text${claim || percent ? ": " + (claim || percent) : ""}`);
    check(facts.eyebrow === say(loc, "COMPLETE SALT REFINERY PLANTS / 01") && facts.hero === say(loc, "From process planning and machinery fabrication to equipment integration and plant execution."), `hero: ${facts.eyebrow}`);
    check(facts.rows.length === 6 && facts.factors.length === 6, "6 execution stages and 6 configuration factors in the page");
    check(facts.processDescriptions.length === 9 && stageIds.every((id, index) => facts.processDescriptions[index] === plain(say(loc, stageSources[id].replace(/\\'/g, "'")))), "all 9 process descriptions are rendered before interaction");
    check(!loc || facts.rows.every((r) => Object.values(content[loc]).map(plain).includes(r)), "execution stages use this language's build-time copy");
    check(!loc || facts.factors.every((f) => Object.values(content[loc]).includes(f)), "configuration factors use this language's build-time copy");
    check(!loc || [facts.support, facts.statement, facts.execSupport, facts.enquiry].every((t) => Object.values(content[loc]).map(plain).includes(t)), "section intros and enquiry text use this language's copy");
    const prefix = `/Sk-Engineering-Works/${loc}`;
    const hrefs = [...new Set(facts.links)];
    check(hrefs.length === 8 && hrefs.every((h) => h.startsWith(prefix)), `${hrefs.length} inline links keep the language prefix`);
    const statuses = await Promise.all(hrefs.map((h) => fetch(new URL(h, origin).href).then((r) => [h, r.status])));
    check(statuses.every(([, s]) => s === 200), `inline links return 200${statuses.some(([, s]) => s !== 200) ? ": " + JSON.stringify(statuses) : ""}`);
    check(facts.tel.every((t) => t === "tel:+919828460532") && facts.tel.length >= 1 && facts.whatsapp.every((w) => w.startsWith("https://wa.me/919828460532?text=")) && facts.whatsapp.length >= 1, "enquiry telephone and WhatsApp actions unchanged");
    if (vpName === "desktop") console.log(`       enquiry text: ${facts.enquiry}`);

    // Process stages: each one shows its copy, its video and does not move what follows it.
    await page.evaluate(() => document.querySelector(".raw-process-layout").scrollIntoView({ block: "center" }));
    await wait(1400);
    const seen = [];
    const heights = new Set();
    let clipped = 0;
    for (const id of stageIds) {
      const index = stageIds.indexOf(id);
      if (vpName === "desktop") {
        const row = (await page.$$(".raw-process-desktop-row"))[index];
        await row.hover();
        await wait(650);
      } else {
        const button = (await page.$$(".raw-process-mobile-list > .raw-process-stage-item > button"))[index];
        const open = await button.evaluate((b) => b.getAttribute("aria-expanded") === "true");
        if (!open) await button.evaluate((b) => b.click());
        await wait(900);
      }
      const state = await page.evaluate((mobile) => {
        const root = document.querySelector(mobile ? '.raw-process-stage-item[data-selected="true"] .raw-process-mobile-copy' : "#process-stage-copy");
        const after = document.querySelector(".complete-execution").getBoundingClientRect().top + scrollY;
        const video = document.querySelector(mobile ? '.raw-process-stage-item[data-selected="true"] .raw-process-mobile-media video' : "#process-stage-preview video");
        const lines = [...root.querySelectorAll("h3 span")];
        return { text: root.querySelector(".raw-process-description")?.textContent, after: Math.round(after), video: (video?.currentSrc || video?.getAttribute("src") || "").split("/").pop(), clipped: lines.filter((l) => l.scrollWidth > root.clientWidth + 1).length };
      }, vpName === "mobile");
      seen.push(state.text === plain(say(loc, stageSources[id].replace(/\\'/g, "'"))) && Boolean(state.video));
      if (vpName === "desktop") heights.add(state.after);
      clipped += state.clipped;
    }
    check(seen.every(Boolean), `all 9 stages show this language's description and a video (${seen.filter(Boolean).length}/9)`);
    if (vpName === "desktop") check(heights.size === 1, `hovering stages does not move the page below (${[...heights].join(", ")})`);
    check(clipped === 0, "stage headings fit their column");
    if (vpName === "desktop") await page.mouse.move(2, 2);

    // Configuration factors: each opens and shows all of its text.
    const panels = await page.evaluate(async () => {
      const out = [];
      for (const factor of document.querySelectorAll(".configuration-factor")) {
        factor.querySelector("button").click();
        await new Promise((r) => setTimeout(r, 420));
        const p = factor.querySelector(".configuration-factor-panel");
        out.push(factor.dataset.active === "true" && p.firstElementChild.scrollHeight <= p.firstElementChild.clientHeight + 1 && p.querySelector("p").getBoundingClientRect().height > 0);
      }
      return out;
    });
    check(panels.length === 6 && panels.every(Boolean), "all 6 configuration factors open without clipping");

    // Plant drawing lightbox.
    const opened = await page.evaluate(async () => {
      const button = [...document.querySelectorAll('[aria-haspopup="dialog"]')].find((b) => b.getClientRects().length);
      button.click();
      await new Promise((r) => setTimeout(r, 500));
      const dialog = Boolean(document.querySelector('[role="dialog"]'));
      document.querySelector(".execution-drawing-close")?.click();
      await new Promise((r) => setTimeout(r, 300));
      return dialog && !document.querySelector('[role="dialog"]');
    });
    check(opened, "plant drawing opens and closes");
    check(!errors.length, `no JS errors${errors.length ? ": " + errors.slice(0, 3).join("; ") : ""}`);

    if (shots) {
      for (const [name, selector] of [["hero", ".salt-refinery-hero"], ["process", ".raw-process-intro"], ["execution", ".execution-desktop-story, .execution-mobile-story"], ["config", ".plant-configuration"], ["enquiry", ".project-enquiry"]]) {
        const handles = await page.$$(selector);
        let target = null;
        for (const h of handles) if (await h.evaluate((e) => e.getClientRects().length > 0)) target = target ?? h;
        if (!target) continue;
        await target.evaluate((e) => e.scrollIntoView({ block: "start" }));
        await wait(1100);
        await target.screenshot({ path: path.join(shots, `${(loc || "en/").replace("/", "")}_${vpName}_${name}.jpg`), type: "jpeg", quality: 70 }).catch(() => {});
      }
    }
    await browser.close();

    if (baseline) {
      // Same behaviour as the baseline build: pins, Lenis, videos and images, on a fresh page load.
      const a = await launch(), b = await launch();
      const before = await open(a, `${baseline}/${loc}salt-refinery-plants/`, viewport);
      const after = await open(b, `${origin}/${loc}salt-refinery-plants/`, viewport);
      const [x, y] = [await geometry(before.page), await geometry(after.page)];
      check(x.pins === y.pins && x.lenis === y.lenis && x.videos === y.videos && x.images === y.images, `baseline match: ${y.pins} pins, Lenis ${y.lenis}, ${y.videos} videos, same images`);
      const changes = Object.keys(y.sections).filter((k) => x.sections[k] !== y.sections[k]).map((k) => `${k} ${x.sections[k]} -> ${y.sections[k]}`);
      console.log(`       section heights vs baseline: ${changes.join("; ") || "unchanged"}`);
      await a.close();
      await b.close();
    }
  }
}

// The enquiry sentence changes only on this page.
const browser = await launch();
for (const [url, text] of [["machinery/", "From individual machinery to complete salt refinery execution, talk to our team about your plant requirement."]]) {
  const { page } = await open(browser, `${origin}/${url}`, viewports.desktop);
  const shown = await page.evaluate(() => document.querySelector(".enquiry-support")?.textContent);
  check(shown === text, `/${url} keeps its own enquiry text`);
  await page.close();
}
await browser.close();
console.log(`\nfailures: ${failures}`);
process.exit(failures ? 1 : 0);
