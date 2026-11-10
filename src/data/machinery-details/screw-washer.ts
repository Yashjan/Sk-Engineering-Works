import type { MachineryConfig } from "./types";

// Numerical specifications, construction materials and performance claims stay unpublished until
// engineering confirms them: see qa/reports/screw-washer-content/engineering-verification-checklist.md.
// Long copy is translated at build time in src/i18n/machinery-content/screw-washer.{hi,ar}.json.
export const screwWasher: MachineryConfig = {
  slug: "screw-washer",
  name: "Screw Washer",
  has3D: false,
  tagline: "Screw-driven washing and controlled material movement for suitable salt-processing lines.",
  description: "A screw washer can combine material movement, agitation and contact with washing liquid in one machine, depending on its design. In a salt refinery, its arrangement is selected around the raw salt, the washing objective, available water and the equipment before and after it; it is not a universal replacement for every washing system.",
  seo: {
    title: "Screw Washer for Salt Processing | S.K. Engineering Works",
    description: "Screw washing equipment for suitable salt-processing lines. Explore its working principle, components, configuration and plant-integration considerations.",
  },
  hero: {
    type: "image",
    src: "/images/machinery/catalog/screw-washer.webp",
    alt: "Illustrative open-trough screw washer with a helical screw assembly",
  },
  identity: {
    title: "WASHING AND MOVEMENT IN ONE STAGE.",
    copy: "Raw material enters the washing zone, where a rotating screw can move and agitate it while washing liquid contacts the salt. The way liquid is introduced and separated, and the residence time available for washing, depend on the actual machine and process arrangement.",
  },
  components: [
    {
      title: "WASHING TROUGH / BODY",
      description: "The body contains the washing and material path. Its geometry, liquid level, access and connection points must suit the selected washing arrangement.",
    },
    {
      title: "SCREW FLIGHTS & SHAFT",
      description: "The rotating helical assembly moves the salt and can provide agitation. Diameter, pitch, speed and clearance are engineering selections tied to the material and washing duty.",
    },
    {
      title: "FEED & PRODUCT DISCHARGE",
      description: "The feed and discharge openings connect the washer to surrounding equipment and control how material enters and leaves the washing zone.",
    },
    {
      title: "LIQUID & DRAINAGE ARRANGEMENT",
      description: "Water supply, distribution, drainage or overflow provisions are process-specific. Their presence and positions must be confirmed for the selected design.",
    },
    {
      title: "DRIVE ASSEMBLY",
      description: "A motor and gearbox provide the torque and rotational speed required by the screw. Selection depends on the load, material condition and operating duty.",
    },
    {
      title: "BEARINGS & SEALS",
      description: "Where used, bearings support the rotating assembly and seals help manage the boundary between wet material and mechanical parts. Their arrangement requires design confirmation.",
    },
    {
      title: "SUPPORT FRAME & ACCESS",
      description: "The support structure carries the machine at the required level, while inspection, cleaning and maintenance clearances are coordinated with the plant layout.",
    },
  ],
  howItWorks: [
    {
      title: "FEED",
      description: "Raw salt enters through a feed arrangement coordinated with the upstream process and the washer's operating level.",
    },
    {
      title: "CONTACT & AGITATION",
      description: "The rotating screw moves and agitates the material while it contacts washing liquid under the selected process conditions.",
    },
    {
      title: "SCREW TRANSFER",
      description: "As the screw rotates, its flights advance the material through the washing zone at a rate determined by the equipment and process design.",
    },
    {
      title: "LIQUID SEPARATION",
      description: "Where the design includes drainage or overflow, liquid and suitable suspended material leave through the specified arrangement; the mechanism must be confirmed for the machine supplied.",
    },
    {
      title: "DISCHARGE",
      description: "The treated salt leaves through the product discharge and passes to the next selected separation, dewatering or handling stage.",
    },
  ],
  customization: [
    {
      title: "RAW SALT CONDITION",
      description: "Particle-size distribution, moisture, soluble and insoluble impurities, and feed consistency are reviewed before selecting the washing arrangement.",
    },
    {
      title: "REQUIRED FLOW & DUTY",
      description: "Required TPH, operating hours and feed variation are needed to assess machine size, screw geometry and drive duty; no fixed capacity applies to every material.",
    },
    {
      title: "WASHING OBJECTIVE",
      description: "The intended washing result and the downstream product requirement define what the machine must do within the wider process rather than acting as a complete purification system by itself.",
    },
    {
      title: "WATER & LIQUID MANAGEMENT",
      description: "Available water quality, supply, reuse strategy and the required drainage or overflow route are considered as part of the process design.",
    },
    {
      title: "SCREW GEOMETRY & RESIDENCE",
      description: "Screw diameter, pitch, speed, equipment length and inclination, where relevant, are evaluated together with agitation and residence-time requirements.",
    },
    {
      title: "MATERIAL OF CONSTRUCTION",
      description: "Construction materials and surface protection are selected only after reviewing corrosion, wear, cleaning and the chemical and moisture conditions of the process.",
    },
    {
      title: "DRIVE & MECHANICAL LOAD",
      description: "Motor, gearbox, shaft and bearing duties are assessed against material load, start-up conditions, screw geometry and the intended operating schedule.",
    },
    {
      title: "FEED, DISCHARGE & DRAINAGE",
      description: "Connection positions and levels are coordinated with upstream feed, downstream equipment and the route provided for process liquid.",
    },
    {
      title: "ACCESS & MAINTENANCE",
      description: "The layout should provide access for inspection, cleaning, wear checks, drive service and attention to rotating and stationary clearances.",
    },
    {
      title: "PLANT INTEGRATION",
      description: "The washer is coordinated with the selected wet-processing, separation, dewatering and material-handling equipment rather than treated as an isolated machine.",
    },
  ],
  realMedia: [],
  process: {
    stageId: "screw-washer",
    description: "In the refinery sequence shown here, the screw washer follows the thickener and sends treated salt toward the centrifuge for dewatering. This is one possible arrangement; the actual washing route and connected equipment depend on the raw salt, water circuit and required product.",
    sectionNumber: "09",
    related: {
      label: "FOR ENCLOSED TRANSFER BETWEEN PROCESS STAGES",
      href: "/machinery/screw-conveyor",
      linkLabel: "SCREW CONVEYOR ↗",
    },
  },
  engineering: {
    sectionNumber: "10",
    description: "The feed level, washing zone, liquid connections, drainage route, discharge level, drive access and structural supports are coordinated on the plant layout. Mechanical alignment, screw-to-body clearance, corrosion and wear conditions, and access for inspection and cleaning remain project-specific engineering considerations.",
    capabilities: ["2D PLANT LAYOUTS", "EQUIPMENT ARRANGEMENT", "MACHINE INTEGRATION", "SITE-SPECIFIC PLANNING"],
  },
  enquiry: {
    machineName: "Screw Washer",
    heading: { firstLine: "DISCUSS YOUR", secondLine: "SCREW WASHER REQUIREMENT" },
    description: "Share the raw salt characteristics, particle size and moisture, required TPH, washing objective, available water, desired downstream condition, plant layout, installation location and connected equipment. Please also state whether this is for a new line or replacement equipment and the expected project timeline.",
  },
  structuredData: { category: "Salt washing and wet-process equipment" },
};
