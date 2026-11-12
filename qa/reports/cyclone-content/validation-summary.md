# Cyclone implementation and validation summary

Date: 2026-11-11
Comparison baseline: `be4fa08730b09b499185a57cba32fa7ecdf8bf16`

## Implemented content

- Replaced the generic `createMachine` record with Cyclone-specific overview, operating principle, externally supportable component descriptions, configuration, installation, maintenance, process-integration and buyer-enquiry guidance.
- Classified the illustrated form conservatively as a conventional gas-solid cyclone separator while withholding unverified internal geometry, discharge-device, material and performance claims.
- Explained that cyclone separation depends on particles, airflow, geometry and operating conditions; distinguished it from a bag filter; and avoided complete-removal or efficiency claims.
- Kept the existing catalog image, site photograph, 11-section layout, eight configuration disclosures and enquiry implementation.
- Replaced the unverified installed-Cyclone caption with a neutral site-record caption while preserving the same image and layout.
- Added dedicated build-time Hindi and Arabic long-copy files and localized short technical labels.
- Added localized SEO title/description, conservative Product JSON-LD and Breadcrumb JSON-LD.
- Enabled localized process-stage links, including Dryer and ID Fan / Blower, plus a related Bag Filter link. Existing Complete Salt Refinery Plants and Engineering content remain available.

## Media assessment

- The catalog image is treated as illustrative. It supports only externally visible inlet/outlet ducting, cylindrical and conical sections, lower discharge region and support frame.
- The site photograph is a real project-site record showing conical process equipment and steel structure. It is not identified as a verified Cyclone installation because site, customer and equipment-duty records were not found.
- Existing fabrication/completed-machine videos and the archive still remain unchanged and were not newly embedded. Repository association alone does not prove customer, capacity, construction, performance or commissioning.

## Performance comparison

| Artifact | Baseline | Current | Change |
|---|---:|---:|---:|
| English generated HTML | 57,558 B | 71,598 B | +14,040 B |
| Hindi generated HTML | 68,641 B | 96,611 B | +27,970 B |
| Arabic generated HTML | 64,680 B | 84,116 B | +19,436 B |
| All emitted JavaScript chunks | 3,043,488 B | 3,043,062 B | -426 B |

The HTML increase is the requested visible technical content. Unique long Hindi and Arabic Cyclone phrases were absent from emitted client JavaScript chunks and present in generated HTML. Removing obsolete generic Cyclone sentences from the shared client dictionaries offset the added short translated labels, producing a small net JavaScript reduction. Chunk count remained 52. Lighthouse, LCP and CLS were not measured, so no scores are claimed.

## Validation results

| Check | Result |
|---|---|
| ESLint | Pass |
| TypeScript | Pass |
| i18n validation | Pass — 2,294 shared entries and 231 build-time content entries |
| Production build | Pass — 124 static routes generated |
| Static export | Pass — 117 public pages, 81 sitemap URLs, 126 checked assets, zero failures |
| English desktop 1440×900 | Pass |
| English mobile 390×844 | Pass |
| Hindi desktop 1440×900 | Pass |
| Hindi mobile 390×844 | Pass |
| Arabic desktop 1440×900 | Pass |
| Arabic mobile 390×844 | Pass |
| `git diff --check` | Pass |

Browser checks confirmed correct `lang`/`dir`, localized technical copy and metadata, one H1, the original 11-section structure, Product/Breadcrumb schema, catalog/site image loading, eight keyboard-operable configuration disclosures, localized internal links, no horizontal overflow, Lenis reaching the page end, `tel:+919828460532`, and a populated WhatsApp draft addressed to `919828460532`. The draft was not sent. No JavaScript, hydration, console, missing-asset or failed-request errors occurred.

## Regression and release assessment

No CSS, GSAP, ScrollTrigger, Lenis, Three.js, media, navigation, form, transition or deployment-workflow file was changed. Other machinery data files were not modified. Browser scrolling completed without animation/runtime errors; the unchanged shared animation implementation remains intact.

Native Hindi and Arabic technical review remains recommended. Company engineering must complete `engineering-verification-checklist.md` before numerical, material, performance, standards or verified-installation claims are added.

The local implementation is technically ready for final content review. It must not be presented as fully engineering-verified until the outstanding equipment and media-provenance questions are resolved.
