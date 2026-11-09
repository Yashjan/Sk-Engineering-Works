import fs from "node:fs";

const read = (locale) => JSON.parse(fs.readFileSync(`src/i18n/dictionaries/${locale}.json`, "utf8"));
const hi = read("hi");
const ar = read("ar");
const keys = new Set([...Object.keys(hi), ...Object.keys(ar)]);
const missing = { hi: [...keys].filter((key) => !(key in hi)), ar: [...keys].filter((key) => !(key in ar)) };
if (missing.hi.length || missing.ar.length) { console.error(JSON.stringify(missing, null, 2)); process.exit(1); }
for (const [locale, dictionary] of Object.entries({ hi, ar })) {
  const invalid = Object.entries(dictionary).filter(([, value]) =>
    typeof value !== "string" || !value.trim() || /(?:Q\d+X|XQ\d+X|إكس|&apos;|&quot;)/u.test(value)
  );
  if (invalid.length) {
    console.error(`${locale} has malformed translations:`, invalid.map(([key]) => key));
    process.exit(1);
  }
}

// Build-time machinery copy: both languages must cover the same English sentences, in the right script.
const contentDir = "src/i18n/machinery-content";
const script = { hi: /\p{Script=Devanagari}/u, ar: /\p{Script=Arabic}/u };
let contentEntries = 0;
for (const file of fs.readdirSync(contentDir).filter((name) => name.endsWith(".hi.json"))) {
  const slug = file.replace(".hi.json", "");
  const copy = { hi: JSON.parse(fs.readFileSync(`${contentDir}/${slug}.hi.json`, "utf8")), ar: JSON.parse(fs.readFileSync(`${contentDir}/${slug}.ar.json`, "utf8")) };
  const sources = new Set([...Object.keys(copy.hi), ...Object.keys(copy.ar)]);
  for (const source of sources) {
    for (const locale of ["hi", "ar"]) {
      const value = copy[locale][source];
      const other = locale === "hi" ? script.ar : script.hi;
      if (typeof value !== "string" || !script[locale].test(value) || other.test(value)) {
        console.error(`${slug} ${locale} has a missing or wrong-script translation:`, source);
        process.exit(1);
      }
    }
    if (source in hi || source in ar) {
      console.error(`${slug} copy is also in the client dictionaries, which defeats the split:`, source);
      process.exit(1);
    }
  }
  contentEntries += sources.size;
}
console.log(`Validated ${keys.size} shared translation entries for Hindi and Arabic, plus ${contentEntries} build-time machinery entries.`);
