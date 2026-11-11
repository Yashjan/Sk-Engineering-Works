# ID Fan / Blower initial audit

Date: 2026-11-11
Baseline: `11431986f2fe5965d575695811208f6eb1d09fd6`

## Existing implementation

- Route: `/machinery/id-fan-blower/`, with static Hindi and Arabic equivalents.
- Layout: existing shared 11-section machinery-detail page; no specialized interactive adapter.
- Baseline data: seven lines generated through `createMachine`, with four generic component descriptions, three generic steps, shared configuration/engineering copy and generic enquiry guidance.
- Baseline SEO: `ID Fan / Blower for Salt & Industrial Processing` with the generic shared description. Product and Breadcrumb structured data were absent.
- Baseline localization: long copy lived in the general client dictionaries. No ID Fan / Blower entry existed in the build-time machinery-content registry.

## Evidence reviewed

1. `public/images/machinery/catalog/id-fan-blower.webp` is an illustrative isolated image. It visibly shows a circular inlet, exposed rotating wheel, scroll-shaped housing, rectangular outlet and steel base frame.
2. `public/images/common/field-media/fabrication-blower.webp` is a workshop photograph showing the same externally observable form. It does not show a motor or complete drive train clearly enough to classify the drive.
3. `public/images/projects/equipment/id-fan-blower/fabrication.mp4` and `completed-machine.mp4` are repository-associated project records. Their filenames and project data associate them with ID Fan / Blower, but the repository does not provide customer, duty, airflow, pressure, speed, motor or material records.
4. The project record at `src/data/projects.ts:124-138` does not identify a customer, location, capacity or process duty.

## Equipment classification

The visible circular inlet, wheel and scroll-shaped casing support describing the pictured form as a **centrifugal fan or blower** at the external level. The evidence does not prove that the pictured unit operated as an induced-draft fan, nor does it establish blade profile, shaft/bearing design, drive arrangement, airflow, pressure, speed, temperature capability, dust duty or construction materials.

The catalog name `ID Fan / Blower` is retained. Public copy distinguishes induced-draft extraction from supply-air duty and makes the actual duty a system-selection question.

## Safe improvements

- Explain industrial fan/blower function and the difference between extraction and supply duty without assigning either to every unit.
- Describe only the visible external form and general energy-transfer principle.
- Add system-level selection, installation and maintenance considerations as engineering inputs.
- Connect conditionally to Dryer, Cyclone, Bag Filter and complete plant engineering.
- Add buyer enquiry guidance without adding form fields.
- Add conservative Product and Breadcrumb structured data with no offers, ratings, specifications or performance values.
- Move long Hindi and Arabic copy to build-time machine dictionaries.

## Information withheld pending confirmation

Fan subtype and duty, impeller/blade geometry, drive and bearing arrangement, numerical airflow/static pressure, motor rating, speed, temperature, efficiency, materials, standards, guarantees and named project installations remain unpublished. See `engineering-verification-checklist.md`.
