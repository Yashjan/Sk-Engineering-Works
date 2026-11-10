import type { MachineryConfig } from "./types";

// Numerical specifications and supply-scope claims stay unpublished until engineering confirms them:
// see qa/reports/screw-conveyor-content/engineering-verification-checklist.md.
// Long copy is translated at build time in src/i18n/machinery-content/screw-conveyor.{hi,ar}.json.
export const screwConveyor: MachineryConfig = {
  slug: "screw-conveyor",
  name: "Screw Conveyor",
  has3D: true,
  interactiveExperience: "screw-conveyor",
  tagline: "Enclosed, continuous transfer of salt and other bulk material between process stages.",
  description: "A screw conveyor moves bulk material through an enclosed casing as a motor-driven shaft and helical flights rotate. For salt-processing duties, its conveying route, inlet and discharge positions, drive, supports and material selection are planned around the material condition and the connected equipment.",
  seo: {
    title: "Screw Conveyor for Salt Processing | S.K. Engineering Works",
    description: "Screw conveyors for salt processing and enclosed bulk-material transfer. Explore construction, operation, configuration and plant integration.",
  },
  hero: { type: "image", src: "/images/machinery/catalog/screw-conveyor.webp", alt: "Enclosed industrial screw conveyor with geared drive, fabricated casing and support frame" },
  identity: {
    title: "CONTINUOUS MATERIAL TRANSFER",
    copy: "Inside the casing, helical flights fixed to a rotating shaft advance material from the inlet toward the discharge. The enclosed path helps contain the material while the conveyor links upstream and downstream equipment within the process line.",
  },
  components: [
    { title: "BODY / CASING", description: "The fabricated enclosure contains the material path and supports the screw assembly. Its length, inlet, discharge and access arrangement must match the installation." },
    { title: "SCREW FLIGHT & SHAFT", description: "Helical flights fixed to the central shaft advance material as the shaft rotates. Diameter, pitch and speed are engineering selections tied to the material and required flow." },
    { title: "MOTOR & GEARBOX", description: "The drive supplies the torque and controlled rotational speed needed for the conveying duty. Selection depends on load, route, material condition and operating duty." },
    { title: "FLEXIBLE COUPLING", description: "The coupling transfers rotation from the drive to the conveyor shaft while accommodating the alignment allowed by its design." },
    { title: "INLET SHAFT", description: "The drive-side shaft carries rotation into the screw assembly and must remain aligned with the coupling and bearing supports." },
    { title: "INLET BEARING", description: "The bearing supports the rotating shaft at the inlet end. Alignment, protection from material ingress and service access are considered in the installed arrangement." },
  ],
  howItWorks: [
    { title: "FEED", description: "Material enters through an inlet arranged beneath a hopper or upstream machine." },
    { title: "ROTATION", description: "The motor and gearbox rotate the shaft and its helical flights at the selected operating speed." },
    { title: "TRANSFER", description: "As the flights rotate inside the casing, they advance the bulk material along the conveyor." },
    { title: "DISCHARGE", description: "Material leaves through the configured outlet and passes to the receiving machine or process stage." },
  ],
  customization: [
    { title: "CONVEYING ROUTE", description: "Length, inclination and installation height are planned between the actual feed and discharge points." },
    { title: "SCREW DIAMETER & PITCH", description: "Diameter and flight pitch are selected with the material, required flow and operating speed rather than as isolated dimensions." },
    { title: "MATERIAL & REQUIRED FLOW", description: "Capacity assessment requires the material, bulk density, moisture, particle size, required TPH and operating duty." },
    { title: "MATERIAL OF CONSTRUCTION", description: "Material and surface protection are reviewed for corrosion, wear, cleaning needs and the process environment." },
    { title: "INLET CONFIGURATION", description: "The inlet position and opening are coordinated with the hopper or upstream equipment feeding the conveyor." },
    { title: "DISCHARGE CONFIGURATION", description: "The outlet position and level are coordinated with the downstream machine and the required material path." },
    { title: "DRIVE & SPEED", description: "Motor, gearbox, coupling and operating speed are selected around the conveying load and duty." },
    { title: "SUPPORT & ACCESS", description: "Supports, anchoring and service clearances are arranged around site levels and maintenance access." },
    { title: "ENCLOSURE & INTEGRATION", description: "Casing, covers, connections and surrounding clearances are coordinated with the complete process layout." },
  ],
  realMedia: [],
  process: {
    stageId: "screw-conveyor",
    description: "In the refinery sequence shown here, the screw conveyor receives dewatered salt after the centrifuge and transfers it toward the dryer. Its inlet, discharge and flow must be coordinated with both connected stages.",
    sectionNumber: "10",
    linkStages: true,
    related: { label: "FOR OPEN, LONGER-DISTANCE TRANSFER", href: "/machinery/belt-conveyor", linkLabel: "BELT CONVEYOR ↗" },
  },
  engineering: {
    sectionNumber: "11",
    description: "The conveyor route, levels, supports, drive access and connections are coordinated on the plant layout before fabrication. Shaft and casing alignment, bearing access and clearance around the drive remain important through installation.",
    capabilities: ["2D PLANT LAYOUTS", "EQUIPMENT ARRANGEMENT", "MACHINE INTEGRATION", "SITE-SPECIFIC PLANNING"],
  },
  enquiry: {
    machineName: "Screw Conveyor",
    sectionNumber: "13",
    heading: { firstLine: "DISCUSS YOUR", secondLine: "SCREW CONVEYOR REQUIREMENT" },
    description: "Share the material, its moisture and particle condition, required flow in TPH, conveying distance and inclination, inlet and discharge levels, operating duty and site conditions. Layout drawings or site photographs help the engineering discussion.",
  },
  structuredData: { category: "Industrial bulk material handling equipment" },
};
