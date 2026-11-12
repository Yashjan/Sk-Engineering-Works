# Machinery catalog inventory

Audit date: 2026-11-11
Baseline: `11431986f2fe5965d575695811208f6eb1d09fd6` on `main`
Scope: repository evidence only; no external search-volume data was used.

## Baseline and classification

The catalog contains **21 entries** in `src/data/machinery.ts:21-221`. Five have received dedicated technical, SEO and build-time localization work. Fifteen render through the generic `createMachine` factory and are therefore **partial**, even though their routes exist. `chimney` has a catalog route but no entry in `machineryDetails` (`src/data/machinery-details/index.ts:22-44`), so it is a **placeholder**.

| Status | Count | Machines |
|---|---:|---|
| Complete / previously improved | 5 | Belt Conveyor, Screw Conveyor, Screw Washer, Wet Mill, Centrifuge |
| Partial shared-template page | 15 | Bucket Elevator, Portable Belt Conveyor, Hopper, Pin Mill, Hammer Mill / Crusher, ID Fan / Blower, Bag Filter, Cyclone, Vibro Screen, Storage Silos, Process Tanks / Washing Tanks, Thickener, Dryer, Roller Crusher, Lump Crusher |
| Placeholder | 1 | Chimney |

Only Screw Conveyor uses the specialized full-page interactive adapter. The other completed pages retain the shared detail layout but have equipment-specific content, conservative structured data and dedicated Hindi/Arabic build-time copy. The fifteen partial pages all call `createMachine`; its six configuration rows, engineering statement, enquiry heading and SEO formula are reused verbatim (`src/data/machinery-details/create-machine.ts:12-35`).

## Remaining catalog inventory

Legend: **Dedicated i18n: no** means the page relies on the large shared dictionaries and JSX translation runtime; it does not have a machine-specific Hindi/Arabic build-time file in `src/i18n/machinery-content/index.ts:19-25`. All detail routes inherit canonical/hreflang support. “Render” means a catalog illustration and is not evidence of a delivered machine.

