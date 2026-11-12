# Machinery content and SEO audit

## Shared-template limitations

The fifteen partial pages differ mainly in a short description, component labels and three operating steps. Everything below is reused:

- SEO: `"[Machine] for Salt & Industrial Processing"` plus the same generic integration sentence (`src/data/machinery-details/create-machine.ts:18`).
- Configuration: the same six rows for dimensions, capacity, construction material, connections, installation and plant integration (`create-machine.ts:23-30`).
- Engineering: the same one-sentence claim and four capabilities (`create-machine.ts:32-33`).
- Enquiry: only the machine name changes (`create-machine.ts:34`).
- The visual template states “ENGINEERED / FABRICATED / INTEGRATED” for every machine (`src/components/machinery/detail/MachineryDetailPage.tsx:26-29`) and titles section 08 “REAL MACHINE. REAL FABRICATION.” (`src/components/machinery/detail/MachinerySections.tsx:12-13`). When no media exists, the note is conservative; where media exists, provenance still needs business confirmation.

This creates usable navigation, but not a complete technical page. Installation, maintenance, safety, operating limits, mechanism variants and machine-specific buyer inputs are absent from every partial page.

## Equipment-specific weaknesses

| Machine | Exact weakness and source |
|---|---|
| Bucket Elevator | The page asserts “buckets carry material vertically” but does not establish belt vs chain, casing arrangement, take-up, speed monitoring, backstop, access or cleaning (`src/data/machinery-details/bucket-elevator.ts:3-6`). |
| Portable Belt Conveyor | “Mobile support frame” is the only portability detail; wheel/axle arrangement, incline adjustment, towing/manual movement and stabilization are not established (`portable-belt-conveyor.ts:3-6`). |
| Hopper | No feeder, gate, wall angle, anti-bridging feature or usable capacity is identified (`hopper.ts:3-6`). |
| Pin Mill | “Rotating elements” is too vague to prove a pin-disc mechanism, single/double rotation, cooling or classification arrangement (`pin-mill.ts:3-6`). “Required powder size” in process data is outcome-oriented without a verified cut (`src/data/process.ts:124-131`). |
| Hammer Mill / Crusher | The combined name and generic “crushing mechanism” do not establish whether the supplied machine is a hammer mill or another crusher (`hammer-mill-crusher.ts:3-6`). |
| ID Fan / Blower | The page calls the unit an ID fan and says it moves dryer/process air, but does not establish fan type, impeller, duty point, drive or whether the pictured unit corresponds to that exact duty (`id-fan-blower.ts:3-7`). |
| Bag Filter | Housing, elements and “filtration stage” are named, but filter media, cleaning system, hopper/discharge and design airflow are absent (`bag-filter.ts:3-6`). |
| Cyclone | The operating description is directionally sound, but inlet geometry, pressure-drop/duty basis, discharge isolation and downstream fan/filter relationship are missing (`cyclone.ts:3-7`). The installed-photo attribution at line 5 is stronger than the photo provenance currently documented in code. |
| Chimney | No detail config exists. The catalog/project links reach a placeholder (`src/data/machinery.ts:155-165`; `src/data/machinery-details/index.ts:22-44`; route fallback at `src/app/(english)/machinery/[slug]/page.tsx:73-82`). |
| Vibro Screen | No screen decks, mesh/media, eccentric drive, isolation mounts, cut targets or throughput inputs are described (`vibro-screen.ts:3-6`). |
| Storage Silos | No storage duty, geometry, flow aids, venting, level indication or discharge device is established (`storage-silos.ts:3-6`). |
| Process Tanks | Catalog says “Process Tanks / Washing Tanks,” detail name is singular “Process Tank,” while the page specifically describes holding/settling (`src/data/machinery.ts:188-195`; `process-tanks.ts:3-6`). One route currently combines potentially different equipment duties. |
| Thickener | The content says heavier solids settle but does not establish a rake, feed well, overflow, underflow control or whether the shown design is a conventional thickener (`thickener.ts:3-6`). |
| Dryer | “Controlled airflow and heat” is safe but incomplete; dryer type, heat source, flow arrangement, residence control, exhaust treatment and safety inputs are absent (`dryer.ts:3-6`). |
| Roller Crusher | The copy states rotating rollers and size reduction, but roll profile, gap adjustment, drive, overload protection and verified feed/product range are absent (`roller-crusher.ts:3-6`). |
| Lump Crusher | The code intentionally says only “crushing mechanism”; actual rotor/teeth/shaft arrangement and application boundary remain unknown (`lump-crusher.ts:7-19`). |

## SEO findings

