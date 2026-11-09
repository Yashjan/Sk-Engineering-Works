// Enquiry forms in EN/HI/AR: required-field blocking, the WhatsApp button's label (one arrow, no raw tokens),
// and the draft it opens (company number, every value entered). The WhatsApp tab is closed at once; nothing is sent.
// usage: node qa/tools/enquiry_probe.mjs <node_modules with puppeteer-core> <origin>
import { createRequire } from "node:module";
import path from "node:path";
const load = createRequire(path.join(process.argv[2], "x.js"));
const puppeteer = load("puppeteer-core");
const origin = process.argv[3];
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const labels = { "": "OPEN WHATSAPP WITH DETAILS ↗", "hi/": "विवरण के साथ WHATSAPP खोलें", "ar/": "فتح واتساب مع التفاصيل ↗" };
const number = "919828460532";
const values = {
  belt: { Name: "QA Test Name", "Phone / WhatsApp": "9876543210", Company: "QA Company", Location: "QA Location", "Capacity / TPH": "QA Capacity", Material: "QA Material", Requirement: "QA Requirement" },
  engineering: { name: "QA Test Name", phone: "9876543210", company: "QA Company", location: "QA Location", requirement: "QA Requirement" },
};
const forms = [
  { name: "belt", page: "machinery/belt-conveyor/", selector: ".machine-enquiry form", required: ["Name", "Phone / WhatsApp"], also: ["Machine: Belt Conveyor"] },
  { name: "engineering", page: "engineering/", selector: "#engineering-enquiry form", required: ["name", "phone", "requirement"], also: [] },
];
let failures = 0;
const check = (ok, label) => { if (!ok) failures++; console.log(`  ${ok ? "ok  " : "FAIL"} ${label}`); };

async function fill(page, selector, entries) {
  await page.evaluate((selector, entries) => {
    const form = document.querySelector(selector);
    for (const [name, value] of Object.entries(entries)) {
      const el = form.elements.namedItem(name);
      const proto = el.tagName === "TEXTAREA" ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
      Object.getOwnPropertyDescriptor(proto, "value").set.call(el, value);
      el.dispatchEvent(new Event("input", { bubbles: true }));
    }
  }, selector, entries);
}
const draftLink = (selector) => document.querySelector(`${selector} a[href*="wa.me"]`)?.textContent.trim() ?? null;

for (const loc of ["", "hi/", "ar/"]) {
  for (const form of forms) {
    console.log(`\n## /${loc}${form.page}`);
    // A separate browser for each run: the site remembers the chosen language and would otherwise redirect.
    const browser = await puppeteer.launch({ executablePath: process.env.CHROME || "/usr/bin/google-chrome", headless: true, args: ["--no-sandbox"] });
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(`${origin}/${loc}${form.page}`, { waitUntil: "networkidle2", timeout: 90000 });
    await page.waitForFunction(() => document.documentElement.dataset.skIntro === "done", { timeout: 20000 }).catch(() => {});
    await wait(800);
    const submit = await page.$(`${form.selector} button[type="submit"]`);
    await submit.evaluate((b) => b.scrollIntoView({ block: "center" }));
    await wait(600);

    await page.evaluate((s) => document.querySelector(`${s} button[type="submit"]`).click(), form.selector);
    await wait(300);
    check((await page.evaluate(draftLink, form.selector)) === null, "empty form is blocked: no WhatsApp button yet");

    await fill(page, form.selector, values[form.name]);
    await page.evaluate((s) => document.querySelector(`${s} button[type="submit"]`).click(), form.selector);
    await page.waitForFunction((s) => document.querySelector(`${s} a[href*="wa.me"]`), { timeout: 5000 }, form.selector).catch(() => {});
    const label = await page.evaluate(draftLink, form.selector);
    check(label === labels[loc], `button label: ${label}`);
    check((label ?? "").split("↗").length <= 2 && !/×|_{3,}/.test(label ?? ""), "one arrow at most, no raw tokens");

    // Open it as a visitor would, read the URL of the new tab, then close that tab.
    const opened = new Promise((resolve) => browser.once("targetcreated", (t) => resolve(t)));
    await page.evaluate((s) => document.querySelector(`${s} a[href*="wa.me"]`).click(), form.selector);
    const target = await Promise.race([opened, wait(8000).then(() => null)]);
    const tabUrl = target?.url() ?? "";
    await (await target?.page())?.close().catch(() => {});
    const href = await page.evaluate((s) => document.querySelector(`${s} a[href*="wa.me"]`).href, form.selector);
    const url = new URL(href);
    const draft = url.searchParams.get("text") ?? "";
    check(url.pathname === `/${number}`, `draft goes to the company number: ${url.host}${url.pathname}`);
    check(Boolean(target) && /wa\.me|whatsapp\.com/.test(tabUrl), `clicking opens WhatsApp in a new tab: ${tabUrl.split("?")[0]}`);
    const missing = [...Object.values(values[form.name]), ...form.also].filter((v) => !draft.includes(v));
    check(!missing.length, `draft contains every value entered${missing.length ? "; missing " + JSON.stringify(missing) : ""}`);
    console.log(`       draft: ${draft.replace(/\n/g, " | ")}`);
    check(!errors.length, `no JS errors${errors.length ? ": " + errors.join("; ") : ""}`);
    await browser.close();
  }
}
console.log(`\nfailures: ${failures}`);
process.exit(failures ? 1 : 0);
