import type { MachineryConfig } from "./types";

// The catalog render confirms the external hopper, enclosed processing body, shaft end,
// bearings and support frame. It does not document the internal milling element, liquid
// circuit or performance. Those details remain conditional pending engineering confirmation.
export const wetMill: MachineryConfig = {
  slug: "wet-mill", name: "Wet Mill", has3D: false,
  tagline: "Wet-process size reduction and feed conditioning for suitable salt-processing lines.",
  description: "A wet mill is used where raw salt needs size reduction and conditioning as part of a wet process. Its selection depends on the feed size, moisture, required output condition, process liquid or brine arrangement, throughput and the equipment before and after it. It is not required in every salt refinery configuration.",
  seo: {
    title: "Wet Mill for Salt Processing | S.K. Engineering Works",
    description: "Wet mill equipment for suitable salt-processing lines. Explore size-reduction, configuration and process-integration considerations for salt refinery plants.",
  },
  hero: { type: "image", src: "/images/machinery/catalog/wet-mill.webp", alt: "Illustrative hopper-fed wet mill with an enclosed processing housing, shaft end and support frame" },
  identity: {
    title: "PREPARE SALT FOR THE WET PROCESS.",
    copy: "The hopper feeds material into an enclosed processing body. A driven internal working arrangement reduces or conditions the feed according to the selected design. The exact working elements, liquid contact method and discharge arrangement must be confirmed for the machine supplied; wet milling, washing, dewatering and drying are separate process functions.",
  },
  components: [
    { title: "FEED HOPPER & INLET", description: "The visible hopper and inlet guide feed into the processing body. Their size, feed control and connection level are coordinated with the upstream conveyor or hopper and the expected material condition." },
    { title: "ENCLOSED PROCESSING BODY", description: "The enclosed housing contains the working zone. Its internal geometry and the actual size-reduction mechanism are not identified by the catalog render and require engineering confirmation before being specified." },
    { title: "DRIVEN SHAFT & WORKING ASSEMBLY", description: "The external shaft end indicates a driven internal assembly. The type, arrangement and clearance of the working elements must be selected and confirmed for the raw salt and required processing duty." },
    { title: "BEARING SUPPORTS", description: "Visible bearing housings support the shaft at the machine boundary. Bearing selection, sealing and lubrication provisions depend on the confirmed drive, moisture conditions and operating arrangement." },
    { title: "DRIVE CONNECTION", description: "The drive connection transmits power to the working assembly. Motor, gearbox, coupling and speed selection depend on feed condition, mechanical load and the selected milling mechanism." },
    { title: "DISCHARGE & LIQUID CONNECTIONS", description: "Material discharge and any water or brine connections are integrated with the selected process route. Their locations and whether liquid is added, retained or drained must be confirmed for the design." },
    { title: "SUPPORT FRAME & ACCESS", description: "The frame supports the machine at the required elevation. Access for inspection, cleaning, drive service and safe removal of wear-prone parts is coordinated with the plant layout." },
  ],
  howItWorks: [
    { title: "FEED", description: "Raw salt enters through the hopper or upstream feed arrangement at a controlled rate suited to the selected machine and process." },
    { title: "ENTRY TO THE WORKING ZONE", description: "The feed passes into the enclosed processing body. The internal route and working geometry must be verified from the approved equipment design." },
    { title: "SIZE REDUCTION / CONDITIONING", description: "A driven internal assembly acts on the material to achieve the intended reduction or conditioning. The precise mechanism and achievable output are project-specific and are not stated without engineering confirmation." },
    { title: "PROCESS-LIQUID INTERACTION", description: "Where the selected wet process uses water or brine, liquid contact is coordinated with the mill and surrounding process equipment. This does not mean the mill independently performs washing, settling or dewatering." },
    { title: "DISCHARGE & TRANSFER", description: "Processed material leaves through the configured discharge and transfers to the next selected tank, washing, separation or handling stage." },
  ],
  customization: [
    { title: "RAW SALT & FEED SIZE", description: "Raw salt source, lump or particle size, moisture, consistency and the nature of soluble and insoluble material are reviewed before selecting a wet-milling arrangement." },
    { title: "REQUIRED OUTPUT CONDITION", description: "The required downstream condition and particle-size objective guide the selection. No universal output size or reduction result applies to every raw salt." },
    { title: "THROUGHPUT & OPERATING DUTY", description: "Required capacity in TPH, feed variation and intended operating hours are needed to assess the machine, drive and connected equipment. No fixed capacity is published for every application." },
    { title: "WATER OR BRINE ARRANGEMENT", description: "Where a wet process uses water or brine, its source, quality, quantity, containment and downstream route are reviewed as part of the whole process circuit." },
    { title: "WORKING MECHANISM & DRIVE", description: "The actual milling mechanism, motor, gearbox, coupling, shaft and operating speed must be selected from the confirmed duty rather than assumed from the external housing." },
    { title: "WEAR, CORROSION & CLEANING", description: "Material selection, surface protection, wear parts and cleaning provisions depend on salt condition, moisture, process liquid and access requirements. These options require engineering review." },
    { title: "FEED, DISCHARGE & LEVELS", description: "Connection positions, heights and transfer route are coordinated with the upstream feeder and downstream tank, washer, separator or conveyor selected for the plant." },
    { title: "INSTALLATION & MAINTENANCE ACCESS", description: "Support loads, foundation or structural interface, service clearances, inspection access and handling space are planned around the actual site and machine arrangement." },
    { title: "PLANT INTEGRATION", description: "The mill is selected as one part of a suitable process route. Its arrangement with conveyors, tanks, washing, thickening and dewatering equipment depends on the raw salt and required product." },
  ],
  realMedia: [],
  process: {
    stageId: "wet-mill", sectionNumber: "09", linkStages: true,
    description: "In the refinery sequence shown here, the wet mill follows raw-salt receiving and belt transfer, then sends wet-processed material toward process tanks and controlled settling. This is an illustrated process route, not a universal sequence; the actual arrangement depends on the raw salt, liquid circuit and downstream requirement.",
    related: { label: "FOR SCREW-DRIVEN WET-PROCESS MATERIAL MOVEMENT", href: "/machinery/screw-washer", linkLabel: "SCREW WASHER ↗" },
  },
  engineering: {
    sectionNumber: "10",
    description: "The feed point, machine elevation, discharge route, liquid circuit where applicable, drive access and service clearances are coordinated on the plant layout before fabrication or installation planning. Shaft alignment, bearing support, cleaning access, wear conditions and the interface with adjacent equipment remain project-specific engineering considerations.",
    capabilities: ["2D PLANT LAYOUTS", "EQUIPMENT ARRANGEMENT", "MACHINE INTEGRATION", "SITE-SPECIFIC PLANNING"],
  },
  enquiry: {
    machineName: "Wet Mill", heading: { firstLine: "DISCUSS YOUR", secondLine: "WET MILL REQUIREMENT" },
    description: "Share the raw salt characteristics, feed size, moisture, required capacity, desired downstream condition, available water or brine details, connected machinery, plant layout, installation location and whether this is a new project or expansion. Please include the expected project timeline where available.",
  },
  structuredData: { category: "Salt processing and size-reduction equipment" },
};
