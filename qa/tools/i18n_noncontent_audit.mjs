// Finds translation-dictionary keys that are code (CSS, media queries, GSAP config, selectors, MIME types…)
// and proves every source occurrence is in a non-translated position before proposing removal.
// usage: node qa/tools/i18n_noncontent_audit.mjs [--apply]
import fs from "node:fs";
import path from "node:path";

const dictPath = (l) => `src/i18n/dictionaries/${l}.json`;
const hi = JSON.parse(fs.readFileSync(dictPath("hi"), "utf8"));
const ar = JSON.parse(fs.readFileSync(dictPath("ar"), "utf8"));

const codeShape = [
  /^\(\s*(?:max|min)-(?:width|height)|^\((?:hover|pointer|prefers-)/,            // media queries / sizes
  /^\d+(?:vw|vh|px)$|^\d+px \d+px$|^-?\d+% \d+px -?\d+%$/,                       // lengths / rootMargin
  /^(?:power\d|sine|expo|circ|back)\.(?:in|out|inOut)$/,                          // GSAP eases
  /^(?:top|bottom|center) (?:top|bottom|center)$/,                                // ScrollTrigger positions
  /^rgba?\(/, /^(?:image|video)\/[a-z0-9]+$/, /^_self$/, /^:focus-visible$/,       // colours / MIME / targets
  /^\[role=|^button:not\(|^input, textarea, select/,                              // DOM selectors
  /^(?:en|hi)-IN$/,                                                               // locale tags
];
// Source positions whose string values never pass through the translator.
const codeContext = /[!=]==\s*$|(?:sizes|media|type|target|rootMargin|ease|start|end|toggleActions|matchMedia|querySelector(?:All)?|closest|matches|add|background|color|borderColor|backgroundColor|stroke|fill|toLocaleString|Intl\.\w+|locale|lang|hrefLang)\s*[=:(,]\s*\{?\s*$|\?\s*$|:\s*$|\(\s*$|,\s*$|\[\s*$/;
// Positions that ARE translated (JSX text, translated attributes, explicit translate()).
const translatedContext = /(?:aria-label|aria-description|title|placeholder|alt)\s*=\s*\{?\s*$|translate\(\s*$/;

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(tsx?|mjs)$/.test(e.name)) out.push([p, fs.readFileSync(p, "utf8")]);
  }
  return out;
}
const files = walk("src");
const report = [];
const removable = [];
for (const key of Object.keys(hi)) {
  if (!codeShape.some((r) => r.test(key))) continue;
  const occurrences = [];
  for (const [file, text] of files) {
    for (const quote of ['"', "'", "`"]) {
      let i = text.indexOf(quote + key + quote);
      while (i !== -1) {
        const before = text.slice(Math.max(0, i - 60), i);
        const line = text.slice(0, i).split("\n").length;
        const kind = translatedContext.test(before) ? "TRANSLATED" : codeContext.test(before) ? "code" : "unclear";
        occurrences.push({ file, line, kind, before: before.split("\n").pop().slice(-45) });
        i = text.indexOf(quote + key + quote, i + 1);
      }
    }
    // JSX text node occurrence (>key<) would be translated
    if (text.includes(`>${key}<`)) occurrences.push({ file, line: 0, kind: "TRANSLATED", before: "JSX text" });
  }
  const safe = occurrences.every((o) => o.kind === "code");
  report.push({ key, safe, occurrences });
  if (safe) removable.push(key);
}
for (const r of report) {
  console.log(`${r.safe ? "REMOVE" : "KEEP  "} ${JSON.stringify(r.key)}  (${r.occurrences.length} refs)`);
  for (const o of r.occurrences.filter((o) => o.kind !== "code")) console.log(`         ${o.kind} ${o.file}:${o.line}  …${o.before}`);
}
console.log(`\n${removable.length} removable of ${report.length} code-shaped keys`);
if (process.argv.includes("--apply")) {
  for (const [l, d] of [["hi", hi], ["ar", ar]]) {
    for (const k of removable) delete d[k];
    fs.writeFileSync(dictPath(l), JSON.stringify(d, null, 2) + "\n");
  }
  console.log("applied");
}
