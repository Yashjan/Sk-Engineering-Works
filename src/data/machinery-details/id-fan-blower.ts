import type { MachineryConfig } from "./types";

// The catalog illustration and workshop photograph show a scroll-shaped housing,
// circular inlet, visible rotating fan assembly, outlet and base frame. They support
// a centrifugal-fan description at that external level, but do not establish ID duty,
// blade geometry, drive, materials, ratings or performance.
export const idFanBlower: MachineryConfig = {
  slug: "id-fan-blower",
  name: "ID Fan / Blower",
  has3D: false,
  tagline: "Industrial air movement for suitable process, ventilation and extraction systems.",
  description: "An industrial fan or blower moves air or process gas through connected ductwork and equipment. In induced-draft duty, a fan extracts flow from a process system; in supply duty, it moves air into the system. The required arrangement depends on the complete system, and the repository evidence does not confirm that every offered unit has the same fan type or duty.",
  seo: {
    title: "ID Fan & Industrial Blower | S.K. Engineering Works",
    description: "Industrial ID fan and blower equipment for suitable process-air, extraction and ventilation systems. Review configuration, duct and plant-integration inputs.",
  },
  hero: {
    type: "image",
    src: "/images/machinery/catalog/id-fan-blower.webp",
    alt: "Illustrative industrial centrifugal fan or blower with circular inlet, scroll-shaped housing, outlet and steel base frame",
  },
  identity: {
    title: "AIR MOVEMENT IS A SYSTEM DUTY.",
    copy: "The illustrated unit has the external form of a centrifugal fan: air or process gas enters through the circular inlet toward a driven rotating assembly, and the scroll-shaped housing guides the flow toward the outlet. The external image does not establish the blade geometry, shaft and bearing design, drive arrangement or the pressure and airflow available in service.",
  },
  components: [
    { title: "SCROLL-SHAPED HOUSING & OUTLET", description: "The visible housing surrounds the rotating zone and leads to a discharge opening. Its exact dimensions, reinforcement, connection and pressure duty require an approved design." },
    { title: "CIRCULAR INLET", description: "The visible circular opening provides the inlet path toward the rotating assembly. Inlet size, orientation, guards and duct transition are selected around the connected system." },
    { title: "ROTATING FAN ASSEMBLY", description: "A driven rotating assembly imparts energy to the air or process gas. A rotating wheel is visible, but the image does not verify its blade profile, construction, balance grade or operating speed." },
    { title: "SHAFT & BEARING SUPPORT", description: "A rotating fan requires a shaft and bearing arrangement suited to its load and speed. The available images do not confirm the bearing type, lubrication, sealing or support details." },
    { title: "DRIVE ARRANGEMENT", description: "A motor and transmission provide rotational power. Direct, coupling or belt drive must not be assumed from the current images; the arrangement and motor selection depend on the confirmed duty." },
    { title: "BASE FRAME & INSTALLATION", description: "The visible steel base supports the fan housing. Anchoring, structural support, alignment, vibration isolation and maintenance clearances are coordinated with the installation." },
  ],
  howItWorks: [
    { title: "INLET FLOW", description: "Air or suitable process gas enters the configured inlet from the connected duct or equipment." },
    { title: "ENERGY TRANSFER", description: "The driven rotating assembly transfers mechanical energy to the flow. The resulting airflow and pressure depend on the selected fan and the resistance of the complete system." },
    { title: "HOUSING & OUTLET", description: "In the illustrated centrifugal arrangement, the housing collects and guides the moving flow toward the outlet without establishing a particular blade design or performance value." },
    { title: "CONNECTED SYSTEM", description: "The operating point is determined by the fan together with the inlet, outlet, ductwork and connected process equipment, rather than by the fan in isolation." },
  ],
  customization: [
    { title: "AIRFLOW & SYSTEM RESISTANCE", description: "Required airflow and calculated system pressure loss are fundamental selection inputs. No fixed airflow or static-pressure value is published for every application." },
    { title: "AIR / GAS CONDITION", description: "Temperature, moisture, dust loading, gas composition and corrosive conditions are reviewed before selecting the fan arrangement and materials." },
    { title: "INLET, OUTLET & DUCT LAYOUT", description: "Connection sizes, orientations, transitions, bends, dampers and available straight duct sections affect the system and are coordinated on the layout." },
    { title: "MOTOR & DRIVE", description: "Motor power, speed and direct, coupling or belt-drive selection require the confirmed airflow, pressure loss, operating conditions and fan design." },
    { title: "MATERIAL & OPERATING ENVIRONMENT", description: "Materials, surface protection and wear or corrosion allowances are selected for the actual air or gas stream and the installation environment; no universal material grade is claimed." },
    { title: "NOISE & VIBRATION", description: "Support stiffness, alignment, rotating balance, duct loading and operating conditions influence noise and vibration. Any isolation or monitoring requirement must be specified for the project." },
    { title: "INSTALLATION & MAINTENANCE ACCESS", description: "The layout should provide suitable support, anchoring, duct flexibility where required, drive alignment and safe access for inspection, cleaning and bearing or drive maintenance." },
    { title: "PLANT INTEGRATION", description: "The fan is selected with the complete air-handling route, which may include a dryer, cyclone, filter, ductwork, dampers or exhaust connection according to the process design." },
  ],
  realMedia: [{
    type: "image",
    src: "/images/common/field-media/fabrication-blower.webp",
    alt: "Workshop photograph of a large scroll-housed industrial fan with circular inlet and steel base frame",
    caption: "WORKSHOP RECORD / INDUSTRIAL FAN HOUSING",
  }],
  process: {
    stageId: "id-fan-blower",
    sectionNumber: "09",
    linkStages: true,
    description: "In a suitable refinery or industrial process, an ID fan or blower may serve dryer-associated air handling, ventilation, extraction or a duct-connected dust-control route. The required sequence is project-specific and depends on airflow, pressure losses, gas condition and the selected cyclone, filter, dryer or exhaust arrangement.",
    related: { label: "FOR FILTER-BASED DUST COLLECTION", href: "/machinery/bag-filter", linkLabel: "BAG FILTER ↗" },
  },
  engineering: {
    sectionNumber: "10",
    description: "Airflow duty, system resistance, gas condition, fan orientation, inlet and outlet transitions, duct loads, support, drive access and maintenance clearance are coordinated before equipment selection and installation planning. Alignment, bearing care, vibration behavior and safe isolation remain project-specific engineering and operating considerations.",
    capabilities: ["2D PLANT LAYOUTS", "EQUIPMENT ARRANGEMENT", "MACHINE INTEGRATION", "SITE-SPECIFIC PLANNING"],
  },
  enquiry: {
    machineName: "ID Fan / Blower",
    heading: { firstLine: "DISCUSS YOUR", secondLine: "AIR-HANDLING REQUIREMENT" },
    description: "Share the intended application, required airflow and system static pressure if known, air or gas condition, temperature, dust or moisture exposure, connected ductwork, installation location and space, existing fan details for a replacement, operating arrangement and project timeline.",
  },
  structuredData: { category: "Industrial air-handling equipment" },
};
