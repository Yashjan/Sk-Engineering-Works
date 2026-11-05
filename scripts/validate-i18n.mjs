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
console.log(`Validated ${keys.size} shared translation entries for Hindi and Arabic.`);
