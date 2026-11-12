# Dryer page: validation summary

**Who this is for:** whoever reviews the Dryer change before commit.
**Compared against:** `be4fa08` (equal to `origin/main`), built from source in a separate worktree. The working tree also contains uncommitted Cyclone work, so the "after" build includes it.

## Gates

| Check | Result |
|---|---|
| ESLint | Pass, 0 errors and 0 warnings |
| TypeScript | Pass |
| i18n validation | Pass; 2304 shared entries, plus 258 build-time entries (27 of them Dryer) |
| Production build | Pass, 124 routes |
| Static export validation | 117 pages, 0 failures |
| `git diff --check` | Clean |

## Exported pages

- **Changed pages:** 6 of 120: the 3 Dryer pages, and the 3 Cyclone pages, which come from the uncommitted Cyclone work.
- **Dryer pages:** the same 11 sections, the same H2s and the same media. Added: 2 component rows, 1 step, 2 configuration accordions, 14 process-stage links and the ID Fan / Blower link.
- **Claims scan:** the Dryer HTML contains no "rotary", "drum dryer", "fluid bed", "flash dryer", "burner", "furnace", "hot-air", °C, TPH or % values, "manufacturer", "stainless", warranty or guarantee, in any language. (`100%` appears only in SVG attributes.)

## Browser probe

`machinery_page_probe.mjs dryer`, EN/HI/AR at 1440×900 and 390×844: **111 of 111**. It covers:
- lang and dir, one H1 and heading order, no horizontal overflow, alt text;
- canonical and hreflang, Product JSON-LD with no offers or manufacturer, and a 3-level breadcrumb;
- 14 of 15 stages linked, all 15 internal links keeping the language prefix and returning 200;
- 8 accordions opening;
- the enquiry form: validation, then a WhatsApp draft naming "Dryer" (not sent);
- the hover and focus cue with no geometry change;
- client-side navigation and language switching;
- no JavaScript errors.

Belt Conveyor re-probed after the tool change: 0 failures.

## Performance

Lighthouse, simulated mobile, 2 runs each:

| Page | `be4fa08` | This build |
|---|---|---|
| EN | 92, 96 (LCP 3.1, 2.6 s) | 95, 95 (LCP 2.7, 2.7 s) |
| HI | 90, 89 (LCP 3.3, 3.3 s) | 89, 88 (LCP 3.5, 3.5 s) |
| AR | 90, 84 (LCP 3.2, 3.8 s) | 87, 86 (LCP 3.4, 3.7 s) |

Accessibility, best practices and SEO are 100 in every run, and CLS is 0. The differences are within run-to-run variation.

JavaScript required, gzipped:

| Page | `be4fa08` | This build |
|---|---|---|
| EN Dryer | 216.4 KB | 216.3 KB |
| HI and AR Dryer | 371.8 KB | 372.6 KB |
| Any HI or AR page | — | +0.8 KB, from 20 new short Dryer labels plus the Cyclone dictionary edits |

- **Long copy:** no long Dryer copy appears in any JavaScript file.
- **HTML size (gzipped):** EN 10.4 → 14.7 KB, HI 12.7 → 18.1 KB, AR 12.4 → 17.2 KB, because the build-time copy ships as HTML.

## Not run

- Full-site behaviour snapshot and Lighthouse on other pages: no animation, CSS or media file changed.
- Real devices: testing was in headless Chrome only.
