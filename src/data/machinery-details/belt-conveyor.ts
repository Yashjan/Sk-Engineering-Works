import { createMachine } from "./create-machine";
import type { MachineryConfig } from "./types";

// Only general belt-conveyor engineering and the company's location belong here.
// Dimensions, capacities, belt grades, motor ratings, named projects and claims about where this machine is built
// stay out until the engineering team confirms them:
// see qa/reports/belt-conveyor-content/engineering-verification-checklist.md
// Long copy is translated in src/i18n/machinery-content/belt-conveyor.{hi,ar}.json; short labels stay in the dictionaries.
const base = createMachine({
  slug: "belt-conveyor", name: "Belt Conveyor", stageId: "belt-conveyor", tagline: "Continuous transfer of salt and other bulk material between process stages.", identity: "CONNECT THE FEED TO THE NEXT STAGE.",
  description: "S.K. Engineering Works, based at Sambhar Lake, Rajasthan, offers belt conveyors for salt processing and industrial material handling. In salt refinery applications, belt conveyors can transfer raw salt between receiving, feeding, and processing stages, depending on the plant layout and material-handling requirements.",
  components: [
    ["CONVEYOR BELT", "The endless belt that carries the material. Its type and width are selected around the material, its lump size and the required flow."],
    ["DRIVE UNIT", "A motor and gearbox turn the drive pulley through a coupling. The selection depends on the conveying load and belt speed."],
    ["DRIVE & RETURN PULLEYS", "The drive pulley moves the belt by friction, and the pulley at the opposite end turns it back. Both run in bearings mounted on the frame."],
    ["CARRYING & RETURN IDLERS", "Roller sets support the loaded belt on the carrying side and the empty belt on its way back. Troughed carrying idlers curve the belt to help contain bulk material."],
    ["TAKE-UP", "Keeps the belt tension needed for the drive pulley to grip, and allows for belt stretch in service."],
    ["FRAME & SUPPORTS", "The fabricated structure that holds the pulleys and idlers in alignment and carries the load to the floor or supporting structure."],
    ["FEED & DISCHARGE ARRANGEMENT", "Directs material onto the belt and into the next machine. Positions are matched to the connected equipment."],
  ],
  steps: [
    ["LOADING", "Material enters the belt at the feed point from a hopper or upstream machine."],
    ["CARRYING", "The drive pulley moves the belt while the idlers support the belt and its load along the route, whether level or inclined."],
    ["DISCHARGE", "As the belt turns around the end pulley, the material leaves it and passes into the next process stage."],
    ["RETURN", "The empty belt runs back beneath the conveyor on the return idlers to the feed point, so transfer continues without interruption."],
  ],
  customization: [
    ["CONVEYING ROUTE", "Length and inclination follow the distance and height between the feed and discharge points. Inclination is reviewed against the material, because free-flowing material can slide back on a steep belt."],
    ["BELT WIDTH & CAPACITY", "Selected from the required flow in TPH together with the material's bulk density and lump size, the belt speed and the belt profile."],
    ["DRIVE ARRANGEMENT", "The motor, gearbox and coupling are selected for the conveying load and belt speed. The drive position is planned so it can be reached for servicing."],
    ["MATERIAL OF CONSTRUCTION", "Salt is corrosive, particularly in moist conditions. Materials and surface protection for the frame, rollers and fasteners are discussed according to the material, the process stage and the site."],
    ["FEED & DISCHARGE CONNECTIONS", "Positions and heights are arranged to suit the hopper or machine upstream and the equipment receiving material downstream. Feeding material centrally onto the belt helps limit spillage and belt wander."],
    ["SUPPORTS & INSTALLATION", "Support height and spacing, elevated sections and anchoring are planned around site levels and the surrounding equipment."],
    ["FABRICATION & ALIGNMENT", "Frame straightness and the alignment of pulley and idler mountings directly affect how the belt tracks, so they are key points during fabrication and site installation."],
    ["OPERATION & MAINTENANCE ACCESS", "Routine checks cover belt tracking and tension, idler rotation, pulley bearing lubrication, the gearbox, and any spillage or material build-up. The layout should leave clear access to these points."],
  ],
});

export const beltConveyor: MachineryConfig = {
  ...base,
  seo: {
    title: "Belt Conveyor for Salt Processing | S.K. Engineering Works",
    description: "Belt conveyors for salt processing and bulk material handling from S.K. Engineering Works, Sambhar Lake, Rajasthan. Planned around your route and plant layout.",
  },
  ...(base.hero ? { hero: { ...base.hero, alt: "Industrial belt conveyor with troughed carrying idlers on a steel support frame and a geared motor driving the end pulley" } } : {}),
  identity: {
    title: base.identity.title,
    copy: "A belt conveyor carries bulk material on a continuously moving belt from a feed point to a discharge point. In a process plant, it links machines that cannot feed each other directly and keeps material moving between them.",
  },
  process: {
    ...base.process,
    description: "Within the refinery line, the conveyor sits between the raw salt hopper and the wet mill, where wet grinding and brine mixing begin. Its feed and discharge heights and its flow are coordinated with both machines.",
    linkStages: true,
    related: { label: "FOR CHANGING LOADING POSITIONS", href: "/machinery/portable-belt-conveyor", linkLabel: "PORTABLE BELT CONVEYOR ↗" },
  },
  engineering: {
    ...base.engineering,
    description: "The route, rise, support positions and access around the conveyor are worked out on the 2D plant layout before fabrication, so the machine fits the connected equipment and the site.",
  },
  enquiry: {
    ...base.enquiry,
    description: "To discuss a belt conveyor, share the material, the required capacity in TPH, the distance and height between the feed and discharge points, and your site conditions. Layout drawings or site photos help if available.",
  },
  fabrication: {
    note: "Workshop footage of a belt conveyor during fabrication and as a completed machine is recorded in our project archive.",
    links: [
      { href: "/projects/belt-conveyor", label: "VIEW THE BELT CONVEYOR WORKSHOP RECORD ↗" },
      { href: "/projects", label: "VIEW ALL PROJECTS ↗" },
    ],
  },
  structuredData: { category: "Material handling equipment" },
};
