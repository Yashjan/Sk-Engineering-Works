import type { MachineryConfig } from "./types";
export const screwConveyor: MachineryConfig = {
  slug: "screw-conveyor", name: "Screw Conveyor", has3D: true, interactiveExperience: "screw-conveyor",
  tagline: "Continuous material transfer", description: "Engineered for controlled material movement across industrial process systems.",
  seo: { title: "Screw Conveyor", description: "Industrial screw conveyor for controlled material transfer, manufactured by S.K. Engineering Works." },
  hero: { type: "image", src: "/images/process/Screw conveyor.png", alt: "S.K. Engineering Works screw conveyor" },
  identity: { title: "CONTINUOUS MATERIAL TRANSFER", copy: "Engineered for controlled material movement across industrial process systems." },
  components: [], howItWorks: [], customization: [], realMedia: [],
  process: { stageId: "screw-conveyor", description: "A screw conveyor connects material transfer to the wider salt refinery process.", sectionNumber: "10", endStageId: "pin-mill" },
  engineering: { sectionNumber: "11", description: "Equipment is planned around the complete process, available space and site conditions.", capabilities: ["2D PLANT LAYOUTS", "EQUIPMENT ARRANGEMENT", "MACHINE INTEGRATION", "SITE-SPECIFIC PLANNING"] },
  enquiry: {
    machineName: "Screw Conveyor", sectionNumber: "13",
    heading: { firstLine: "DISCUSS YOUR", secondLine: "SCREW CONVEYOR REQUIREMENT" },
    description: "Share your process requirement and our team can discuss the suitable Screw Conveyor configuration for your plant.",
  },
};
