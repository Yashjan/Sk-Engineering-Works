# Portable Belt Conveyor — initial content and evidence audit

## Baseline

- Repository baseline: `a82434195c4adeef9d8e39f0a7e13629ab49a203`
- Route: `/machinery/portable-belt-conveyor/`
- Existing architecture: the shared 11-section machinery-detail template
- Existing source: `src/data/machinery-details/portable-belt-conveyor.ts`

## Existing content findings

The original detail record contained one short overview, three generic components and three generic operating steps. It did not explain the distinction between a fixed and relocatable conveyor, the belt return path, equipment selection, installation, relocation, maintenance, process integration or buyer enquiry inputs. Its metadata came from the generic machine factory and had no dedicated Hindi or Arabic build-time copy.

The catalog record in `src/data/machinery.ts` incorrectly described the Portable Belt Conveyor image as a “material receiving hopper.” This alt text reached the machinery listing because the portable conveyor has no matching main process-stage override.

## Media and portability evidence

| Asset | Classification | What it supports | What it does not support |
| --- | --- | --- | --- |
| `public/images/machinery/catalog/portable-belt-conveyor.webp` | Illustrative catalog image | Inclined belt conveyor form, visible belt, steel structure, drive-area equipment and a wheel-supported lower chassis | Supplied-machine provenance, exact component specification, mobility method, capacity or performance |
| `public/images/projects/equipment/portable-belt-conveyor/equipment-view.webp` | Catalog-style composite equipment view | Same external arrangement as the catalog illustration | Independent workshop/site evidence or a customer installation |
| `public/images/projects/equipment/portable-belt-conveyor/fabrication.mp4` | Repository-associated workshop record | Steel-frame fabrication activity associated with this archive record | By itself, the final conveyor identity, dimensions, materials or performance |
| `public/images/projects/equipment/portable-belt-conveyor/completed-machine.mp4` | Workshop completed-equipment record | An inclined belt conveyor on a lower chassis with four visible wheels, an inclined support structure and visible drive-area equipment | Steering, brakes, towing, hydraulic adjustment, powered travel, public-road use, belt grade, ratings, capacity or permissible inclination |

The completed-equipment video is sufficient for conservative “wheel-supported chassis” wording. It is not sufficient for “towable,” “hydraulic,” “height-adjustable,” “self-propelled,” “road-mobile” or one-person-relocation claims.

## Technical and claims risks found

- “Mobile support frame” was asserted without explaining the visible evidence or the limits of that evidence.
- “Mobile material transfer” could be read as powered mobility; the original page did not distinguish relocatable equipment from self-propelled equipment.
- The shared default configuration copy did not address material condition, inclination, stability, relocation method, site power, dust, wear, corrosion, safety or maintenance.
- No capacity, motor rating, belt speed, dimensions or guarantees were published. This conservative position must be retained.
- Repository association does not independently establish customer, project, installation or commissioning provenance.

## SEO and localization opportunities

- Replace the generic title and description with dedicated portable-conveyor search intent.
- Add conservative Product and Breadcrumb structured data through the existing utilities.
- Add dedicated Hindi and Arabic build-time content so long technical copy is emitted in static HTML and does not enter the shared client translation payload.
- Preserve localized links to the fixed Belt Conveyor, related process machinery and Complete Salt Refinery Plants pages.
- Correct the hopper-related catalog alt text.

## Implementation boundary

The update should remain inside the existing data, localization and QA architecture. No CSS, component layout, animation, media file, form, navigation or interaction change is required.
