# Drying terminology correction — validation summary

## Scope

This content-only correction removes unverified heating, airflow and control wording from the shared refinery-process copy. It does not describe or alter the Dryer machine's confirmed visual form, media, layout, animation or interaction.

## Before and after

| Location | Before | After | Reason |
| --- | --- | --- | --- |
| Shared process stage | `Reduces remaining moisture through controlled drying.` | `Reduces remaining moisture during the drying stage.` | No evidence confirms a control system for this equipment. |
| Shared process stage label | `HOT-AIR DRYING` | `DRYING STAGE` | No evidence confirms a hot-air arrangement. |
| Plant process description | A dryer removes moisture `using heat and airflow`, with named downstream air equipment. | The drying stage helps reduce moisture where required; its arrangement and connected equipment depend on product and plant design. | Avoids attributing an unverified heating or airflow mechanism to S.K. Engineering Works equipment. |

The final localized stage label is `सुखाने का चरण` in Hindi and `مرحلة التجفيف` in Arabic.

## Files changed

- `src/data/process.ts`
- `src/i18n/dictionaries/hi.json`
- `src/i18n/dictionaries/ar.json`
- `src/i18n/plant-content/salt-refinery-plants.en.ts`
- `src/i18n/plant-content/salt-refinery-plants.hi.json`
- `src/i18n/plant-content/salt-refinery-plants.ar.json`
- `qa/reports/drying-terminology-correction/validation-summary.md`

The Hindi and Arabic shared dictionaries remove five unused legacy keys that contained the same unsupported hot-air, control or heat-and-airflow wording, and replace the former shared-process purpose key with the revised wording. They add only the localized replacement shared-process strings.

## Pages affected

The shared process stage appears on the homepage, Complete Salt Refinery Plants page, machinery process integration sections and any page that renders `processStages`. The revised plant-process paragraph appears on the Complete Salt Refinery Plants page in English, Hindi and Arabic.

## Related Dryer-page audit

`src/data/machinery-details/dryer.ts` and its build-time Hindi and Arabic content contain general scientific explanations of drying and conditional statements about possible design choices. They explicitly do not name a heat source or internal dryer type. They were left unchanged because they do not assert a confirmed hot-air, airflow-direction or automatic-control arrangement for S.K. Engineering Works equipment.

## SEO and structured data

No SEO title, meta description, Open Graph entry, image alt text, canonical, hreflang, sitemap, Product JSON-LD or Breadcrumb JSON-LD repeats the corrected shared-process wording. No structured-data change is required.

## Validation

- ESLint: passed.
- TypeScript: passed.
- i18n validation: passed — 2,300 shared Hindi/Arabic entries and 258 build-time content entries validated.
- Production static build: passed — 124 routes generated.
- Export validation: passed — `pages=117`, `sitemap_urls=81`, `assets_checked=126`, `failures=0`; the export directory contains 120 physical HTML files because the validator counts public route pages separately from support/fallback files.
- `git diff --check`: passed.
- Source audit: no remaining `hot-air`, `controlled drying`, or `using heat and airflow` phrase exists under `src` outside CSS.
- Browser checks: passed in English, Hindi and Arabic at 1440×900 and 390×844 for Home, Complete Salt Refinery Plants, Dryer and Engineering. The Home process control selected the drying stage; the plant process used desktop hover and mobile tap to select stage 05. All runs confirmed the localized wording, language direction, loaded visible images, Lenis initialization, full-page scroll, no horizontal overflow, and no runtime or network errors.

## Remaining engineering verification

Before publishing a specific dryer technology or performance claim, obtain engineering confirmation of the heat source, energy-transfer method, airflow route, exhaust arrangement, internal construction, controls, operating conditions and required finished-moisture target.

## Publication recommendation

This is a small, factual, text-only correction with no visual or functional change. It is ready for release review once the outstanding engineering facts above are confirmed before any future equipment-specific dryer claim. Do not commit or deploy as part of this verification task.
