import { createMachine } from "./create-machine";
import type { MachineryConfig } from "./types";

// Evidence: the catalog image is an illustrative render; public/videos/salt-refinery/dryer.mp4 is site footage of an
// installed unit of the same external form. Both show an elongated rectangular enclosure, a feed box or hopper at one end,
// a top exhaust connection, side inspection openings, a lower section with circular covers, and supports. Neither
// establishes the dryer type, internal construction, heat source, heating method, airflow path, batch or continuous
// operation, controls or performance, so none is stated here. See qa/reports/dryer-content/engineering-verification-checklist.md
const base = createMachine({
  slug: "dryer", name: "Dryer", stageId: "dryer",
  tagline: "Thermal drying of dewatered salt for downstream handling.",
  identity: "PREPARE THE PRODUCT FOR DOWNSTREAM HANDLING.",
  description: "A salt dryer reduces the moisture that remains after washing and mechanical dewatering, preparing salt for screening, handling and storage. Whether a plant needs thermal drying, and to what extent, depends on the finished product. The drying technology, heat source and capacity are selected for each application.",
  components: [
    ["FEED ARRANGEMENT", "The render and site footage show a feed box at the top of one end of the enclosure. How moist salt is metered and distributed inside the dryer is not shown and is confirmed for each design."],
    ["DRYER ENCLOSURE", "An elongated, rib-reinforced rectangular enclosure surrounds the drying zone. Its internal construction is not visible, so no drum, bed, tray or agitator is claimed."],
    ["LOWER SECTION & CIRCULAR COVERS", "A lower section with bolted circular covers runs along the unit. Their function depends on the design and is not stated here."],
    ["EXHAUST CONNECTION", "A large duct connection on top of the enclosure is consistent with an exhaust route for moisture-laden air or vapour. Where it leads, for example to a cyclone, fan or filter, is decided for each plant."],
    ["INSPECTION ACCESS", "Hinged doors and openings along the side give access for inspection and cleaning. Safe access while the plant is stopped is planned with the layout."],
    ["SUPPORTS & DISCHARGE", "Support legs carry the enclosure; on site, the unit stands on concrete plinths with an access platform. The discharge point for dried salt is set to suit the downstream equipment."],
  ],
  steps: [
    ["MECHANICAL DEWATERING FIRST", "General principle: a centrifuge removes free brine mechanically. Thermal drying then removes moisture that mechanical separation leaves behind, which requires heat."],
    ["HEAT & MASS TRANSFER", "Heat supplied to the wet salt evaporates its moisture, and the vapour passes into the surrounding air or gas. How heat is supplied depends on the dryer type, which this page does not specify."],
    ["MOISTURE REMOVAL", "Moisture-laden air or vapour has to be carried away from the drying zone, or drying slows. The exhaust, and any salt dust it carries, is part of the drying system."],
    ["DISCHARGE", "Dried salt leaves the dryer for screening, conveying, storage or packing, according to the plant design."],
  ],
  customization: [
    ["FEED MATERIAL & INCOMING MOISTURE", "The salt type, particle size and moisture after dewatering set the drying load. A wetter or finer feed changes how much heat and drying time are needed."],
    ["REQUIRED DISCHARGE CONDITION", "The final moisture and temperature the next stage needs are agreed for the product. No single final moisture is promised for every application."],
    ["PROCESSING CAPACITY", "The required throughput, together with the moisture to be removed, sizes the dryer and its air-handling equipment. Capacity is confirmed per project, not published as a fixed value."],
    ["HEAT SOURCE & UTILITIES", "The heating method depends on the dryer type and on the fuel, steam or electrical supply available at the site. It is selected and confirmed during design."],
    ["PRODUCT QUALITY & HANDLING", "Salt grade, crystal size and the amount of breakage or fines the product can accept influence the drying arrangement."],
    ["EXHAUST & DUST HANDLING", "Exhaust air can carry fine salt. Ducting, dust separation and the fan are sized together with the dryer and the plant's dust-control requirements."],
    ["CORROSION & WEAR", "Hot, moist salt is corrosive and abrasive. Materials, surface protection and inspection points are chosen for the operating conditions; no material grade is claimed here."],
    ["SPACE, ACCESS & INTEGRATION", "Footprint, height, support loads, platforms and maintenance clearances are planned with the upstream dewatering and downstream handling equipment."],
  ],
});

export const dryer: MachineryConfig = {
  ...base,
  seo: {
    title: "Industrial Salt Dryer | S.K. Engineering Works",
    description: "Industrial dryer for salt processing: removing the moisture left after dewatering, before screening and handling. Selection inputs, plant integration and enquiry details.",
  },
  ...(base.hero ? { hero: { ...base.hero, alt: "Illustrative render of an enclosed rectangular industrial dryer with a top exhaust connection, feed box, inspection doors, bolted circular covers and support legs" } } : {}),
  identity: {
    title: base.identity.title,
    copy: "A dryer applies heat to remove moisture that remains after mechanical dewatering, so that salt can be screened, conveyed, stored or packed. The pictured unit is an enclosed rectangular dryer with a top exhaust connection. Its internal drying arrangement and heat source are not described here because they have not been confirmed.",
  },
  process: {
    ...base.process,
    description: "Where a plant includes thermal drying, the dryer usually receives salt after washing and centrifugal dewatering, and passes it on for screening, conveying or storage. Its exhaust may connect to a cyclone, fan and filter route. The actual sequence depends on the selected dryer technology and the plant design.",
    linkStages: true,
    related: { label: "FOR THE DRYER'S AIR HANDLING", href: "/machinery/id-fan-blower", linkLabel: "ID FAN / BLOWER ↗" },
  },
  engineering: {
    ...base.engineering,
    description: "Feed and discharge heights, the exhaust duct route, support loads, platforms and inspection clearances are coordinated on the plant layout with the dewatering equipment upstream and the handling equipment downstream.",
  },
  enquiry: {
    ...base.enquiry,
    heading: { firstLine: "DISCUSS YOUR", secondLine: "DRYING REQUIREMENT" },
    description: "To discuss a dryer, share what you know: the raw salt and its moisture after dewatering, the required finished condition and capacity, available fuel, steam or power, existing centrifuge or washing equipment, downstream handling or packing, the location and space available, whether it is a new plant or an expansion, and your timeline.",
  },
  structuredData: { category: "Industrial drying equipment" },
};
