# Screw Washer technical-content and SEO final report

Date: 2026-11-10
Comparison baseline: `da44b4d18dd21b7f4b955b3ae4a8b66c6182810e`

## 1. Initial audit and issues

The baseline page used the approved reusable machinery-detail presentation but contained only short generic descriptions. It did not explain design-dependent washing arrangements, liquid contact, agitation, drainage, raw-salt inputs, water conditions, maintenance access or buyer enquiry requirements. Hindi and Arabic had no complete build-time technical content; the old shared Arabic SEO strings were corrupted. Product and Breadcrumb structured data were not enabled.

The detailed findings and safe implementation direction are in `initial-audit.md`.

## 2. Technical improvements

The existing sections now explain, without numerical or guaranteed claims:

- the machine's possible combination of screw-driven movement, agitation and washing-liquid contact;
- why the arrangement depends on raw salt, washing objective, available water and connected equipment;
- the washing body, screw and shaft, feed/discharge, design-dependent liquid and drainage provisions, drive, bearings/seals and support/access considerations;
- a conditional five-stage working principle covering feed, contact/agitation, screw transfer, design-dependent liquid separation and discharge;
- raw-salt condition, required flow and duty, washing objective, water management, screw geometry and residence, material selection, mechanical load, connections, access and plant integration;
- the site's illustrated thickener → screw washer → centrifuge relationship as one possible sequence rather than a mandatory process;
- buyer inputs for raw salt, capacity, water, downstream condition, layout, site, connected equipment and project context.

No capacity, dimension, power, purity, recovery, efficiency, water-saving, operating-cost, ROI, life, warranty, lead-time or completed-project figure was added.

## 3. SEO and structured data

- English title: `Screw Washer for Salt Processing | S.K. Engineering Works`
- English description: `Screw washing equipment for suitable salt-processing lines. Explore its working principle, components, configuration and plant-integration considerations.`
- Equivalent Hindi and Arabic title and description are rendered at build time.
- Canonical and four hreflang links are present on all three language routes.
- Conservative Product data contains name, description, category, URL, image and brand. It contains no manufacturer, offer, price, availability, review, rating or specification fields.
- Breadcrumb data contains Home → Machinery → Screw Washer with the correct localized URL.
- The catalog render alt text now describes the visible illustrative open-trough machine rather than claiming media provenance.

## 4. Internal links and enquiry

- The existing Complete Salt Refinery Plants links remain.
- A contextual link to the developed Screw Conveyor page was added for enclosed transfer between process stages.
- Localized links preserve English, Hindi and Arabic routes.
- The existing form fields, validation, phone and WhatsApp logic are unchanged.
- Browser tests prepared populated drafts in all three languages and confirmed `wa.me/919828460532` and `tel:+919828460532`. No message was sent.

## 5. Localization

- Long Hindi and Arabic content is stored in `src/i18n/machinery-content/screw-washer.{hi,ar}.json` and resolved by the server-only machinery-content module during static generation.
- Short headings and labels use the existing shared dictionaries.
- Generated localized HTML contains the complete technical content.
- The three long overview sentences were absent from required and prefetched client JavaScript.
- Corrupted legacy Arabic Screw Washer SEO strings are no longer visible because localized metadata now comes from the build-time content file.
- Native technical review of Hindi and Arabic terminology remains recommended before publication.

## 6. Media and project evidence

- Repository evidence found: one 1122×1402 transparent catalog render at `public/images/machinery/catalog/screw-washer.webp`.
- No verified Screw Washer workshop photograph, installation photograph, operating video, CAD record or named project record was found.
- `realMedia` remains empty. The page continues to state that dedicated fabrication photography is not available in the project archive.
- No generic workshop or project footage was added or presented as Screw Washer evidence.
- The existing image, its arrangement and all media behavior are unchanged.

## 7. Performance comparison

Identical production builds and static servers were used for baseline and current exports.

| Route | Baseline HTML raw | Current HTML raw | Baseline HTML gzip | Current HTML gzip | Baseline required JS gzip | Current required JS gzip |
|---|---:|---:|---:|---:|---:|---:|
| English | 58,448 B | 71,292 B | 10.7 KB | 14.7 KB | 217.1 KB | 216.3 KB |
| Hindi | 69,928 B | 97,745 B | 13.2 KB | 18.2 KB | 370.2 KB | 370.3 KB |
| Arabic | 65,288 B | 83,539 B | 12.7 KB | 17.4 KB | 370.2 KB | 370.3 KB |

The HTML increase is the requested readable technical content. Required JavaScript is effectively unchanged; Hindi and Arabic differ by approximately 0.1 KB gzip because of the added short shared labels. Long technical sentences do not occur in required or prefetched JavaScript.

Lighthouse was not rerun because no Lighthouse package is installed in the project or the available QA dependency directory. No score is claimed. Real-browser checks covered loading, responsive overflow, keyboard operation and runtime errors instead.

## 8. Browser and regression validation

English, Hindi and Arabic were tested at 1440×900 and 390×844.

- HTTP and page rendering: pass
- Correct `lang` and `dir`, including Arabic RTL: pass
- One H1 and no skipped heading levels: pass
- Localized title, description, canonical and hreflang: pass
- Product and Breadcrumb data: pass
- Catalog image load and alt text: pass
- Ten configuration disclosures: pass
- Keyboard Enter operation on disclosures: pass
- Localized internal links: pass
- WhatsApp draft and phone destination: pass
- Lenis forward scroll: pass
- Horizontal overflow: none
- Browser errors and failed requests: none
- Static export validation: 117 HTML pages, 81 sitemap URLs, 126 assets, zero failures

Baseline/current comparison passed at desktop and mobile:

- same 11 sections and top-level class sequence;
- same six compiled stylesheet assets;
- same hero image path;
- same digital-inspection placeholder;
- same zero-video state and footer;
- no ScrollTrigger pin was added;
- no shared component, CSS, animation, media, navigation or enquiry implementation was changed.

Screenshots used for local comparison are temporary files under `/tmp/sk-screw-washer-shots` and are not part of the repository.

## 9. Validation gates

| Check | Result |
|---|---|
| ESLint | Pass |
| TypeScript | Pass |
| i18n validation | Pass — 2,228 shared entries and 119 build-time content entries |
| Production build | Pass — 124 routes |
| Static export validation | Pass — zero failures |
| English/Hindi/Arabic desktop/mobile browser matrix | Pass — zero failures |
| Baseline/current layout comparison | Pass |
| Keyboard, Lenis and interaction check | Pass |
| `git diff --check` | Pass |

## 10. Remaining verification and recommendation

Engineering/company confirmation is still required for the exact washing method, supported salt conditions, process positions, construction materials, capacity, screw and drive specifications, water circuit, drainage, bearing/seal arrangement, supply scope and any machine-specific media or project references. The full list is in `engineering-verification-checklist.md`.

The current version is technically ready for review and publication because it keeps uncertain details conditional and withholds unsupported specifications. Native Hindi and Arabic engineering terminology review and company completion of the verification checklist are recommended follow-up items.