### What works

- Every partial page has a distinct H1 (the machine name), a stable canonical and language alternates.
- Indexable pages are included in the sitemap in all three languages.
- The shared heading hierarchy is coherent, and every page links to the Complete Salt Refinery Plants page.
- Localized route capture preserves the chosen language (`src/components/i18n/LocaleRuntime.tsx:29-46`).

### What is weak

1. **Generic search intent:** all partial English titles append “for Salt & Industrial Processing,” even for air-system or storage equipment where a narrower verified intent would be more useful (`create-machine.ts:18`).
2. **Generic translated metadata:** unfinished pages do not use machine-specific localized SEO. They receive the same Hindi/Arabic formula with an often-English machine name (`src/app/[locale]/[...segments]/page.tsx:53-70`).
3. **No page-specific structured data:** this is preferable to fabricated Product data, but it also signals that the pages have not reached the completed-page standard. Product schema should be added only after visible content and category wording are verified.
4. **Limited internal linking:** generic partial configs do not set `process.linkStages` or related machinery links. Their process diagram names the other machines but does not link them (`src/components/machinery/detail/MachineryPlantSections.tsx:12-17`).
5. **Chimney dead-end:** catalog and project records offer a detail link, but users receive a placeholder and search engines receive `noindex`. It is correctly absent from the sitemap, but the link promise is misleading.
6. **Incorrect alt text:** Portable Belt Conveyor is labelled as a “material receiving hopper” in the catalog source (`src/data/machinery.ts:54-65`). Process-stage overrides currently replace it only where a matching stage exists; Portable Belt has none, so the wrong alt reaches the listing.
7. **Evidence-heavy records are not surfaced:** the ID Fan, Portable Belt, Cyclone, Bag Filter and Chimney project videos exist, but most corresponding detail pages expose only one image or the no-photo state rather than neutral links to those records.

Search-demand and buyer-intent assessments in this audit are **qualitative**, not measured keyword volume.

## Localization findings

- Dedicated build-time machine dictionaries exist only for the five completed pages (`src/i18n/machinery-content/index.ts:4-25`). All remaining technical sentences live in the general Hindi and Arabic dictionaries, which are supplied to the client runtime (`src/components/i18n/LocaleRuntime.tsx:11-26`). This does not follow the preferred long-copy split.
- Arabic RTL is enabled centrally (`src/app/[locale]/layout.tsx:29-39`), so the architectural direction support exists.
- Translation presence is not translation quality. Examples requiring native technical review:
  - Arabic `Bag Filter` → `مقطورة باغ`, literally a “bag trailer” (`src/i18n/dictionaries/ar.json:164`).
  - Arabic `Storage Silos` → `تخزين الحروق`, containing “burns” rather than silos (`ar.json:1528`).
  - Arabic Thickener body copy uses wording equivalent to “thickness” (`ar.json:1614`).
  - Arabic Vibro Screen copy is grammatically/technically corrupted (`ar.json:1615`).
  - Hindi Thickener copy begins with “मोटाई” (“thickness”) rather than the equipment term (`src/i18n/dictionaries/hi.json:1614`).
  - Hindi Vibro Screen is a literal, broken sentence (`hi.json:1615`).
- Machine names are inconsistently translated vs transliterated. That can be valid in industry usage, but terminology must be reviewed by Hindi- and Arabic-speaking technical readers before publication claims of linguistic correctness.

## Factual and claims risks

- No numeric capacities, motor powers, materials or guarantees were found in the partial detail data. This is appropriately conservative.
- The stronger risk is **attribution**, not specifications: catalog alt text and project captions repeatedly state that units were fabricated by S.K. Engineering Works. The repository association is useful, but company records must confirm machine identity and permission before those phrases are treated as independent proof.
- The process sequence presents one specific refinery arrangement as a common shared diagram. Equipment pages should describe it as one possible integration unless the supplied plant architecture is fixed.
- The generic enquiry captures capacity, material and requirement, but not machine-specific inputs such as airflow/static pressure, feed moisture, particle distribution, screen cuts, storage time, heat source or site constraints (`src/components/machinery/detail/MachineryEnquiry.tsx:21-38`).

## Urgent defects for later correction

1. Chimney detail link leads to a placeholder in EN/HI/AR.
2. Portable Belt Conveyor catalog alt text says “hopper.”
3. Arabic Bag Filter and Storage Silos names are wrong.
4. Hindi/Arabic Thickener and Vibro Screen descriptions are not publication-quality technical translations.
5. Cyclone installed-photo attribution should be checked against the actual image record.

No defect was fixed during this audit.
