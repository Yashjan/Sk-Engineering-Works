import type { MachineryConfig } from "./types";

// The catalog illustration shows the external form of a conventional gas-solid
// cyclone: inlet and outlet ducting, a cylindrical body, conical section, lower
// discharge and support frame. It does not establish the internal geometry,
// discharge device, materials, pressure loss or separation performance.
export const cyclone: MachineryConfig = {
  slug: "cyclone",
  name: "Cyclone",
  has3D: false,
  tagline: "Industrial gas-solid separation for suitable air-handling and process systems.",
  description: "A cyclone separator can remove a portion of entrained particles from a suitable air or process-gas stream by developing rotational flow inside a shaped body. Separation depends on particle characteristics, airflow, cyclone geometry and operating conditions. A cyclone is not equivalent to a bag filter and does not guarantee complete particle removal.",
  seo: {
    title: "Industrial Cyclone Separator | S.K. Engineering Works",
    description: "Industrial cyclone separator equipment for suitable dust-laden air and process-gas systems. Review separation principles, configuration and plant-integration inputs.",
  },
  hero: {
    type: "image",
    src: "/images/machinery/catalog/cyclone.webp",
    alt: "Illustrative industrial cyclone separator with inlet and outlet ducting, cylindrical body, conical section, lower discharge and support frame",
  },
  identity: {
    title: "PARTICLE SEPARATION DEPENDS ON THE COMPLETE SYSTEM.",
    copy: "The illustrated equipment has the external form of a conventional gas-solid cyclone separator. In a suitable system, particle-laden gas enters the body and develops swirling flow that encourages particles to move toward the outer wall and collection region. The image does not verify the internal outlet geometry, cone proportions, discharge isolation or separation performance.",
  },
  components: [
    { title: "GAS / PARTICLE INLET", description: "The visible inlet duct introduces the particle-laden stream into the cyclone body. Its size, shape, orientation and connection require an approved system design." },
    { title: "CYLINDRICAL BODY", description: "The upper body contains part of the rotating flow path. Its diameter, height and internal geometry influence performance but are not verified by the illustration." },
    { title: "CONICAL SECTION", description: "The visible cone narrows toward the lower collection region. Exact cone geometry, wall construction and any wear protection require engineering confirmation." },
    { title: "GAS OUTLET ARRANGEMENT", description: "An outlet path carries the remaining gas from the separator. The available image does not confirm the internal outlet or vortex-finder construction." },
    { title: "PARTICLE DISCHARGE", description: "The lower opening provides a path toward collection or discharge equipment. A rotary valve, airlock or other isolation device must not be assumed to be included." },
    { title: "SUPPORT & CONNECTIONS", description: "The illustrated frame supports the separator and connected ducting. Structural loads, flanges, access and anchoring are coordinated with the installation." },
  ],
  howItWorks: [
    { title: "STREAM ENTRY", description: "Particle-laden air or suitable process gas enters through the configured inlet." },
    { title: "ROTATIONAL FLOW", description: "The cyclone geometry develops swirling flow. Centrifugal effects encourage particles with suitable characteristics to move toward the outer wall." },
    { title: "PARTICLE COLLECTION", description: "Separated particles move toward the lower collection or discharge region according to the equipment and connected handling arrangement." },
    { title: "GAS EXIT", description: "The remaining gas leaves through the outlet arrangement and may require downstream filtration or other treatment according to the process." },
  ],
  customization: [
    { title: "AIRFLOW & PRESSURE LOSS", description: "Design airflow and the allowable pressure loss are considered with the connected fan, ductwork and process equipment. No universal operating value is published." },
    { title: "PARTICLE CHARACTERISTICS", description: "Particle-size distribution, density, shape, dust loading and desired separation duty are required selection inputs." },
    { title: "GAS & OPERATING CONDITION", description: "Gas composition, temperature, moisture, corrosive conditions and condensation risk influence the selected arrangement and materials." },
    { title: "BODY & CONNECTION GEOMETRY", description: "Body proportions, inlet and outlet connections, orientation and duct transitions are engineered around the required system rather than selected from the illustration alone." },
    { title: "WEAR & CORROSION EXPOSURE", description: "Abrasive or corrosive service may require suitable construction or protection after the actual operating conditions are reviewed; no liner or material grade is claimed." },
    { title: "PARTICLE DISCHARGE MANAGEMENT", description: "Collection volume, sealing, discharge frequency and the downstream handling method must be coordinated. No particular airlock or valve is represented as standard scope." },
    { title: "SUPPORT, ACCESS & MAINTENANCE", description: "The installation should provide structural support and safe access for inspection, joint and seal checks, cleaning, wear review and discharge maintenance." },
    { title: "DUCT & PLANT INTEGRATION", description: "Cyclone, fan, dryer, filter, duct and material-handling relationships depend on the process design. Their order must not be assumed from a generic sequence." },
  ],
  realMedia: [{
    type: "image",
    src: "/images/common/field-media/plant-structure.webp",
    alt: "Site photograph showing conical process equipment installed within an industrial steel structure",
    caption: "SITE RECORD / PROCESS EQUIPMENT & STEEL STRUCTURE",
  }],
  process: {
    stageId: "cyclone",
    sectionNumber: "09",
    linkStages: true,
    description: "In a suitable salt-processing or industrial air-handling system, a cyclone may provide primary particle separation, material recovery or pre-separation before downstream filtration. The actual sequence depends on the process, dust loading, fan duty, duct arrangement and required outlet-gas condition.",
    related: { label: "FOR DOWNSTREAM PARTICULATE FILTRATION", href: "/machinery/bag-filter", linkLabel: "BAG FILTER ↗" },
  },
  engineering: {
    sectionNumber: "10",
    description: "Cyclone selection is coordinated with airflow, particle properties, pressure loss, gas condition, body geometry, discharge management, duct loading, structural support and maintenance access. Connected fans and filtration equipment are reviewed as parts of the same system, while inspection, wear, corrosion, sealing and safe isolation remain application-specific requirements.",
    capabilities: ["2D PLANT LAYOUTS", "EQUIPMENT ARRANGEMENT", "MACHINE INTEGRATION", "SITE-SPECIFIC PLANNING"],
  },
  enquiry: {
    machineName: "Cyclone",
    heading: { firstLine: "DISCUSS YOUR", secondLine: "CYCLONE SEPARATION REQUIREMENT" },
    description: "Share the intended application, required airflow if known, air or gas condition, particle characteristics and loading, operating temperature, duct arrangement, connected fan or filtration equipment, discharge method, installation space and support, site location, whether the system is new or a replacement, and the project timeline.",
  },
  structuredData: { category: "Industrial gas-solid separation equipment" },
};
