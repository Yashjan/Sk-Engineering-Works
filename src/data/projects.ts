export type Project = {
  id: string;
  kind?: "project" | "equipment";
  category?: string;
  title: string;
  client?: string;
  location: string;
  capacity: string;
  scope: string;
  projectType: string;
  coverImage: string;
  media: ProjectMedia[];
  scopeChips?: string[];
  completeScope?: string[];
};

export type ProjectMedia = {
  id: string;
  type: "image" | "video";
  src: string;
  label: string;
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
    coverImage: "/images/projects/jagdamba/04_jagdamba_project_cover.jpg",
    media: [
      { id: "fabrication", type: "video", src: "/images/projects/jagdamba/01_jagdamba_fabrication.mp4", label: "FABRICATION" },
      { id: "installation", type: "video", src: "/images/projects/jagdamba/02_jagdamba_site_installation.mp4", label: "SITE INSTALLATION" },
      { id: "completed", type: "video", src: "/images/projects/jagdamba/03_jagdamba_completed_plant.mp4", label: "COMPLETED PLANT" },
      { id: "overview", type: "image", src: "/images/projects/jagdamba/04_jagdamba_project_cover.jpg", label: "OVERVIEW" },
    ],
    scopeChips: ["HOPPER", "WET MILL", "WASHING", "DRYING", "CONVEYING", "STORAGE", "INSTALLATION"],
    completeScope: [
      "Raw Salt Hopper", "Belt Conveyor", "Wet Mill", "Tank 1", "Tank 2", "Thickener",
      "Screw Washer", "Dryer", "Cyclone", "Bucket Elevator", "Storage Silos",
      "Screw Conveyors", "Complete Plant Fitting / Installation",
    ],
  },
  {
    id: "id-fan-blower",
    kind: "equipment",
    category: "AIR HANDLING",
    title: "ID FAN / BLOWER",
    location: "",
    capacity: "",
    scope: "",
    projectType: "Industrial Equipment",
    coverImage: "/images/salt-refinery/execution/fabrication-blower.jpeg",
    media: [
      { id: "workshop-view", type: "image", src: "/images/salt-refinery/execution/fabrication-blower.jpeg", label: "AIR HANDLING" },
    ],
  },
  {
    id: "belt-conveyor",
    kind: "equipment",
    category: "MATERIAL HANDLING",
    title: "BELT CONVEYOR",
    location: "",
    capacity: "",
    scope: "",
    projectType: "Industrial Equipment",
    coverImage: "/images/process/belt-conveyor.png",
    media: [
      { id: "equipment-view", type: "image", src: "/images/process/belt-conveyor.png", label: "MATERIAL HANDLING" },
    ],
  },
  {
    id: "screw-conveyor",
    kind: "equipment",
    category: "MATERIAL HANDLING",
    title: "SCREW CONVEYOR",
    location: "",
    capacity: "",
    scope: "",
    projectType: "Industrial Equipment",
    coverImage: "/images/projects/equipment/screw-conveyor.jpg",
    media: [],
  },
  {
    id: "portable-belt-conveyor",
    kind: "equipment",
    category: "MOBILE CONVEYING",
    title: "PORTABLE BELT CONVEYOR",
    location: "",
    capacity: "",
    scope: "",
    projectType: "Industrial Equipment",
    coverImage: "/images/projects/equipment/portable-belt-conveyor.jpg",
    media: [],
  },
  {
    id: "bag-filter",
    kind: "equipment",
    category: "DUST COLLECTION",
    title: "BAG FILTER",
    location: "",
    capacity: "",
    scope: "",
    projectType: "Industrial Equipment",
    coverImage: "/images/projects/equipment/bag-filter.jpg",
    media: [],
  },
  {
    id: "cyclone",
    kind: "equipment",
    category: "AIR / DUST SEPARATION",
    title: "CYCLONE",
    location: "",
    capacity: "",
    scope: "",
    projectType: "Industrial Equipment",
    coverImage: "/images/salt-refinery/execution/plant-structure.jpeg",
    media: [
      { id: "installed-view", type: "image", src: "/images/salt-refinery/execution/plant-structure.jpeg", label: "AIR / DUST SEPARATION" },
    ],
  },
];
