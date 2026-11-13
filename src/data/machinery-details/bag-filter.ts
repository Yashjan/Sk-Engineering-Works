import type { MachineryConfig } from "./types";

// The catalog asset is an illustrative external view of an industrial bag-filtration
// enclosure with a collection section, access structure and duct openings. It does
// not establish the internal flow path, cleaning method, filter media, element count,
// discharge device, materials, controls or filtration performance.
export const bagFilter: MachineryConfig = {
  slug: "bag-filter",
  name: "Bag Filter",
  has3D: false,
  tagline: "Fabric-based particulate filtration for suitable industrial air and process-gas systems.",
  description: "An industrial bag filter uses suitable filtration media to retain suspended particles while air or process gas passes through a configured filtration arrangement. The required equipment depends on airflow, dust characteristics, temperature, moisture, pressure loss and outlet requirements. A bag filter is not interchangeable with a cyclone, and no universal collection efficiency is claimed.",
  seo: {
    title: "Industrial Bag Filter | S.K. Engineering Works",
    description: "Industrial bag filter equipment for suitable dust collection and process-air systems. Review fabric-filtration principles, configuration and integration inputs.",
  },
  hero: {
    type: "image",
    src: "/images/machinery/catalog/bag-filter.webp",
    alt: "Illustrative industrial bag-filter enclosure with external access structure, duct openings and lower collection hopper",
  },
  identity: {
    title: "FILTRATION PERFORMANCE DEPENDS ON THE DUST, GAS AND COMPLETE SYSTEM.",
    copy: "The illustration shows the external form of an industrial bag-filtration unit: an enclosed body, access structure, gas connections and a lower collection section. It does not verify the internal filter arrangement, direction of flow, cleaning method, filter medium, discharge equipment or operating performance. Those details require an approved application-specific design.",
  },
  components: [
    { title: "FILTER ENCLOSURE", description: "The visible enclosure contains the filtration zone and separates it from the surrounding area. Internal chambers, wall construction, sealing and pressure duty are not established by the illustration." },
    { title: "DUST-LADEN GAS INLET", description: "A configured inlet connects the dust-bearing air or process-gas route to the filtration unit. Connection size, orientation, entry arrangement and design velocity require system engineering." },
    { title: "FILTRATION ELEMENTS", description: "Suitable fabric elements provide the filtration surface in the general bag-filter principle. Their medium, dimensions, quantity, support or cage arrangement and direction of filtration remain unverified for this equipment." },
    { title: "CLEAN-GAS OUTLET", description: "Filtered gas leaves through an outlet connected to the selected duct and fan system. The illustration does not establish the internal clean-air chamber or exact outlet path." },
    { title: "COLLECTION SECTION", description: "The illustrated lower section has a hopper-like form for collected particulate material. Its geometry, storage volume and discharge interface are not confirmed as a supplied standard." },
    { title: "DUST DISCHARGE ARRANGEMENT", description: "Collected dust requires a suitable removal or handling method. A rotary airlock, screw conveyor, manual outlet or other device must not be assumed without the confirmed scope." },
    { title: "ACCESS & SUPPORT STRUCTURE", description: "The illustration includes external access and structural support. Platforms, ladders, anchoring, maintenance clearances and site loads require an approved installation arrangement." },
    { title: "CLEANING & MONITORING INTERFACES", description: "Filter surfaces require a cleaning or replacement strategy, and restriction may be monitored where suitable instrumentation is included. Pulse-jet, reverse-air, shaker, differential-pressure or automatic-control equipment is not confirmed by the available evidence." },
  ],
  howItWorks: [
    { title: "DUST-LADEN FLOW ENTERS", description: "Air or suitable process gas carrying suspended particulate matter enters the configured filtration arrangement." },
    { title: "GAS PASSES THROUGH MEDIA", description: "The gas passes through suitable filtration media according to the selected internal flow path. Inside-to-outside or outside-to-inside flow is not assumed here." },
    { title: "PARTICLES ARE RETAINED", description: "Particulate matter is retained by the filtration media and the dust layer that develops during service, subject to the material and operating conditions." },
    { title: "FILTERED GAS EXITS", description: "The filtered gas leaves through the clean-gas route and connected duct system. Required outlet conditions depend on the process and applicable site requirements." },
    { title: "DUST IS MANAGED", description: "Retained particulate material must be removed from the filter surfaces and collection region using the cleaning and discharge arrangement selected for the equipment." },
  ],
  customization: [
    { title: "AIRFLOW & SYSTEM PRESSURE LOSS", description: "Required airflow and allowable pressure loss are evaluated with the fan, ductwork and connected process equipment. No universal airflow or pressure value is published." },
    { title: "DUST LOADING & PARTICLE CHARACTERISTICS", description: "Dust concentration, particle-size distribution, density, shape, abrasiveness and tendency to agglomerate influence filtration and dust-handling selections." },
    { title: "GAS TEMPERATURE & CONDITION", description: "Temperature, humidity, gas composition, corrosive exposure and condensation risk must be established before selecting filter media and construction." },
    { title: "FILTER-MEDIA SUITABILITY", description: "Media selection depends on the dust, gas, temperature, moisture, chemical exposure and required outlet condition. No fabric type or micron rating is represented as standard." },
    { title: "CLEANING METHOD", description: "The cleaning approach is selected around the filtration arrangement and operating duty. Pulse-jet, reverse-air, mechanical-shaker, online or offline cleaning must not be assumed without confirmation." },
    { title: "COLLECTION & DUST DISCHARGE", description: "Collected-dust volume, discharge frequency, sealing and downstream handling are coordinated with the process. No rotary valve, screw or bin arrangement is claimed as standard." },
    { title: "DUCT, FAN & PROCESS INTEGRATION", description: "Inlet and outlet connections, fan compatibility and any relationship with a dryer or cyclone are determined from the complete gas-handling design rather than a fixed generic sequence." },
    { title: "SPACE, SUPPORT & MAINTENANCE ACCESS", description: "Available space, structural support, access to filter elements, safe dust handling, inspection routes and removal clearances are reviewed with the installation." },
    { title: "OPERATION, INSPECTION & ISOLATION", description: "Planning includes seal and joint inspection, filter-condition checks, restriction monitoring where fitted, cleaning-system maintenance where fitted, moisture control and safe shutdown and isolation before service." },
  ],
  realMedia: [{
    type: "video",
    src: "/images/projects/equipment/bag-filter/fabrication.mp4",
    alt: "Workshop video record of fabricated steel equipment associated with the Bag Filter archive",
    caption: "WORKSHOP RECORD / GENERAL SHEET-METAL FABRICATION",
  }],
  process: {
    stageId: "bag-filter",
    sectionNumber: "09",
    linkStages: true,
    description: "In a suitable salt-processing or industrial dust-control system, a bag filter may provide downstream particulate filtration for process air, material-handling extraction or dryer-associated gas treatment. A cyclone may provide upstream pre-separation and a fan may move gas through the route, but their inclusion, order and pressure arrangement depend on engineering design, dust properties, temperature, moisture, pressure loss and required outlet conditions.",
    related: { label: "FOR INERTIAL PARTICLE PRE-SEPARATION", href: "/machinery/cyclone", linkLabel: "CYCLONE ↗" },
  },
  engineering: {
    sectionNumber: "10",
    description: "Bag-filter selection is coordinated with airflow, dust loading, particle properties, gas temperature and humidity, filter-media suitability, cleaning method, pressure loss, collection and discharge, fan duty, duct layout, structural support and maintenance access. Applicable outlet limits, dust hazards, safe isolation and inspection requirements remain project- and site-specific.",
    capabilities: ["2D PLANT LAYOUTS", "EQUIPMENT ARRANGEMENT", "MACHINE INTEGRATION", "SITE-SPECIFIC PLANNING"],
  },
  enquiry: {
    machineName: "Bag Filter",
    heading: { firstLine: "DISCUSS YOUR", secondLine: "INDUSTRIAL FILTRATION REQUIREMENT" },
    description: "Share the intended dust-collection application, dust or material characteristics, required airflow and dust loading if known, particle-size information, process temperature, moisture or humidity, required outlet condition, existing fan, cyclone and ductwork, available installation space, dust-disposal method, whether the system is new or a replacement, site location and project timeline.",
  },
  structuredData: { category: "Industrial fabric-filtration equipment" },
};
