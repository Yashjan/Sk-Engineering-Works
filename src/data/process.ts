export type ProcessStage = {
  id: string;
  name: string;
  purpose: string;
  timelineLabel: string;
  image: string;
  labels: string[];
};

export const processStages: ProcessStage[] = [
  {
    id: "hopper",
    name: "RAW SALT HOPPER",
    purpose: "Raw salt receiving and temporary storage.",
    timelineLabel: "RAW INTAKE",
    image: "/images/process/hopper.png",
    labels: ["RAW SALT RECEIVING", "TEMPORARY STORAGE"],
  },
  {
    id: "belt-conveyor",
    name: "BELT CONVEYOR",
    purpose: "Transfers raw salt to the next processing stage.",
    timelineLabel: "CONVEYING",
    image: "/images/process/belt-conveyor.png",
    labels: ["MATERIAL TRANSFER", "PROCESS CONNECTION"],
  },
  {
    id: "wet-mill",
    name: "WET MILL",
    purpose: "Initial wet grinding and brine mixing.",
    timelineLabel: "WET MILLING",
    image: "/images/process/wet-mill.png",
    labels: ["WET GRINDING", "BRINE MIXING"],
  },
];
