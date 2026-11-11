import type { MachineryConfig } from "./types";

// The catalog render shows the external motor, guard, enclosed separation housing,
// front connections and base. It does not confirm the internal separator type or cycle.
export const centrifuge: MachineryConfig = {
  slug: "centrifuge", name: "Centrifuge", has3D: false,
  tagline: "Centrifugal separation and dewatering for suitable wet salt-processing lines.",
  description: "A centrifuge can separate liquid from salt crystals or other wet solids by centrifugal action in a suitable process arrangement. It can reduce free or surface moisture before downstream handling or thermal drying, but it does not replace drying and its result depends on the actual machine type, feed properties and operating conditions.",
  seo: { title: "Salt Centrifuge for Dewatering | S.K. Engineering Works", description: "Industrial centrifuge equipment for suitable salt-processing and dewatering lines. Explore separation, configuration and plant-integration considerations." },
  hero: { type: "image", src: "/images/machinery/catalog/centrifuge.webp", alt: "Illustrative industrial centrifuge with an enclosed cylindrical housing, guarded drive motor and base frame" },
  identity: { title: "FROM WASHING TOWARD DRYING.", copy: "The visible motor and guarded drive rotate an enclosed separating assembly inside the cylindrical housing. Centrifugal force can move liquid and solids differently, allowing liquid to be separated from a wet feed. The internal separator type, filter arrangement, solids discharge method and operating mode are not established by this catalog render and require engineering confirmation." },
  components: [
    { title: "ENCLOSED SEPARATION HOUSING", description: "The cylindrical enclosure contains the rotating separation zone. The render does not identify its internal rotor, basket, screen, cloth or scroll arrangement." },
    { title: "MOTOR & GUARDED DRIVE", description: "The visible motor and guarded drive provide rotational power. Motor rating, transmission arrangement and operating speed must be selected for the confirmed duty." },
    { title: "FRONT PROCESS CONNECTIONS", description: "Visible front connections provide process interfaces. Their feed, liquid or solids function and connection sizes must be confirmed from the approved design." },
    { title: "MAIN SHAFT & BEARING SUPPORT", description: "A rotating assembly requires shaft and bearing support. The actual bearing, sealing, lubrication and vibration-control arrangement requires engineering confirmation." },
    { title: "BASE FRAME & ACCESS", description: "The base carries the machine and its drive. Installation, anchoring, lifting, guarding, inspection and maintenance clearances are coordinated with the plant layout." },
  ],
  howItWorks: [
    { title: "FEED", description: "Wet salt or another suitable feed enters through the configured process connection from the selected upstream washing or handling stage." },
    { title: "CENTRIFUGAL SEPARATION", description: "A rotating internal assembly applies centrifugal action, allowing liquid and solids to separate according to the confirmed machine design and feed condition." },
    { title: "LIQUID & SOLIDS ROUTES", description: "Separated liquid and processed solids leave through the arrangements specified for the selected design. The exact collection and discharge method must not be assumed from the exterior." },
    { title: "DOWNSTREAM TRANSFER", description: "Dewatered material can transfer to the next selected conveyor, dryer, screen or handling stage. The actual route depends on the required product and plant layout." },
  ],
  customization: [
    { title: "CENTRIFUGE TYPE & OPERATING MODE", description: "The required centrifuge type and whether operation is continuous or batch must be confirmed from the process duty; neither is established by the catalog render." },
    { title: "FEED & DISCHARGE CONDITION", description: "Raw material, particle-size distribution, feed moisture, liquid properties and desired downstream condition are reviewed before selecting a separation arrangement." },
    { title: "CAPACITY & PROCESS DUTY", description: "Required capacity, feed variation and operating hours guide machine and drive selection. No fixed TPH or discharge-moisture result is published for every application." },
    { title: "DRIVE, VIBRATION & SUPPORT", description: "Drive selection, rotational speed, structural support, vibration behavior and site interface are engineering considerations that require confirmed equipment data." },
    { title: "WEAR, CORROSION & ACCESS", description: "Material selection, surface protection, wear exposure, cleaning access and maintenance clearance are reviewed around salt condition, moisture and plant operating needs." },
    { title: "PROCESS INTEGRATION", description: "Feed, liquid outlet and solids discharge are coordinated with the selected washer or wet-process equipment upstream and conveyors, dryers or other handling stages downstream." },
  ],
  realMedia: [],
  process: { stageId: "centrifuge", sectionNumber: "09", linkStages: true, description: "In the refinery sequence shown here, the centrifuge receives treated wet material after the screw washer and sends dewatered material toward screw conveying and drying. This is one illustrated arrangement, not a universal process order; the actual route depends on feed properties, liquid handling and the required product.", related: { label: "FOR WASHING BEFORE CENTRIFUGAL DEWATERING", href: "/machinery/screw-washer", linkLabel: "SCREW WASHER ↗" } },
  engineering: { sectionNumber: "10", description: "Machine elevation, feed route, liquid outlet, solids discharge, drive access, structural support and maintenance clearance are coordinated on the plant layout before fabrication or installation planning. Shaft alignment, bearing support, vibration behavior, corrosion and wear conditions remain project-specific engineering considerations.", capabilities: ["2D PLANT LAYOUTS", "EQUIPMENT ARRANGEMENT", "MACHINE INTEGRATION", "SITE-SPECIFIC PLANNING"] },
  enquiry: { machineName: "Centrifuge", heading: { firstLine: "DISCUSS YOUR", secondLine: "CENTRIFUGE REQUIREMENT" }, description: "Share the raw material, particle size, feed moisture, desired downstream condition, required capacity, existing washing equipment, connected machinery, available installation space, plant layout, location, operating arrangement and expected project timeline." },
  structuredData: { category: "Salt processing and centrifugal dewatering equipment" },
};
