export type Project = {
  id: string;
  title: string;
  client?: string;
  location: string;
  capacity: string;
  scope: string;
  projectType: string;
  image: string;
  isPlaceholder: boolean;
  scopeChips?: string[];
  completeScope?: string[];
};

export const projects: Project[] = [
  {
    id: "jagdamba-phalodi",
    title: "15 TPH SALT REFINERY PLANT",
    client: "Jagdamba Salt Pvt. Ltd.",
    location: "Phalodi, Rajasthan",
    capacity: "15 TPH",
    scope: "Process equipment supply & complete plant fitting",
    projectType: "Salt Refinery Plant",
    image: "/images/projects/jagdamba-phalodi.jpg",
    isPlaceholder: false,
    scopeChips: ["HOPPER", "WET MILL", "WASHING", "DRYING", "CONVEYING", "STORAGE", "INSTALLATION"],
    completeScope: [
      "Raw Salt Hopper", "Belt Conveyor", "Wet Mill", "Tank 1", "Tank 2", "Thickener",
      "Screw Washer", "Dryer", "Cyclone", "Bucket Elevator", "Storage Silos",
      "Screw Conveyors", "Complete Plant Fitting / Installation",
    ],
  },
  // Temporary layout record. Replace with a verified project before publishing.
  {
    id: "project-02",
    title: "20 TPH SALT REFINERY PLANT",
    location: "Kutch, Gujarat",
    capacity: "20 TPH",
    scope: "Refinery process equipment, conveying, drying and storage",
    projectType: "Salt Refinery Plant",
    image: "/images/projects/project-02.jpg",
    isPlaceholder: true,
  },
  // Temporary layout record. Replace with a verified project before publishing.
  {
    id: "project-03",
    title: "10 TPH SALT REFINERY PLANT",
    location: "Sambhar, Rajasthan",
    capacity: "10 TPH",
    scope: "Washing, drying, conveying and silo systems",
    projectType: "Salt Refinery Plant",
    image: "/images/projects/project-03.jpg",
    isPlaceholder: true,
  },
  // Temporary layout record. Replace with a verified project before publishing.
  {
    id: "project-04",
    title: "25 TPH SALT REFINERY PLANT",
    location: "Santalpur, Gujarat",
    capacity: "25 TPH",
    scope: "Process line equipment, drying, handling and integration",
    projectType: "Salt Refinery Plant",
    image: "/images/projects/project-04.jpg",
    isPlaceholder: true,
  },
  // Temporary layout record. Replace with a verified project before publishing.
  {
    id: "project-05",
    title: "12 TPH SALT PROCESSING PLANT",
    location: "Nawa, Rajasthan",
    capacity: "12 TPH",
    scope: "Conveying, wet processing, drying and storage",
    projectType: "Salt Processing Plant",
    image: "/images/projects/project-05.jpg",
    isPlaceholder: true,
  },
  // Temporary layout record. Replace with a verified project before publishing.
  {
    id: "project-06",
    title: "30 TPH SALT REFINERY PLANT",
    location: "Gujarat",
    capacity: "30 TPH",
    scope: "Large-capacity process equipment and plant handling systems",
    projectType: "Salt Refinery Plant",
    image: "/images/projects/project-06.jpg",
    isPlaceholder: true,
  },
];
