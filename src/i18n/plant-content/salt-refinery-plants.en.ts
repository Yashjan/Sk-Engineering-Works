import type { PlantCopy } from "./types";

// Only general process engineering, the site's machinery catalog and the company's stated scope belong here.
// Capacities, purity, power, water, materials, timelines, named projects and service guarantees stay out until
// the engineering team confirms them: see qa/reports/salt-refinery-plants/engineering-verification-checklist.md
// Translations are in salt-refinery-plants.{hi,ar}.json, keyed by these sentences.
export const plantCopy: PlantCopy = {
  hero: {
    eyebrow: "COMPLETE SALT REFINERY PLANTS / 01",
    support: "From process planning and machinery fabrication to equipment integration and plant execution.",
  },
  process: {
    support: "A refinery line can include the stages below. Which ones a plant needs, and in what order, depends on the raw salt, the finished product and the site. See the [[/machinery|machinery range]] for individual equipment.",
    stages: {
      "raw-salt": "A hopper receives the raw salt and holds it briefly so the line can be fed steadily. A belt conveyor commonly carries it to the first processing stage.",
      crushing: "Size reduction prepares the salt for washing. A wet mill grinds it together with brine; crushers can be considered where the raw salt arrives in larger lumps.",
      washing: "Washing separates insoluble matter and other impurities from the salt, usually in brine. The mix of elutriation, settling and screw-washing equipment depends on the raw salt and the product required.",
      centrifuging: "A centrifuge spins brine and surface moisture out of the washed salt. Removing water at this stage reduces the load on the dryer.",
      drying: "The drying stage helps reduce moisture where required before downstream handling or processing. The selected arrangement and any connected equipment depend on the product and plant design.",
      screening: "A vibro screen separates dried salt by particle size, so that each product stays within its required size range.",
      grinding: "Where a finer product is needed, a pin mill grinds the salt to the required fineness. Whether this stage is included depends on the finished product.",
      "material-handling": "Belt conveyors, screw conveyors and bucket elevators link the stages. The choice depends on the material's condition, the distance and lift involved, and the plant layout.",
      "storage-packing": "Storage silos hold finished salt ahead of packing or dispatch. Storage volume and discharge are planned around the packing format and production flow.",
    },
  },
  execution: {
    heading: "ENGINEERED FOR\nCOMPLETE SALT\nREFINERY SYSTEMS",
    support: "S.K. Engineering Works plans the layout, fabricates machinery and installs it on site, treating the plant as one connected system rather than a set of separate machines.",
    stages: {
      "01": "Machine positions, platforms and material flow are worked out against the site area, building levels and required flow, keeping access for maintenance and, where planned, room for expansion. [[/engineering|How plant layouts are developed]].",
      "02": "The process flow is set from the raw salt and the finished product: which stages are needed, how they connect, and where material transfers between them.",
      "03": "Process and handling equipment is fabricated to suit the layout, with attention to frame alignment, component selection and installation access. The range includes [[/machinery/wet-mill|wet mills]], [[/machinery/screw-washer|screw washers]], [[/machinery/centrifuge|centrifuges]], [[/machinery/belt-conveyor|belt conveyors]] and [[/machinery/screw-conveyor|screw conveyors]].",
      "04": "Machines, platforms, frames and interconnecting equipment are coordinated so that levels, supports and transfer points line up across the plant.",
      "05": "Equipment is positioned and aligned on site and connected to the structure and adjacent machines. Site levels and access for lifting are considered in advance.",
      "06": "Planning, fabricated equipment and site work come together as one connected line. The scope of supply and site work is defined for each project. [[/projects|See project records]].",
    },
  },
  configuration: {
    support: "A plant's equipment and arrangement depend on the raw salt, the finished product, the required output and the site. These factors are reviewed together before the line is fixed.",
    statement: "The same output can lead to different lines: raw salt with more impurities may need more washing, and a restricted site may change how machines and transfer equipment are arranged.",
    factors: {
      "01": "The required finished output, normally stated in TPH, sizes the machinery and transfer equipment along the line. One undersized stage can limit the whole plant.",
      "02": "Source, impurity level, moisture and lump size influence the crushing and washing equipment, and how much washing is needed.",
      "03": "The required grade, particle size and moisture determine whether screening and grinding are needed and how they are arranged.",
      "04": "Site area, building height and existing structures decide how machines, platforms and conveyors are arranged. Layouts should also leave access for maintenance and, where planned, room for future expansion.",
      "05": "The required final moisture influences centrifuge and dryer selection, and the air-handling equipment connected to the dryer.",
      "06": "Packing format and dispatch rate affect storage volume, discharge arrangement and how finished salt reaches the packing point.",
    },
  },
  enquiry: {
    support: "To discuss a plant, share what you know: required capacity, raw salt source, desired finished salt, new plant or expansion, location, site area, existing machinery and planned timeline.",
  },
  service: {
    name: "Complete Salt Refinery Plants",
    serviceType: "Salt refinery plant engineering",
  },
};
