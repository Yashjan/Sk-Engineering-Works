# Bag Filter validation summary

Date: 2026-11-13

Branch: `feature/bag-filter-content`

Baseline: `f96d60d17413d335117ee7177f1b4325bb6a26b4`

## Implementation

The generic Bag Filter configuration was replaced with machine-specific, conservative content covering fabric-filtration principles, externally visible construction, configuration inputs, dust handling, maintenance, system integration and buyer enquiry guidance. Dedicated Hindi and Arabic build-time dictionaries, localized metadata, Product/Breadcrumb support, localized process links and neutral media wording were added without changing the shared eleven-section layout or behavior.

Arabic `Bag Filter` was corrected from `مقطورة باغ` (bag trailer) to `مرشح الأكياس الصناعي` (industrial bag filter). Hindi uses the established industrial term `बैग फ़िल्टर`.

## Evidence boundary

- The catalog asset is an illustrative external view showing an enclosure, access structure, duct openings, lower hopper-like collection section and supports.
- The video caption is "WORKSHOP RECORD / GENERAL SHEET-METAL FABRICATION" (Hindi "वर्कशॉप रिकॉर्ड / सामान्य शीट-मेटल फैब्रिकेशन", Arabic "سجل الورشة / أعمال تصنيع الصفائح المعدنية العامة"). The 18.8-second footage shows general sheet-metal fabrication and does not establish that a Bag Filter is being fabricated. The video's alt text still says it is "associated with the Bag Filter archive"; whether to change it is left to the reviewer.
- Pulse-jet, reverse-air, shaker or other cleaning technology is not confirmed.
- Internal flow direction, media, element count, cages, filtration area, discharge equipment, controls, materials and performance remain unverified.
- No efficiency, micron, emissions, airflow, pressure, temperature, service-life, certification, customer or completed-installation claim is published.

## Validation

- ESLint: passed.
- TypeScript: passed, including the production build's TypeScript phase.
- i18n validation: passed with 2,349 shared entries and 325 build-time content entries.
- Production build: passed, 124/124 routes generated.
- Static export: 117 public pages, 120 physical HTML files, 81 sitemap URLs and 129 referenced assets; zero failures.
- `git diff --check`: passed.
- Bag Filter browser matrix passed at 1440 x 900 and 390 x 844 for English, Hindi and Arabic: correct language/direction, one H1, no overflow, nine working configuration controls, no JavaScript errors, valid links and lazy `preload="none"` video behavior.
- Product JSON-LD contains no manufacturer, offer, price, availability, rating, review or technical specification fields. Breadcrumbs, canonical and four hreflang alternates are correct.
- The enquiry validates required input and prepares a draft naming Bag Filter. Shared contact data remains `919828460532` and `+919828460532`; no message was sent.
- Cyclone, ID Fan / Blower, Portable Belt Conveyor and Complete Salt Refinery Plants passed isolated EN/HI/AR desktop/mobile smoke checks with zero failures.

The reusable probe's known false positives remain inapplicable: its broad `/review/i` expression matches the ordinary word “Review” in English metadata, and Bag Filter is not assigned as one of the refinery process-stage identifiers, so all 15 stage names correctly remain links. Its fallback client-navigation source also contains no Bag Filter anchor, so that assertion does not perform a navigation. Direct schema, route and browser checks resolve these cases.

## Payload comparison

Compared with the committed baseline:

- English: static HTML +19,187 bytes; script count unchanged; referenced JavaScript unchanged.
- Hindi: static HTML +36,779 bytes; script count unchanged; referenced JavaScript +65 uncompressed bytes.
- Arabic: static HTML +25,495 bytes; script count unchanged; referenced JavaScript +65 uncompressed bytes.

The HTML increase is the technical content. Long Hindi and Arabic text remains in build-time output. The small localized JavaScript delta is limited to new short shared labels; no new script request or translation runtime was added. Lighthouse was not run, and no score is claimed.

## Recommendation

The isolated implementation is technically ready for release review after company engineering and native technical-language reviewers accept the outstanding checklist. It has not been committed, pushed or deployed.

## Final release check

- **Gates:** ESLint, TypeScript, i18n validation (2349 shared and 325 build-time entries), production build (124 routes), export validation (117 pages, 0 failures; 120 HTML files; 81 sitemap URLs) and `git diff --check` all pass. No long Bag Filter copy is in client JavaScript (0 of 93 sentences).
- **Browser, EN/HI/AR at 1440×900 and 390×844:**
    - 11 sections and the new caption in each language;
    - the video keeps `preload="none"`;
    - telephone links go to `tel:+919828460532`, and WhatsApp drafts to `wa.me/919828460532` (not sent);
    - all 9 configuration controls toggle by keyboard;
    - Lenis wheel scrolling reaches the page end;
    - no horizontal overflow, console errors or failed requests.
- **Client-side navigation:** arriving from the ID Fan page's link shows the same copy as a direct load, in all three languages.
- **Known probe false positives:**
    - "Product JSON-LD without offers": matches the word "Review" in the English description.
    - "current stage is marked": Bag Filter is not a process stage.
    - "client-side navigation": the probe's starting pages do not link to Bag Filter.

    All three were verified by hand. The JSON-LD and "current stage" results also appear on the published Cyclone, ID Fan and Portable Belt Conveyor pages.
- **Regression spot checks:**
    - Cyclone and ID Fan / Blower: only the JSON-LD false positive.
    - Portable Belt Conveyor: only the JSON-LD and "current stage" false positives.
    - Complete Salt Refinery Plants: 160 of 160.
