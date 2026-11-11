# Dryer: final QA and isolated release

**Who this is for:** whoever approves and commits the Dryer release.
**Baseline:** `be4fa08`, the last known `origin/main`. `git fetch` could not reach GitHub during this check, so `origin/main` should be re-checked before committing.

## 1. Arabic `PREPARE ENQUIRY →`

- **What the button does:** it checks the required fields, then prepares a WhatsApp draft. It does not send anything.
- **Where it appears:** every machine page's enquiry form, and the Engineering page enquiry (20 pages in each language).
- **Change:** "أستعدوا للتحقيق" (roughly "get ready for an investigation") → "إعداد طلب الاستفسار" ("prepare the enquiry"). The wording suits both forms.
- **Arrow:** left out, following the site's Arabic convention (for example `DISCUSS YOUR REQUIREMENT →` is "ناقش متطلباتك"). In right-to-left text, → points the wrong way.
- **Unchanged:** the button's markup, size and behaviour, and the WhatsApp handling.

## 2. Hindi heading `WE ENGINEER` / `THE COMPLETE PROCESS.`

- **Where it appears:** the same two-line H2 on every machine page and the Engineering page. These two keys are not used anywhere else.
- **Change:** "हम अभिकल्पित करते हैं / संपूर्ण प्रक्रिया।" (ungrammatical) → "हम पूरी प्रक्रिया की / इंजीनियरिंग करते हैं।" ("We engineer the complete process.")
- **Word order:** Hindi needs a different word order, so each line now holds part of the full sentence. If either key is ever used on its own, it will need its own translation.
- **Wrapping:** checked at 1440×900 and 390×844. The heading stays two lines, with no CSS change.

## 3. "HOT-AIR DRYING" wording: assessment only, nothing changed

| Source | Text | Where it shows | Assessment | Smallest proposed replacement |
|---|---|---|---|---|
| `src/data/process.ts` (dryer stage, labels) | HOT-AIR DRYING; Hindi "गर्म हवा से सुखाना", Arabic "التجفيف بالهواء الساखن" | Home page process journey (EN/HI/AR) | Equipment-specific: it labels the company's dryer stage with a heating method that is not verified | "THERMAL DRYING" (Hindi "थर्मल ड्राइंग", Arabic "التجفيف الحراري") |
| `src/data/process.ts` (dryer stage, purpose) | "Reduces remaining moisture through controlled drying." | Machine pages' plant sequence, Engineering page | Neutral, but "controlled" implies process control that is not confirmed | "Reduces remaining moisture by thermal drying." |
| `src/i18n/plant-content/salt-refinery-plants.en.ts` (stage `drying`), plus its Hindi and Arabic JSON | "A dryer removes remaining moisture using heat and airflow, while a cyclone and other air-handling equipment deal with the air leaving it." | Complete Salt Refinery Plants, Drying stage | Reads as a general principle, but "airflow" assumes a convective dryer | "A dryer removes remaining moisture with heat; any moisture-laden air or vapour it releases is handled by connected equipment such as a cyclone." |

These are kept separate from the Dryer release, pending your approval.

## 4. Files in the isolated Dryer release

The worktree `/tmp/claude-1001/-home-yash-personal-Sk-Engineering-Works/a6a50e69-758c-44c4-a337-4ffe4af389aa/scratchpad/dryer/release` was created from `be4fa08`:
- `src/data/machinery-details/dryer.ts`
- `src/i18n/machinery-content/dryer.hi.json` and `dryer.ar.json` (new)
- `src/i18n/machinery-content/index.ts`: only the 2 Dryer import lines and 1 registration line
- `src/i18n/dictionaries/hi.json` and `ar.json`: 20 new Dryer labels, the Dryer section-title fix, and the two corrections above (45 lines added, 5 changed per pair)
- `qa/tools/machinery_page_probe.mjs`: the machine name now comes from the page, mobile is 390×844, and arrival can come through a stage link
- `qa/reports/dryer-content/`

## 5. Cyclone separation

- **Isolated release:** the diff contains no Cyclone data, translations, registration lines or reports. The only "cyclone" words are inside the Dryer's own copy, which mentions cyclone equipment.
- **Main tree:** unchanged on `main`. `cyclone.ts` (+74/−8), `cyclone.{hi,ar}.json`, the Cyclone dictionary lines and registration, `qa/reports/cyclone-content/` and `qa/reports/machinery-catalog-audit/` are all present. No reset, stash, checkout or staging was used.

## 6. Validation (isolated worktree)

| Check | Result |
|---|---|
| ESLint | Pass, exit code 0 |
| TypeScript | Pass, after the build had generated Next's route types |
| i18n validation | 2293 shared + 229 build-time entries |
| Build | Pass |
| Export validation | 117 pages, 0 failures (`export-validation.txt`) |
| `git diff --check` | Clean |
| Dryer probe, EN/HI/AR at 1440×900 and 390×844 | **111 of 111** |
| Belt Conveyor re-check | 0 failures |

The probe covers content, lang and dir, headings, canonical and hreflang, Product and Breadcrumb JSON-LD, 15 localized links returning 200, 8 accordions, the enquiry form and WhatsApp draft ("Machine: Dryer", not sent), the hover cue, client-side navigation and language switching, no horizontal overflow and no JavaScript errors.

**Exported pages against `be4fa08`:** 43 of 120 changed.
- The 3 Dryer pages.
- 40 Hindi and Arabic machine and Engineering pages, where the only text change is the two corrections above (20 pages each). They keep the same structure and media.
- English pages other than the Dryer are unchanged.

## 7. Visual and functional differences

- **Dryer page:** the same sections and media. It gains 2 component rows, 1 step, 2 configuration accordions and 15 links.
- **Elsewhere:** only the corrected Hindi and Arabic wording.
- **Unchanged:** CSS, animation, media and enquiry code. Testing was in headless Chrome only.

## 8. Engineering verification still required

See `engineering-verification-checklist.md`: the dryer type, heat source and method, internal construction, airflow, operation, controls, specifications, scope, installations and the provenance of the site footage.

## 9. Recommendation

The isolated Dryer release is ready to commit after your review. Commit it from this worktree's diff, or apply the same hunks with `git add -p` in the main tree, so the Cyclone work stays separate. Apply the hot-air wording changes only after approval, in a separate commit.
