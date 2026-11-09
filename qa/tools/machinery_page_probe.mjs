// Machinery detail page checks in EN/HI/AR, desktop and mobile: lang/dir, headings, overflow, JS errors,
// structured-data rules, internal links (locale prefix, HTTP 200), accordions, client-side stage navigation, enquiry draft.
// usage: node qa/tools/machinery_page_probe.mjs <node_modules with puppeteer-core> <origin> [slug] [screenshot dir]
import { createRequire } from "node:module";
import path from "node:path";
const load = createRequire(path.join(process.argv[2], "x.js"));
const puppeteer = load("puppeteer-core");
const [, , , origin, slug = "belt-conveyor", shots] = process.argv;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({ executablePath: process.env.CHROME || "/usr/bin/google-chrome", headless: true, args: ["--no-sandbox", // Headless Chrome otherwise reports no hover-capable pointer (hover: none).
  "--blink-settings=primaryHoverType=2,availableHoverTypes=2,primaryPointerType=4,availablePointerTypes=4"] });
const viewports = { desktop: { width: 1440, height: 900 }, mobile: { width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 2 } };
let failures = 0;
const check = (ok, label) => { if (!ok) failures++; console.log(`  ${ok ? "ok  " : "FAIL"} ${label}`); };

for (const loc of ["", "hi/", "ar/"]) for (const [vpName, viewport] of Object.entries(viewports)) {
  console.log(`\n## /${loc}machinery/${slug}/  ${vpName}`);
  const page = await browser.newPage();
  await page.setViewport(viewport);
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => { if (m.type() === "error" && !/Failed to load resource/.test(m.text())) errors.push(m.text()); });
  await page.goto(`${origin}/${loc}machinery/${slug}/`, { waitUntil: "networkidle2" });
  await page.waitForFunction(() => document.documentElement.dataset.skIntro === "done", { timeout: 20000 }).catch(() => {});
  await wait(800);
  const facts = await page.evaluate(() => {
    const ld = [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => JSON.parse(s.textContent));
    const levels = [...document.querySelectorAll("main :is(h1,h2,h3)")].map((h) => +h.tagName[1]);
    const flow = [...document.querySelectorAll(".conveyor-system-flow li")].map((li) => ({ current: li.getAttribute("aria-current"), href: li.querySelector("a")?.getAttribute("href") ?? null }));
    const links = [...document.querySelectorAll(".machine-process-support a, .machine-asset-note a, .conveyor-closing-link, .machine-hero-actions a")].map((a) => ({ href: a.getAttribute("href"), text: a.textContent.trim() }));
    const imgs = [...document.querySelectorAll("main img")].map((i) => i.alt);
    return { lang: document.documentElement.lang, dir: document.documentElement.dir, h1: document.querySelectorAll("h1").length, levels, ld, flow, links, imgs,
      overflow: document.documentElement.scrollWidth - innerWidth, details: document.querySelectorAll(".machine-editorial-list details").length,
      canonical: document.querySelector('link[rel="canonical"]')?.href, hreflang: document.querySelectorAll('link[rel="alternate"][hreflang]').length };
  });
  const want = { "": ["en", "ltr"], "hi/": ["hi", "ltr"], "ar/": ["ar", "rtl"] }[loc];
  check(facts.lang.startsWith(want[0]) && (facts.dir || "ltr") === want[1], `lang=${facts.lang} dir=${facts.dir || "ltr"}`);
  check(facts.h1 === 1, `one h1 (${facts.h1})`);
  check(facts.levels.every((l, i) => i === 0 || l - facts.levels[i - 1] <= 1), `no skipped heading levels [${facts.levels.join("")}]`);
  check(facts.overflow <= 0, `no horizontal overflow (${facts.overflow}px)`);
  check(facts.canonical?.includes(`/${loc}machinery/${slug}/`) && facts.hreflang === 4, `canonical + ${facts.hreflang} hreflang`);
  check(facts.imgs.every((a) => a.trim()), `images have alt text (${facts.imgs.length})`);
  const product = facts.ld.find((d) => d["@type"] === "Product"), crumbs = facts.ld.find((d) => d["@type"] === "BreadcrumbList");
  const text = JSON.stringify(product ?? {});
  check(Boolean(product) && !/offers|price|availability|aggregateRating|review/i.test(text), `Product JSON-LD without offers/price/ratings: ${product?.name}`);
  check(product?.url.includes(`/${loc}machinery/${slug}/`) && crumbs?.itemListElement.length === 3 && crumbs.itemListElement[2].item === product.url, `breadcrumb has 3 levels and matches this locale's URL: ${crumbs?.itemListElement.map((i) => i.name).join(" > ")}`);
  // Claims the engineering team has not confirmed must stay off this page, in copy, metadata, structured data and page data.
  // The site-wide default social image lives in a folder named after a project: that path is a file location, not a claim.
  const source = (await fetch(`${origin}/${loc}machinery/${slug}/`).then((r) => r.text())).replaceAll("/images/projects/jagdamba/cover-image-og.jpg", "");
  const unconfirmed = source.match(/jagdamba|जगदा?म्बा|جغدامبا|15\s?TPH|15 طن|phalodi|फलोदी|فالودي|belt conveyor manufacturer|manufactures belt|बेल्ट कन्वेयर निर्माता|बेल्ट कन्वेयर का निर्माण|مصنّع نواقل|تصنّع[^"]{0,40}النواقل/gi) ?? [];
  check(!unconfirmed.length, `no unconfirmed project or manufacturing claims in the page source${unconfirmed.length ? ": " + [...new Set(unconfirmed)].join(", ") : ""}`);
  check(product && !("manufacturer" in product), "Product JSON-LD does not assert a manufacturer");
  check(facts.links.some((l) => /\/projects\/$/.test(l.href)), "section 08 keeps a general Projects link");
  const stageLinks = facts.flow.filter((s) => s.href);
  check(facts.flow.filter((s) => s.current === "step").length === 1 && !facts.flow.find((s) => s.current === "step").href, `current stage is marked and not linked; ${stageLinks.length}/${facts.flow.length} other stages linked`);
  const hrefs = [...new Set([...stageLinks.map((s) => s.href), ...facts.links.map((l) => l.href)])].filter((h) => h.startsWith("/"));
  const prefix = `/Sk-Engineering-Works/${loc}`;
  check(hrefs.every((h) => h.startsWith(prefix)), `all ${hrefs.length} internal links keep the locale prefix`);
  const statuses = await Promise.all(hrefs.map((h) => fetch(new URL(h, origin).href).then((r) => [h, r.status])));
  const broken = statuses.filter(([, s]) => s !== 200);
  check(!broken.length, `all internal links return 200${broken.length ? " " + JSON.stringify(broken) : ""}`);
  if (vpName === "desktop") console.log(`       links: ${facts.links.map((l) => l.text).join(" | ")}`);
  // Accordions: each opens and shows its text.
  const opened = await page.evaluate(() => [...document.querySelectorAll(".machine-editorial-list details")].map((d) => { d.querySelector("summary").click(); const r = d.open && d.querySelector("p").getBoundingClientRect().height > 0; d.querySelector("summary").click(); return r; }));
  check(opened.length === facts.details && opened.every(Boolean), `${opened.length} configuration accordions open`);
  // Enquiry: required-field validation, then WhatsApp draft naming the machine.
  const draft = await page.evaluate(async () => {
    const form = document.querySelector(".machine-enquiry form");
    const set = (name, value) => { const el = form.elements.namedItem(name); Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(el, value); el.dispatchEvent(new Event("input", { bubbles: true })); };
    form.querySelector('button[type="submit"]').click();
    await new Promise((r) => setTimeout(r, 200));
    const blocked = !form.querySelector('a[href*="wa.me"], a[href*="whatsapp"]');
    set("Name", "QA"); set("Phone / WhatsApp", "9876543210");
    form.querySelector('button[type="submit"]').click();
    await new Promise((r) => setTimeout(r, 300));
    const a = form.querySelector('a[href*="wa.me"], a[href*="whatsapp"]');
    return { blocked, href: a ? decodeURIComponent(a.href) : "" };
  });
  check(draft.blocked && /Machine: Belt Conveyor/.test(draft.href), "enquiry validates, then prepares a WhatsApp draft naming the machine");
  if (shots) {
    for (const [name, sel] of [["system", ".conveyor-system"], ["fabrication", ".machine-fabrication"], ["construction", ".machine-construction"], ["enquiry", ".machine-enquiry"]]) {
      const el = await page.$(sel);
      await el.evaluate((e) => e.scrollIntoView({ block: "start" }));
      await wait(700);
      await el.screenshot({ path: path.join(shots, `${(loc || "en/").replace("/", "")}_${vpName}_${name}.jpg`), quality: 72, type: "jpeg" });
    }
  }
  if (vpName === "desktop" && stageLinks.length) {
    // Hover and focus cue on stage links: the underline appears and nothing moves or resizes.
    const geometry = () => page.evaluate(() => JSON.stringify([...document.querySelectorAll(".conveyor-system-flow li, .conveyor-system-flow strong a")].map((e) => { const r = e.getBoundingClientRect(); return [r.width, r.height, r.x, r.y + scrollY]; }).concat([document.documentElement.scrollHeight])));
    const link = await page.$(".conveyor-system-flow li strong a");
    await link.evaluate((e) => e.scrollIntoView({ block: "center" }));
    await wait(600);
    const rest = await geometry();
    const restColor = await link.evaluate((e) => getComputedStyle(e).textDecorationColor);
    await link.hover();
    await wait(400);
    const hovered = await link.evaluate((e) => getComputedStyle(e).textDecorationColor), hoverGeometry = await geometry();
    await page.mouse.move(2, 2);
    await page.keyboard.press("Tab");
    await link.focus();
    await wait(400);
    const focused = await link.evaluate((e) => ({ color: getComputedStyle(e).textDecorationColor, ring: e.matches(":focus-visible") })), focusGeometry = await geometry();
    await link.evaluate((e) => e.blur());
    check(/, 0\)$|transparent/.test(restColor) && !/, 0\)$/.test(hovered) && !/, 0\)$/.test(focused.color) && focused.ring, `stage link cue: rest ${restColor}, hover ${hovered}, focus ${focused.color}`);
    check(rest === hoverGeometry && rest === focusGeometry, "hover and focus change no element size or position");
    // Language switching and arriving by client-side navigation show the copy in that page's language.
    const script = { "": /[A-Za-z]{4}/, "hi/": /\p{Script=Devanagari}/u, "ar/": /\p{Script=Arabic}/u };
    const copy = await page.evaluate(() => document.querySelector(".machine-identity > div > p").textContent);
    const inbound = await browser.newPage();
    await inbound.setViewport(viewport);
    await inbound.goto(`${origin}/${loc}machinery/`, { waitUntil: "networkidle2" });
    await inbound.waitForFunction(() => document.documentElement.dataset.skIntro === "done", { timeout: 20000 }).catch(() => {});
    await inbound.evaluate((s) => document.querySelector(`a[href$="/machinery/${s}/"]`).click(), slug);
    await inbound.waitForSelector(".machine-identity > div > p", { timeout: 20000 }).catch(() => {});
    await wait(800);
    const arrived = await inbound.evaluate(() => document.querySelector(".machine-identity > div > p")?.textContent);
    check(arrived === copy, "client-side navigation to this page shows the same copy as a direct load");
    await inbound.close();
    const other = loc === "ar/" ? "hi" : "ar";
    // An isolated context, because switching language stores a preference that would redirect later visits.
    const switchContext = await browser.createBrowserContext();
    const switcher = await switchContext.newPage();
    await switcher.setViewport(viewport);
    await switcher.goto(`${origin}/${loc}machinery/${slug}/`, { waitUntil: "networkidle2" });
    await switcher.waitForFunction(() => document.documentElement.dataset.skIntro === "done", { timeout: 20000 }).catch(() => {});
    await switcher.evaluate((o) => document.querySelector(`.language-selector-menu a[hreflang="${o}"], .language-selector-menu a[lang^="${o}"]`).click(), other);
    await switcher.waitForFunction((o) => location.pathname.includes(`/${o}/machinery/`), { timeout: 20000 }, other).catch(() => {});
    await wait(1500);
    const switched = await switcher.evaluate(() => document.querySelector(".machine-identity > div > p")?.textContent ?? "");
    check(script[`${other}/`].test(switched), `language switch to ${other} shows translated copy`);
    await switchContext.close();
  }
  // Client-side navigation from a linked stage keeps the locale and runs without errors.
  if (vpName === "desktop" && stageLinks.length) {
    await page.evaluate(() => document.querySelector(".conveyor-system-flow li a").click());
    await page.waitForFunction((p) => location.pathname !== p, { timeout: 15000 }, new URL(page.url()).pathname).catch(() => {});
    await wait(1500);
    const url = new URL(page.url()).pathname;
    check(url.startsWith(prefix + "machinery/") && !url.endsWith(`/${slug}/`), `stage link navigates: ${url}`);
  }
  check(!errors.length, `no JS or console errors${errors.length ? ": " + errors.slice(0, 3).join(" | ") : ""}`);
  await page.close();
}
console.log(`\nfailures: ${failures}`);
await browser.close();
process.exitCode = failures ? 1 : 0;
