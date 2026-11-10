# Complete Salt Refinery Plants page: content audit

**Who this is for:** whoever reviews the content changes on `/salt-refinery-plants` (EN, `/hi/`, `/ar/`).
**State audited:** commit `c06c005`, before this change.

## 1. Page sections

| # | Section | Component | What it shows |
|---|---|---|---|
| 01 | Hero | `SaltRefineryHero` | Eyebrow, H1 "From raw salt to finished product.", one supporting sentence, hero video labelled "Real project execution", 4-item scope list, 9-stage process rail |
| 02 | Process | `RawSaltProcessStage` | 9 stages. Desktop: hover a stage to see its video and copy. Mobile: tap to open. |
| 03 | Complete execution | `CompleteExecutionSection` | 6 execution stages, 4 photographs, the plant elevation drawing (with zoom lightbox), closing statement |
| 04 | Plant configuration | `PlantConfigurationSection` | 6 configuration factors in an accordion, with two statements |
| 05 | Machinery | `MachineryShowcaseSection` | 12 machines, selected with buttons; "View all machinery" link |
| — | Trusted by | `TrustedClientsSection` (shared) | Client names and logos |
| — | Enquiry | `ProjectEnquirySection` (shared) | Telephone and WhatsApp actions, "10 + factories built", address, footer links |

## 2. Existing technical content

- **Stage copy:** each process stage, execution stage and configuration factor had one sentence.
- **Drawing:** an actual 2D plant side elevation, with a high-resolution view.
- **Photographs:** plant structure, a fabricated blower and fabricated equipment.

## 3. Missing or weak information

- **Hidden stage copy:** only stage 1's description is in the generated HTML. Stages 2 to 9 appear after hover or tap. This is still true; see "Proposed, not implemented".
- **Fixed sequence:** "From raw salt intake to final packing, each stage is connected to the next" presented one fixed sequence as how every refinery works.
- **Planning factors:** layout planning did not mention maintenance access, structure or future expansion.
- **Machinery links:** no contextual links to machinery pages, Engineering or Projects; machine names were buttons, not links.
- **Enquiry guidance:** the enquiry text did not say what information helps a plant enquiry.
- **Labels:** "MATERIAL HANDLING & ALL" and "SCREW WASHERY" are not standard terms.
- **Translations:** about 70 Hindi and Arabic labels on this page were machine translations with wrong meanings. Examples:
    - Hindi "हेलिकॉप्टर" (helicopter) for hopper, and "धोखा" (fraud) for washing.
    - Arabic "سرية" (secret) for classified, "صور إعدام" (execution, in the sense of the death penalty) for execution photographs, "زلاجة" (sledge) for an image description, and "إعادة التوطين" (resettlement) for reset.

## 4. Repeated marketing copy

- **"Complete salt refinery execution":** this or close variants appeared four times.
- **"One connected engineering system":** "connected" phrasing repeated across sections.
- **Closing statements:** "PLANNED HERE. BUILT HERE. INSTALLED ON SITE." and "CONFIGURED FOR THE PLANT, NOT PICKED FROM A CATALOG." are short statements, kept as they are.

## 5. Unverified business claims

| Claim | Status |
|---|---|
| "READY-TO-RUN REFINERY" (implies commissioning and handover) | Removed; now "Connected plant line" |
| "Controlled hot-air processing" (drying technology) | Removed |
| "Large stainless-steel … equipment" (material) | Removed from the image description |
| Belt conveyor carries salt "toward the crushing stage" (the Belt Conveyor page describes the wet mill) | Reworded to "the first processing stage" |
| "WE BUILD SALT REFINERIES FROM SCRATCH." | Kept: a heading, and part of the agreed positioning; on the checklist |
| "10 + factories built from scratch", "Rajasthan + Gujarat" | Kept: shared section; no project record supports the count; on the checklist |
| "Trusted by" client names and logos | Kept: shared section; permissions unconfirmed; on the checklist |
| "Real project execution" (hero video) | Kept; on the checklist |
| "Packing system" stage | Kept; packing machines are not in the catalog; on the checklist |

## 6. SEO opportunities found

- **Title:** "Salt Refinery Plants & Machinery" did not match the primary topic, complete salt refinery plants.
- **Description:** the meta description was a list of process verbs, with no mention of the company or its location.
- **Breadcrumbs:** the Hindi and Arabic pages had English breadcrumb JSON-LD pointing to the English URLs.
- **Structured data:** none described the offering.
- **H1:** "From raw salt to finished product." does not name the topic. It was kept, as instructed; the eyebrow now says "Complete salt refinery plants".

## 7. Internal-linking opportunities

- Machinery range, from the process introduction
- Engineering, from layout planning
- Machinery pages (wet mill, screw washer, centrifuge, belt conveyor, screw conveyor), from machinery fabrication
- Projects, from the final execution stage
- About and Contact are already in the enquiry section's footer links

## 8. Enquiry-content opportunities

The enquiry section now lists what to share: capacity, raw salt source, finished salt, new plant or expansion, location, site area, existing machinery and timeline. The form, telephone and WhatsApp actions are unchanged.

## Proposed, not implemented (each changes the visual structure)

1. **Static process reference:** a section that shows all nine stage descriptions without interaction, so they are in the generated HTML. Today only stage 1 is.
2. **Machine names as links:** make the machinery showcase's current machine name, or each machine, a link to its page.
3. **H1 wording:** include "Complete salt refinery plants" in the H1, if you want the heading to carry the topic.
4. **Jagdamba project link:** link the Jagdamba project as supporting evidence once engineering confirms its record.