| Machine / route | Category | Page / template | EN, HI, AR coverage | Evidence and media | SEO / links / enquiry | Risk and recommended action |
|---|---|---|---|---|---|---|
| Bucket Elevator `/machinery/bucket-elevator` | Material Handling | Partial; shared | Short EN copy; shared-dictionary HI/AR; dedicated i18n: no | Catalog render only; also shown as process stage | Generic metadata; linked from plant process; generic enquiry | Operating arrangement, bucket/belt/chain type and safety details absent. **Improve after engineering verification.** |
| Portable Belt Conveyor `/machinery/portable-belt-conveyor` | Material Handling | Partial; shared | Short EN copy; shared-dictionary HI/AR; dedicated i18n: no | Repository-labelled fabrication and completed-machine videos plus equipment image (`src/data/projects.ts:158-172`) | Generic metadata; project record links to page; generic enquiry | Strong media record, but portability, running gear and incline limits are unverified. **High-readiness improvement.** |
| Hopper `/machinery/hopper` | Material Handling | Partial; shared | Short EN copy; shared-dictionary HI/AR; dedicated i18n: no | Catalog render only; process-stage illustration | Generic metadata; linked from plant process; generic enquiry | Feeding mechanism, live capacity, liner and blockage controls absent. **Improve after verification.** |
| Pin Mill `/machinery/pin-mill` | Milling & Size Reduction | Partial; shared | Short EN copy; weak literal HI/AR; dedicated i18n: no | Catalog render only; process-stage illustration | Generic metadata; linked from process sequence; generic enquiry | “Rotating elements” is non-specific; actual pin-disc arrangement and product duty need confirmation. **Verify before detailed publication.** |
| Hammer Mill / Crusher `/machinery/hammer-mill-crusher` | Milling & Size Reduction | Partial; shared | Short EN copy; shared-dictionary HI/AR; dedicated i18n: no | Catalog render only | Generic metadata; catalog link; generic enquiry | Combined name masks the actual supplied mechanism. **Defer until model/type is confirmed.** |
| ID Fan / Blower `/machinery/id-fan-blower` | Air + Dust Handling | Partial; shared | Short EN copy; shared-dictionary HI/AR; dedicated i18n: no | Workshop photo plus fabrication/completed videos (`src/data/machinery-details/id-fan-blower.ts:5`; `src/data/projects.ts:124-138`) | Generic metadata; plant process + project links; generic enquiry | Best remaining evidence set. Fan type, duty point and drive arrangement remain unverified. **Top priority.** |
| Bag Filter `/machinery/bag-filter` | Air + Dust Handling | Partial; shared | Short EN copy; incorrect Arabic machine name; dedicated i18n: no | Catalog render plus fabrication video only (`src/data/projects.ts:209-222`) | Generic metadata; project link; generic enquiry | Filter-element and cleaning mechanism unknown. Arabic label is a publication defect. **Correct translation later; verify design before expansion.** |
| Cyclone `/machinery/cyclone` | Air + Dust Handling | Partial; shared | Short EN copy; shared-dictionary HI/AR; dedicated i18n: no | Catalog render, repository-labelled fabrication/completed videos, and a plant-structure photo attributed as installed cyclone (`src/data/projects.ts:175-189`; `src/data/machinery-details/cyclone.ts:5`) | Generic metadata; plant process + project links; generic enquiry | Strong media, but the specific installed-photo attribution needs company confirmation. Inlet geometry and duty absent. **Top priority with provenance check.** |
| Chimney `/machinery/chimney` | Air + Dust Handling | Placeholder; simple shell | Name/category/placeholder only in all locales | Catalog render plus fabrication/completed videos (`src/data/projects.ts:225-239`) | `noindex`; not in sitemap; catalog and project links lead to placeholder; no enquiry form | Most urgent route usability gap. Stack purpose, system context and applicable design inputs require confirmation. **Create only after scope verification.** |
| Vibro Screen `/machinery/vibro-screen` | Screening & Separation | Partial; shared | Short EN copy; poor literal HI/AR; dedicated i18n: no | Catalog render only; process-stage illustration | Generic metadata; linked from plant process; generic enquiry | Deck count, motion system, screen media and product cuts absent. **Verify before improvement.** |
| Storage Silos `/machinery/storage-silos` | Storage & Process Equipment | Partial; shared | Short EN copy; Arabic machine name is incorrect; dedicated i18n: no | Catalog render only | Generic metadata; catalog link; generic enquiry | Storage duty, flow aids, vents and discharge equipment absent. **Correct translation later; verify equipment scope.** |
| Process Tanks / Washing Tanks `/machinery/process-tanks` | Storage & Process Equipment | Partial; shared | Detail page singular “Process Tank”; shared-dictionary HI/AR; dedicated i18n: no | Catalog render only; Royal Salt project broadly lists “Tanks” but does not prove this exact unit (`src/data/projects.ts:110-121`) | Generic metadata; linked from plant process; generic enquiry | Catalog/detail naming mismatch and washing-vs-settling ambiguity. **High plant relevance; verify exact functions first.** |
| Thickener `/machinery/thickener` | Storage & Process Equipment | Partial; shared | Short EN copy; mistranslated technical wording in HI/AR; dedicated i18n: no | Catalog render only; process-stage illustration | Generic metadata; linked from plant process; generic enquiry | Internal settling/rake/feed-well arrangement is unverified. **Improve only after mechanism confirmation.** |
| Dryer `/machinery/dryer` | Storage & Process Equipment | Partial; shared | Short EN copy; shared-dictionary HI/AR; dedicated i18n: no | Catalog render only; core process-stage illustration | Generic metadata; linked from plant process; generic enquiry | High commercial relevance, but dryer type, heat source, air path and controls are unknown. **Top priority after engineering verification.** |
| Roller Crusher `/machinery/roller-crusher` | Milling & Size Reduction | Partial; shared | Short EN copy; shared-dictionary HI/AR; dedicated i18n: no | Catalog render only; support process-stage illustration | Generic metadata; process/catalog link; generic enquiry | Roll geometry, adjustment and protection are absent. **Retain conservatively; verify before expansion.** |
| Lump Crusher `/machinery/lump-crusher` | Milling & Size Reduction | Partial; shared | Short EN copy; weak literal HI translation; dedicated i18n: no | Catalog render only | Generic metadata; catalog link; generic enquiry | Crushing mechanism is deliberately unspecified; page cannot credibly go deeper without records. **Defer pending mechanism evidence.** |

## Existing route and index behavior

- English and translated static params include every catalog slug (`src/app/(english)/machinery/[slug]/page.tsx:21-25`; `src/app/[locale]/[...segments]/page.tsx:24-36`).
- Partial pages are indexable because they have a `machineryDetails` entry. The placeholder is `noindex` (`src/app/(english)/machinery/[slug]/page.tsx:27-46`; localized equivalent at `src/app/[locale]/[...segments]/page.tsx:62-70`).
- The sitemap includes only `machineryDetails`, so all partial pages are included in all three locales while Chimney is excluded (`src/app/(english)/sitemap.ts:18-23`).
- Canonical and `en`/`hi`/`ar`/`x-default` alternates are produced centrally (`src/i18n/metadata.ts:11-16,35-43`).
- Product and Breadcrumb structured data are absent from all remaining partial pages because `createMachine` supplies no `structuredData`; the route emits these only when that field exists (`src/app/(english)/machinery/[slug]/page.tsx:53-72`).

## Media evidence caution

The project records are useful internal evidence that media files were intentionally associated with ID Fan / Blower, Portable Belt Conveyor, Cyclone, Bag Filter and Chimney. They do not independently prove customer, capacity, construction material, performance or commissioning. Catalog WebP files should remain classified as illustrative images until their source and relationship to supplied equipment are confirmed.
