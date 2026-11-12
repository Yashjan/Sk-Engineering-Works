# Dryer page: initial audit

**Who this is for:** whoever reviews the Dryer content change.
**Baseline audited:** `be4fa08` (equal to `origin/main`). Route: `/machinery/dryer`, `/hi/machinery/dryer`, `/ar/machinery/dryer`. Data: `src/data/machinery-details/dryer.ts`.

## Before this change

| Area | Finding |
|---|---|
| Template | Shared `createMachine` template: 4 components, 3 steps, 6 generic configuration items ("Selected according to the material and application") |
| Copy | Two sentences, repeated in the overview, identity and process sections |
| Heating claim | "Controlled airflow and heat remove remaining moisture"; the plant process data labels the stage "HOT-AIR DRYING". Neither the heat source nor the airflow arrangement is verified. |
| SEO | Generic title "Dryer for Salt & Industrial Processing"; templated description; no Product or Breadcrumb JSON-LD |
| Hero alt | "S.K. Engineering Works dryer" on an illustrative render, which implies a photographed company machine |
| Localization | Short shared-dictionary strings only; no build-time copy; Arabic section title "جهز المنتج للمناولة في المجرى السفلي" ("downstream" in the sense of a river) |
| Links | Process-stage names not linked; no related-equipment link |
| Enquiry | Generic heading "DRYER REQUIREMENT"; no guidance on what to share |
| Media | No real media on the page; the fabrication section shows the "not yet available" note |

## Equipment-type evidence

| Media | Classification | What it shows |
|---|---|---|
| `public/images/machinery/catalog/dryer.webp` | Illustrative render (CGI, logo applied) | Elongated rib-reinforced rectangular enclosure; conical duct connection on top; bolted box at the top of one end; hinged inspection doors and flanged ports; lower section with four bolted circular covers; support legs |
| `public/videos/salt-refinery/dryer.mp4` (4.8 s, used on the Complete Salt Refinery Plants page, not on the Dryer page) | Site installation footage, plant not identified | An installed unit of the same external form on concrete plinths, with a feed hopper at one end, a vertical duct from the top, side openings, a lower section with circular openings, and an access platform and stair |
| `public/images/common/field-media/fabricated-equipment.webp` (plants page, "HEAVY EQUIPMENT / WORKSHOP") | Workshop photograph, equipment unidentified | A large rectangular unit with circular openings, possibly the same type. Not attributed to the Dryer, because that is unconfirmed. |

**Conclusion:** the evidence establishes the external arrangement only. It does not show the internal construction (drum, bed, trays, agitation), the heat source, direct or indirect heating, the airflow direction, batch or continuous operation, controls or performance. The external form is consistent with more than one dryer type, so **no dryer type is named on the page**.

## Other findings, not changed (outside this page)

- `src/data/process.ts` labels the dryer stage "HOT-AIR DRYING", with the purpose "through controlled drying", and its image alt "S.K. Engineering Works salt dryer" sits on the render. These are shared with the plants, engineering and machinery pages.
- The Complete Salt Refinery Plants drying copy says "using heat and airflow". That is an airflow-based assumption.
- Shared translations shown on this page: Arabic `PREPARE ENQUIRY` reads "أستعدوا للتحقيق" (roughly "get ready for an investigation"), and the Hindi plant-section heading "हम अभिकल्पित करते हैं संपूर्ण प्रक्रिया" is ungrammatical.
