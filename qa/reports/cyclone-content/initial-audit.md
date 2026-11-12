# Cyclone initial audit

Date: 2026-11-11
Baseline: `be4fa08730b09b499185a57cba32fa7ecdf8bf16`

## Existing implementation

- Verified route: `/machinery/cyclone/`, with statically exported Hindi and Arabic equivalents.
- The route used the shared 11-section machinery-detail template and a seven-line `createMachine` data record.
- Public content consisted of a short overview, four generic component descriptions, three generic process steps, shared configuration and engineering copy, and generic enquiry guidance.
- Metadata used the generic machinery template. Product and Breadcrumb structured data were not enabled.
- Long Hindi and Arabic Cyclone copy lived in the shared client dictionaries; there was no Cyclone entry in the build-time machinery-content registry.
- The page used the existing catalog render and `plant-structure.webp`; no page-specific CSS, animation or interaction implementation exists.

## Evidence reviewed

1. `public/images/machinery/catalog/cyclone.webp` is an illustrative isolated image showing inlet/outlet ducting, a cylindrical body, conical section, lower discharge region and support frame. It does not prove internal geometry, materials, dimensions, discharge isolation or performance.
2. `public/images/common/field-media/plant-structure.webp` is a real site photograph showing several conical process vessels within a steel structure. Repository records do not independently identify the site, customer, equipment duty or whether the upper vessel is the Cyclone represented on this detail page.
3. `public/images/projects/equipment/cyclone/fabrication.mp4` and `completed-machine.mp4` are repository-associated Cyclone project records. Their labels support treating them as internally associated records, but do not establish customer, capacity, material, performance or commissioning details.
4. `public/images/projects/archive-stills/cyclone-field.webp` depicts a large circular fabricated housing in a workshop. Its exact relation to the illustrated Cyclone is uncertain.
5. `src/data/projects.ts` associates the two videos and catalog image with a Cyclone equipment record but provides no location, capacity or customer evidence.

## Equipment-type assessment

The catalog render externally resembles a conventional gas-solid cyclone separator. It supports a conservative explanation of the general cyclone principle: particle-laden gas enters, rotational flow develops, suitable particles move toward the outer wall and collection region, and remaining gas exits through an outlet arrangement.

The evidence does not verify inlet geometry, internal outlet or vortex-finder design, cone proportions, wall construction, liner, rotary airlock, multiple stages, pressure loss, cut size, collection efficiency, operating conditions or materials. The page therefore describes those details as engineering inputs rather than product specifications.

## Risks corrected

- Replaced the unverified `INSTALLED CYCLONE EQUIPMENT` image attribution with a neutral site-record description.
- Removed wording that implied salt and dust separation as a universal confirmed duty.
- Added an explicit distinction between a cyclone and bag filter and avoided complete-removal claims.
- Made salt-refinery and air-handling applications conditional on process design.
- Added conservative Product and Breadcrumb structured data without offers, ratings, specifications or manufacturer claims.
- Added build-time Hindi and Arabic long-copy files so technical content is generated in localized HTML rather than shipped in shared client JavaScript.

## Information withheld pending confirmation

Actual cyclone type, intended duties, geometry, airflow, pressure loss, particle data, temperature, materials, wall thickness, wear protection, discharge device, separation performance, standards, scope of supply and verified installations remain unpublished. See `engineering-verification-checklist.md`.
