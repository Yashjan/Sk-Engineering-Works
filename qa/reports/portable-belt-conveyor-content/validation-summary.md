# Portable Belt Conveyor validation summary

Date: 2026-11-12

Release branch: `feature/portable-belt-conveyor-content`

Baseline: `a82434195c4adeef9d8e39f0a7e13629ab49a203`

## Scope

The existing eleven-section machinery-detail template, styling, media, animations, navigation and enquiry implementation remain unchanged. This release adds Portable Belt Conveyor-specific English content, build-time Hindi and Arabic technical translations, conservative metadata and structured data, localized related links, corrected media descriptions, and engineering-verification records.

## Evidence and claims

- The catalog image is described as illustrative.
- The completed-machine workshop video supports describing an inclined conveyor on a wheel-supported chassis with a visible belt, support structure and drive equipment.
- The fabrication video is described only as an associated workshop frame-fabrication record.
- The public copy does not publish throughput, belt grade, dimensions, inclination range, motor rating, belt speed, construction material, efficiency or performance guarantees.
- Towing, powered travel, one-person movement, hydraulic or telescopic adjustment, public-road use, steering and brakes are expressly left unverified.
- Product JSON-LD contains name, description, category, URL, image and brand. It contains no manufacturer, offer, price, availability, rating or review field.

## Static validation

- `npm run lint`: passed.
- `npm run typecheck`: passed after the production build generated Next.js route types.
- `npm run validate:i18n`: passed; 2,323 shared entries and 292 build-time content entries validated.
- `npm run build`: passed; 124/124 static routes generated.
- `python3 qa/tools/validate_out.py out`: passed; 117 public pages, 81 sitemap URLs and 128 referenced assets checked.
- Physical exported HTML files: 120. The difference from 117 public pages is the export representation/counting distinction, not missing routes.
- `git diff --check`: passed.

## Browser validation

The generated export was served at its GitHub Pages base path and checked with headless Chrome at 1440 x 900 and 390 x 844 for English, Hindi and Arabic.

- Correct `lang` and RTL/LTR direction in all six combinations.
- One H1, valid heading progression, no horizontal overflow and no empty image alt text.
- Canonical URL and four hreflang alternates are correct for every locale.
- Portable Belt Conveyor content and localized labels render after direct loads, client navigation and language switching.
- All 15 process-stage links plus the fixed Belt Conveyor and Complete Salt Refinery Plants links preserve the selected language and return HTTP 200.
- All nine configuration accordions open and expose their copy.
- The enquiry blocks invalid submission, then prepares a WhatsApp draft naming Portable Belt Conveyor. The shared contact source targets `919828460532`; no message was sent.
- No page or console errors were observed.
- Workshop videos retain `preload="none"`; no media-loading behavior changed.
- Temporary screenshots were written only under `/tmp`.

The generic machinery probe emitted two known false positives for this route: Portable Belt Conveyor is not itself one of the 15 plant process-stage identifiers, so all 15 are correctly linked; and its broad `/review/i` field check matched the ordinary English word “Review” in the Product description. Direct inspection confirms there is no JSON-LD `review` field.

## Regression validation

- The localized Belt Conveyor desktop/mobile matrix passed with zero failures.
- The localized Complete Salt Refinery Plants desktop/mobile matrix passed with zero failures, including nine process-stage interactions, six configuration controls, enquiry actions and plant-drawing dialog.
- No CSS, GSAP, ScrollTrigger, Lenis, Three.js, page-transition, shared navigation or enquiry implementation file changed.

## Payload comparison

Compared with the baseline export:

- English: static HTML +19,421 bytes; script count unchanged at 16; referenced JavaScript unchanged.
- Hindi: static HTML +39,920 bytes; script count unchanged at 21; referenced JavaScript +3,849 uncompressed bytes.
- Arabic: static HTML +26,463 bytes; script count unchanged at 21; referenced JavaScript +3,849 uncompressed bytes.

The HTML growth is the new technical content. The localized JavaScript delta is limited to the short shared labels added to the existing locale dictionary; long Hindi and Arabic technical copy remains in build-time page content. No new script request or translation runtime was introduced.

## Remaining verification

Company engineering should confirm the items listed in `engineering-verification-checklist.md`, especially the mobility and stabilization method, drive ratings, belt/support/tensioning arrangement, permissible inclination, guarding and electrical details. A native technical-language review of Hindi and Arabic remains advisable before publication.

## Recommendation

The isolated release is technically ready for review and may proceed after the outstanding company engineering and native-language confirmations are accepted. It has not been committed, pushed or deployed.
