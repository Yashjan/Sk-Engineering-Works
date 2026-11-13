import type { MachineryConfig } from "./types";

// The repository's completed-machine video shows an inclined belt conveyor on a
// four-wheel chassis. The catalog image is illustrative. Neither source confirms
// towing, powered travel, hydraulic adjustment, belt specification, capacity,
// permissible inclination, materials or performance.
export const portableBeltConveyor: MachineryConfig = {
  slug: "portable-belt-conveyor",
  name: "Portable Belt Conveyor",
  has3D: false,
  tagline: "Relocatable belt conveying for suitable industrial material-transfer duties.",
  description: "A portable belt conveyor moves suitable bulk material between feed and discharge points while allowing the conveyor to be repositioned when the operating layout changes. The repository workshop record shows an inclined conveyor on a wheel-supported chassis; the exact movement, support and height arrangement must be confirmed for each supplied machine.",
  seo: {
    title: "Portable Belt Conveyor | S.K. Engineering Works",
    description: "Portable belt conveyor equipment for suitable industrial material handling. Review the conveying principle, visible wheel-supported arrangement and project selection inputs.",
  },
  hero: {
    type: "image",
    src: "/images/machinery/catalog/portable-belt-conveyor.webp",
    alt: "Illustrative inclined portable belt conveyor on a wheel-supported chassis with visible belt, steel frame and drive assembly",
  },
  identity: {
    title: "TRANSFER POINTS CAN CHANGE. THE CONVEYING DUTY STILL HAS TO BE ENGINEERED.",
    copy: "Unlike a fixed conveyor planned for one permanent route, a portable conveyor is intended for duties where repositioning may be required. The available media supports a wheel-mounted chassis classification for the recorded unit, but it does not establish towing, powered mobility, one-person movement or operation on public roads.",
  },
  components: [
    { title: "CONVEYOR BELT", description: "The moving belt carries material along the conveyor. Belt type, width and surface are selected around the material and duty; the available media does not verify a belt grade or food-contact suitability." },
    { title: "CONVEYOR FRAME", description: "The fabricated conveyor structure supports the belt path and connects it to the lower chassis. Frame dimensions, construction material and permissible loading require confirmed drawings." },
    { title: "END PULLEY ARRANGEMENT", description: "The belt turns around pulleys at the feed and discharge ends. The images show the external end arrangements but do not establish pulley diameter, lagging, bearings or the tensioning method." },
    { title: "DRIVE ASSEMBLY", description: "A visible motor-and-gear arrangement provides belt movement. Its position is visible, while motor power, ratio, belt speed, coupling and electrical specification remain unverified." },
    { title: "BELT SUPPORT & TENSIONING", description: "A conveyor requires the belt to be supported and maintained at suitable tension. The current media does not clearly establish the roller, slider, take-up or tracking arrangement, so these details remain project-specific." },
    { title: "WHEEL-SUPPORTED CHASSIS", description: "The workshop record shows four wheels on a lower chassis beneath the inclined conveyor. It does not establish steering, brakes, towing points, powered travel, road use or the method used to reposition the machine." },
    { title: "INCLINED SUPPORT & TRANSFER ENDS", description: "The visible structure holds the conveyor at an incline between the lower feed end and raised discharge end. Whether the angle or height is adjustable, and how the machine is stabilized in service, require engineering confirmation." },
  ],
  howItWorks: [
    { title: "POSITION & SUPPORT", description: "The conveyor is placed for the required transfer and supported on a stable surface according to its approved arrangement before operation." },
    { title: "MATERIAL FEED", description: "Suitable material enters at the feed end. The feed rate and loading position are coordinated to limit overload, spillage and belt-tracking problems." },
    { title: "BELT TRANSFER", description: "The drive moves the belt along the conveying path while the configured support arrangement guides the loaded and returning belt." },
    { title: "MATERIAL DISCHARGE", description: "Material leaves the belt as it turns around the discharge-end pulley and passes to the selected receiving point or equipment." },
    { title: "BELT RETURN", description: "The empty belt returns through the conveyor structure to the feed end so the transfer cycle can continue." },
  ],
  customization: [
    { title: "MATERIAL & APPLICATION", description: "Material type, bulk density, lump size, moisture, flow behaviour, abrasiveness and temperature are reviewed with the intended loading, unloading or process-transfer duty." },
    { title: "CAPACITY, BELT & SPEED", description: "Required capacity, belt width, belt speed and belt suitability are selected together. No fixed throughput, belt specification or performance value is published for every application." },
    { title: "LENGTH, HEIGHT & ROUTE", description: "Conveyor length, feed height, discharge height and available route are coordinated with the operating points and surrounding equipment." },
    { title: "INCLINATION & STABILITY", description: "Required inclination is reviewed against material behaviour and the machine's support and stability. The permissible angle and any height-adjustment range require an approved design." },
    { title: "PORTABILITY & RELOCATION", description: "The required frequency, distance and method of repositioning, floor condition, turning space and operating support must be agreed. No towing, powered mobility or tool-free relocation is represented as standard." },
    { title: "FEED, DISCHARGE & DUST CONTROL", description: "Feed control, side containment, discharge direction and any dust-control measures are arranged around the material and connected equipment." },
    { title: "POWER & DRIVE", description: "Available electrical supply, operating duty and site conditions inform motor, gearbox, control and cable planning. Ratings and control features require project confirmation." },
    { title: "ENVIRONMENT, WEAR & CORROSION", description: "Indoor or outdoor exposure, moisture, salt, corrosion and wear influence belt, frame, fastener and surface-protection choices. No material grade or corrosion life is claimed here." },
    { title: "INSTALLATION, SAFETY & MAINTENANCE", description: "Planning covers stable positioning, alignment, belt tracking and tension, drive and pulley inspection, cleaning, wear monitoring, guarding, maintenance access and safe isolation. Relocation should occur only under an approved procedure with the conveyor stopped and secured." },
  ],
  realMedia: [
    {
      type: "video",
      src: "/images/projects/equipment/portable-belt-conveyor/fabrication.mp4",
      alt: "Workshop video record of steel-frame fabrication associated with the Portable Belt Conveyor archive",
      caption: "WORKSHOP RECORD / ASSOCIATED FRAME FABRICATION",
    },
    {
      type: "video",
      src: "/images/projects/equipment/portable-belt-conveyor/completed-machine.mp4",
      alt: "Workshop video showing an inclined belt conveyor mounted on a four-wheel chassis",
      caption: "WORKSHOP RECORD / WHEEL-SUPPORTED CONVEYOR",
    },
  ],
  process: {
    stageId: "portable-belt-conveyor",
    sectionNumber: "09",
    linkStages: true,
    description: "A portable belt conveyor may support temporary or changing transfer points for raw salt, processed material, loading or unloading where the selected belt and structure suit the duty. Its use with a hopper, dryer, screen or another conveyor is conditional on the material, elevations, plant layout and operating method; it is not a mandatory refinery stage.",
    related: { label: "FOR A FIXED PROCESS TRANSFER ROUTE", href: "/machinery/belt-conveyor", linkLabel: "BELT CONVEYOR ↗" },
  },
  engineering: {
    sectionNumber: "10",
    description: "The conveying route, material condition, capacity, feed and discharge levels, inclination, chassis support, stability, repositioning method, power connection, guarding and maintenance access are reviewed together. Before relocation or service, the machine must be stopped, isolated and handled according to the confirmed design and site procedure.",
    capabilities: ["2D PLANT LAYOUTS", "EQUIPMENT ARRANGEMENT", "MACHINE INTEGRATION", "SITE-SPECIFIC PLANNING"],
  },
  enquiry: {
    machineName: "Portable Belt Conveyor",
    heading: { firstLine: "DISCUSS YOUR", secondLine: "PORTABLE CONVEYING REQUIREMENT" },
    description: "Share the material, required capacity if known, conveyor length, feed and discharge heights, inclination, particle size and moisture, relocation frequency and method, floor and site conditions, available power, indoor or outdoor installation, connected equipment, location and project timeline.",
  },
  structuredData: { category: "Portable material-handling equipment" },
};
