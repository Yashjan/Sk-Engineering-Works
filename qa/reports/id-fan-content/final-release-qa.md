# ID Fan / Blower final release QA

Date: 2026-11-11
Baseline: `11431986f2fe5965d575695811208f6eb1d09fd6`

## Export count reconciliation

- A fresh baseline build and the current build each contain the same **120 physical HTML files**. A path-for-path comparison found zero additions and zero removals.
- `qa/tools/validate_out.py` reports **117 public pages** because it counts only `index.html` route files and deliberately excludes three error artifacts: `404.html`, `404/index.html`, and `_not-found/index.html`.
- The Next.js build reports **124 generated routes**, which also includes non-HTML metadata/image routes such as `robots.txt`, `sitemap.xml`, `icon.png`, and `apple-icon.png`.
- All 63 localized machinery-detail files are present: 21 machinery slugs in English, Hindi and Arabic.
- Sitemap validation found 81 indexable URLs, correct reciprocal English/Hindi/Arabic/x-default hreflang coverage, and no missing or extra indexable routes.

## Authenticity and media provenance

- The public copy identifies the visible circular inlet, rotating wheel, scroll-shaped housing, outlet and base as externally observable features.
- General centrifugal-fan principles are described as principles of the illustrated arrangement, not as verified performance specifications.
- Induced-draft, supply-air, ventilation, extraction and dryer/dust-control uses are conditional (`may`, `suitable`, and project-specific) and are not presented as verified duties of a particular S.K. Engineering Works unit.
- No numerical airflow, pressure, RPM, motor power, efficiency, temperature, capacity or material specification is published.
- Blade geometry, impeller construction, drive arrangement, balance grade, materials and performance remain expressly unverified.
- No customer, completed-project, installation-performance or guarantee claim is made.
- Product JSON-LD contains only name, description, category, URL, image and brand, plus BreadcrumbList data. It contains no offer, price, availability, review, rating, manufacturer, specification or performance fields.
- The hero asset is described as an illustrative catalog view. The real photograph is captioned `WORKSHOP RECORD / INDUSTRIAL FAN HOUSING`; it is not represented as installation evidence or proof of specifications.

## Links and interaction regression

- Cyclone, Dryer, Bag Filter and Complete Salt Refinery Plants destinations exist in all three locales and resolve from the exported HTML.
- English links remain under the English route; Hindi and Arabic links preserve their locale prefix.
- Links are semantic anchors and remain keyboard accessible. Arabic pages retain `dir="rtl"`.
- Link wording names the equipment or plant context without promising verified specifications on the destination page.
- Browser checks at 1440x900 and 390x844 passed for English, Hindi and Arabic: 200 responses, correct language/direction, 11 sections, localized copy, loaded images, eight keyboard-operable configuration disclosures, Lenis end-of-page scrolling, no horizontal overflow, and no console, hydration or failed-request errors.
- WhatsApp draft generation was checked without sending: the draft targeted `919828460532` and retained the entered machine, name and requirement. The phone link remained `+919828460532`.
- No CSS, GSAP, ScrollTrigger, Lenis, media, navigation or enquiry implementation changed in this release.

## Validation

- `npm run lint`: pass
- `npm run typecheck`: pass
- `npm run validate:i18n`: pass (2,273 shared entries and 202 build-time content entries)
- `npm run build`: pass (124 generated routes)
- `python3 qa/tools/validate_out.py out`: pass (117 public pages, 81 sitemap URLs, 126 checked assets, zero failures)
- `git diff --check`: pass
- Long Hindi and Arabic ID Fan / Blower technical phrases were absent from emitted client JavaScript chunks and present in generated localized HTML.

## Engineering verification still required

Before publishing any specifications or evidence claims, confirm the exact intended duty; airflow and pressure basis; air/gas condition; fan type; impeller and blade details; shaft, bearing, motor and drive arrangement; operating speed; materials and protection; temperature and efficiency limits; balancing/testing basis; scope of supply; and the provenance and publication rights for workshop/project media. The detailed checklist remains in `engineering-verification-checklist.md`.

## Recommendation

The release is technically ready for publication with the current conservative wording. Numerical specifications, named installations and equipment-specific performance claims should remain unpublished until company engineering records confirm them.
