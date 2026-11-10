# Screw Conveyor technical-content release validation

Date: 2026-11-10
Compared with committed baseline: `3048bb1`

## Implemented

- Replaced the generic machine record with conservative technical content covering overview, operating principle, named model components, salt-refinery placement, configuration inputs, plant integration and buyer enquiry inputs.
- Removed the unverified `MS / SS construction available` statement. No numerical dimensions, capacities, speeds, motor powers, materials, standards, lead times, warranties or delivery-scope promises were added.
- Added build-time Hindi and Arabic long-copy dictionaries for this machine.
- Passed the localized machine record into the existing full-page closing blocks, fixing their previous direct import of the English record.
- Kept the identity summary localized by passing one short build-time tagline to the existing client experience. Long technical translations do not occur in exported JavaScript chunks.
- Added machine-specific metadata, canonical/hreflang output, existing catalogue media for Open Graph, BreadcrumbList data and conservative Product data without offers, prices, ratings, reviews or manufacturer claims.
- Enabled localized semantic links to the existing process-stage machinery routes, the complete plant page and the published Belt Conveyor route.
- Added an engineering verification checklist for all unpublished specifications and commercial statements.

## Preserved

- No CSS, media asset, GLB, Three.js canvas implementation, model transform, camera behavior, GSAP timeline value, ScrollTrigger timing, Lenis behavior, video component, gallery media data, enquiry workflow or page transition was changed. The final release review changed only the gallery's evidence labels and alt descriptions to avoid implying machine-specific provenance.
- Component chapter durations and the total scroll-story duration are byte-for-byte unchanged; only their visible descriptions changed.
- The current gallery remains a general workshop/site montage and is explicitly labelled as general workshop and field records. It is not cited as Screw Conveyor-specific proof pending company confirmation.

## Automated validation

| Check | Result |
|---|---|
| `npm run lint` | Pass |
| `npm run typecheck` | Pass |
| `npm run validate:i18n` | Pass — 2,208 shared entries and 88 build-time content entries |
| `npm run build` | Pass — 124 static routes generated |
| `python3 qa/tools/validate_out.py out` | Pass — 117 HTML pages, 81 sitemap URLs, 126 assets checked, 0 failures |
| i18n non-content audit | Pass — 0 code-shaped translation keys |
| `git diff --check` | Pass |
| Long technical copy in exported JS chunks | None found for English, Hindi or Arabic |

## Browser validation

The exported site was tested at 1440×900 and 390×844 in English, Hindi and Arabic.

- 6/6 combinations returned HTTP 200 with correct `lang` and `dir`.
- One H1, localized identity tagline, localized metadata, canonical and four hreflang links were present.
- The WebGL canvas rendered in all six combinations.
- No horizontal overflow, failed requests, page errors or console errors were found.
- Product structured data contained no offers, price, availability, rating, review or manufacturer claim.
- The active process stage, nine configuration controls and localized internal links were preserved.
- Configuration selection worked in all six combinations.
- Desktop drag/keyboard inspection and mobile pinch input completed without errors.
- Lenis/ScrollTrigger progression reached the closing content on desktop and mobile; desktop retained its pinned sequence and mobile retained its established non-pinned sequence.

## Evidence and remaining verification

Repository evidence supports the machine model, process position and existence of dedicated Screw Conveyor fabrication/completed-machine media. Company confirmation is still required before publishing numerical specifications, available construction materials, standards, named-project claims, installation/commissioning scope, warranty, lead time or a statement that the general fabrication gallery shows this exact machine. See `engineering-verification-checklist.md`.
