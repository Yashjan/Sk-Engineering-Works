# Screw Conveyor final release review

Date: 2026-11-10
Baseline: deployed release commit `3048bb1`

## 1. Authenticity and claims

The technical record, generated HTML, metadata and Product JSON-LD were reviewed in English, Hindi and Arabic.

- No numerical dimensions, capacities, speeds, motor ratings or performance values are published.
- No available-construction-material claim is published. The earlier unverified `MS / SS construction available` sentence is removed.
- No named customer, completed Screw Conveyor project, guaranteed performance, turnkey, warranty, lead-time or commissioning claim is published.
- Product JSON-LD contains name, description, category, URL, image and brand only. It contains no `manufacturer`, offer, price, availability, rating, review, award or guarantee field.
- The catalogue image description is limited to visible equipment: an enclosed conveyor, geared drive, fabricated casing and support frame.

### Media-provenance correction made in this review

The existing gallery uses general workshop and Jagdamba field media. Its former `REAL FABRICATION` heading and several attribution-heavy alt descriptions could imply that these records document this specific Screw Conveyor.

All original assets, item order, gallery layout, video settings and animation remain unchanged. Only evidence wording was made neutral:

- `09 / WORKSHOP & FIELD RECORD`
- `ENGINEERING CONTEXT / WORKSHOP & FIELD RECORDS.`
- `GENERAL PROJECT RECORD`
- Alt descriptions now state only what is visibly present, without attributing fabrication of the shown equipment to S.K. Engineering Works.

Dedicated Screw Conveyor fabrication/completed-machine assets exist in the repository, but no substitution was made because this review required preservation of the approved media. Company confirmation is still required before the general gallery can be described as Screw Conveyor-specific evidence.

## 2. Baseline/current 3D comparison

The baseline and current exports were built with the same installed dependencies, served locally, and tested in headless Chrome under identical conditions:

| Measurement | Baseline desktop | Current desktop | Baseline mobile | Current mobile |
|---|---:|---:|---:|---:|
| Viewport | 1440×900 | 1440×900 | 390×844 | 390×844 |
| Canvas | 1425×900 | 1425×900 | 390×844 | 390×844 |
| GLB | Approved GLB | Same approved GLB | Approved GLB | Same approved GLB |
| Model ready | Yes | Yes | Yes | Yes |
| ScrollTrigger pins | 1 | 1 | 0 | 0 |
| Configuration controls | 9 | 9 | 9 | 9 |
| Inspection enabled | Yes | Yes | Yes | Yes |
| Runtime/request errors | 0 | 0 | 0 | 0 |

- Side-by-side temporary captures show the same model geometry, materials, branding, lighting, camera composition and responsive scale.
- Small sub-frame position differences are consistent with the existing idle float being sampled at slightly different times.
- Desktop drag and keyboard inspection completed without errors in both versions.
- Mobile pinch input completed without errors in both versions.
- The same three gallery videos are present with the same sources, muted state and loop state.
- `ScrewConveyorCanvas.tsx`, `screw-conveyor-experience.css`, the approved GLB, media assets and all timeline constants are unchanged from `3048bb1`.

## 3. Localization and SEO

- Generated English, Hindi and Arabic HTML contains the localized title, technical process copy and neutral gallery heading.
- Browser checks at 1440×900 and 390×844 passed for all six language/device combinations with correct `lang`/`dir` and no English technical-copy fallback.
- Canonical and hreflang output is correct for all three routes.
- Product and Breadcrumb structured data use the correct localized page URLs.
- Process and related machinery links preserve the selected locale.
- Long English, Hindi and Arabic technical overview sentences do not occur in exported JavaScript chunks.
- The direct WhatsApp action is present in all generated pages. `MachineryEnquiry.tsx` is unchanged from the deployed baseline; its validation and draft behavior were already covered by the approved machinery-page checks.
- Native Hindi and Arabic engineering terminology review remains pending. The current translations passed structural and browser validation but have not been independently reviewed by a native technical specialist.

## 4. Validation gates

| Gate | Result |
|---|---|
| ESLint | Pass |
| TypeScript | Pass |
| i18n validation | Pass — 2,208 shared entries and 88 build-time content entries |
| Production build | Pass — 124 routes |
| Static export validation | Pass — 117 HTML pages, 81 sitemap URLs, 126 assets, 0 failures |
| i18n non-content audit | Pass — 0 removable code-shaped keys |
| EN/HI/AR desktop/mobile browser matrix | Pass — 0 failures |
| Generated HTML and claims audit | Pass — 0 failures |
| Baseline/current 3D comparison | Pass |
| `git diff --check` | Pass |

The attempted extra repeat of the interactive WhatsApp form submission could not be launched because automatic tool approval reached its usage limit. This is not a product failure: the direct WhatsApp link is verified in all three exports, the enquiry component is unchanged from `3048bb1`, and the approved prior machinery enquiry validation remains applicable.

## 5. Release decision

Technically ready for publication. Release approval is recommended, with native Hindi/Arabic terminology review and the engineering/company confirmations in `engineering-verification-checklist.md` retained as follow-up items rather than release blockers.
