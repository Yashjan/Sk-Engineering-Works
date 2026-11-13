# Bag Filter initial audit

Date: 2026-11-13

Baseline: `f96d60d17413d335117ee7177f1b4325bb6a26b4`

Route: `/machinery/bag-filter/` with Hindi and Arabic localized routes.

## Existing implementation

The page used the shared `createMachine` factory with one paragraph, four generic component labels and three short operating steps. It had generic metadata, no Product structured data, no dedicated build-time translations, no contextual equipment links and no buyer-specific enquiry guidance. The existing Arabic dictionary translated `Bag Filter` as `مقطورة باغ`, wording that denotes a trailer rather than industrial filtration equipment.

## Evidence reviewed

- `public/images/machinery/catalog/bag-filter.webp` is an illustrative cutout. Externally it shows a large enclosed body, access platform and ladder, circular duct openings, a lower hopper-like section and support frame. External fittings appear along the upper body, but the image does not prove their function.
- `public/images/projects/equipment/bag-filter/fabrication.mp4` is repository-associated workshop footage. Its filename and project record associate it with Bag Filter fabrication, but they do not independently prove subtype, internal construction, customer, installation, materials or performance.
- `public/images/projects/archive-stills/bag-filter-field.webp` is an archive still and is not used as evidence on the detail page because its equipment identity and site provenance are not documented.

## Defensible classification

The public content can safely use `industrial bag filter`, `fabric filtration` and `industrial bag-filtration equipment` as general equipment terminology. The available evidence does not establish pulse-jet, reverse-air or mechanical-shaker cleaning; inside-to-outside or outside-to-inside flow; bags, cages or media specification; automatic differential-pressure control; rotary-airlock or screw discharge; capacity, airflow, pressure loss, efficiency, emissions or service temperature.

## Risks corrected

- Removed the incorrect Arabic trailer terminology and standardized the equipment name as `مرشح الأكياس الصناعي`.
- Replaced generic operating and configuration copy with conservative fabric-filtration principles and engineering selection inputs.
- Described the catalog asset as illustrative and the video as an associated workshop record.
- Avoided customer, completed-installation, cleaning-method, performance, regulatory-compliance and material claims.
- Added localized metadata, Product/Breadcrumb support and language-preserving contextual links through the existing page architecture.

## Scope boundary

No CSS, layout, animation, media, form, navigation or interaction implementation is changed. Company-specific construction and performance details remain withheld pending the engineering checklist.
