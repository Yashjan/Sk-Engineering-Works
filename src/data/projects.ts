export type Project = {
  id: string;
  isFeatured?: boolean;
  kind?: "project" | "equipment";
  category?: string;
  title: string;
  client?: string;
  location: string;
  capacity: string;
  scope: string;
  projectType: string;
  detailHref?: string;
  coverImage: string;
  representativeMedia?: boolean;
  media: ProjectMedia[];
  scopeChips?: string[];
  completeScope?: string[];
};

export type ProjectMedia = {
  id: string;
  type: "image" | "video";
  src: string;
  label: string;
  isRepresentative?: boolean;
};

export type ProjectArchiveRecord = {
  id: string;
  slug: string;
  name: string;
  category: "salt-plants" | "material-handling" | "air-dust" | "process-equipment";
  location?: string;
  capacity?: string;
  mediaType: "image" | "video";
  mediaSrc: string;
  poster?: string;
  mediaLabel: string;
  mediaAlt: string;
  detailHref: string;
  isFeatured: boolean;
  supportingMediaSrc?: string;
  supportingMediaAlt?: string;
};

export type ProjectGalleryItem = {
  id: string;
  type: "image" | "video";
  src: string;
  poster?: string;
  alt: string;
  label: string;
  detail: string;
  format: "landscape" | "portrait" | "square";
  level: "high" | "middle" | "low";
};

export const projects: Project[] = [
  {
    id: "jagdamba-phalodi",
    isFeatured: true,
    title: "15 TPH SALT REFINERY PLANT",
    client: "Jagdamba Salt Pvt. Ltd.",
    location: "Phalodi, Rajasthan",
    capacity: "15 TPH",
    scope: "Process equipment supply & complete plant fitting",
    projectType: "Salt Refinery Plant",
    detailHref: "/projects/jagdamba-salt-15tph",
    coverImage: "/images/projects/jagdamba/cover Image.png",
    media: [
      { id: "fabrication", type: "video", src: "/images/projects/jagdamba/01_jagdamba_fabrication.mp4", label: "FABRICATION" },
      { id: "installation", type: "video", src: "/images/projects/jagdamba/02_jagdamba_site_installation.mp4", label: "SITE INSTALLATION" },
      { id: "completed", type: "video", src: "/images/projects/jagdamba/03_jagdamba_completed_plant.mp4", label: "COMPLETED PLANT" },
      { id: "overview", type: "image", src: "/images/projects/jagdamba/cover Image.png", label: "OVERVIEW" },
    ],
    scopeChips: ["HOPPER", "WET MILL", "WASHING", "DRYING", "CONVEYING", "STORAGE", "INSTALLATION"],
    completeScope: [
      "Raw Salt Hopper", "Belt Conveyor", "Wet Mill", "Tank 1", "Tank 2", "Thickener",
      "Screw Washer", "Dryer", "Cyclone", "Bucket Elevator", "Storage Silos",
      "Screw Conveyors", "Complete Plant Fitting / Installation",
    ],
  },
  {
    id: "jk-salt-25tph",
    title: "25 TPH SALT REFINERY PLANT",
    client: "JK Salt Pvt. Ltd.",
    location: "Santalpur, Gujarat, India",
    capacity: "25 TPH",
    scope: "Complete Machinery Supply",
    projectType: "Salt Refinery Plant",
    coverImage: "/images/projects/Jk salt/Cover Image.png",
    media: [
      { id: "fabrication", type: "video", src: "/images/projects/Jk salt/JK_Salt_25TPH_Fabrication_Clean_Logo.mp4", label: "FABRICATION" },
      { id: "installation", type: "video", src: "/images/projects/Jk salt/SK_Engineering_Site_Installation_Web.mp4", label: "SITE INSTALLATION" },
      { id: "completed", type: "video", src: "/images/projects/Jk salt/JK_Salt_25TPH_Completed_Plant_Clean_Logo.mp4", label: "COMPLETED PLANT" },
      { id: "overview", type: "image", src: "/images/projects/Jk salt/Cover Image.png", label: "OVERVIEW" },
    ],
    scopeChips: ["COMPLETE MACHINERY SUPPLY"],
  },
  {
    id: "royal-salt-80tph",
    title: "80 TPH SALT REFINERY MACHINERY",
    client: "Royal Salt",
    location: "Jambusar, Gujarat, India",
    capacity: "80 TPH",
    scope: "Screw Conveyors, Tanks, Centrifuge",
    projectType: "Salt Refinery Plant Machinery",
    coverImage: "/images/projects/Royal Salt/Royal_Salt_80TPH_Cover_Cinematic.webp",
    media: [
      { id: "fabrication", type: "video", src: "/images/projects/Royal Salt/Royal_Salt_Fabrication_SK_Logo_HQ.mp4", label: "FABRICATION" },
      { id: "installation", type: "video", src: "/images/projects/Royal Salt/Royal_Salt_Site_Installation_SK_Logo_HQ.mp4", label: "SITE INSTALLATION" },
      { id: "completed", type: "video", src: "/images/projects/Royal Salt/Royal_Salt_80TPH_Completed_Machinery_Clean_Logo.mp4", label: "COMPLETED MACHINERY" },
      { id: "overview", type: "image", src: "/images/projects/Royal Salt/Royal_Salt_80TPH_Cover_Cinematic.webp", label: "OVERVIEW" },
    ],
    scopeChips: ["SCREW CONVEYORS", "TANKS", "CENTRIFUGE"],
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

const jagdambaProject = projects.find((project) => project.id === "jagdamba-phalodi");
const jagdambaCompletedMedia = jagdambaProject?.media.find((media) => media.id === "completed");
const blowerProject = projects.find((project) => project.id === "id-fan-blower");
const beltConveyorProject = projects.find((project) => project.id === "belt-conveyor");
const cycloneProject = projects.find((project) => project.id === "cyclone");

if (!jagdambaProject?.client || !jagdambaProject.detailHref || jagdambaCompletedMedia?.type !== "video") {
  throw new Error("The Jagdamba project archive record is incomplete.");
}

// One ordered archive for the combined field-record section. Jagdamba is derived
// from its existing project record; unverified capacities remain omitted.
export const projectArchive: ProjectArchiveRecord[] = [
  {
    id: jagdambaProject.id,
    slug: "jagdamba-salt-15tph",
    name: jagdambaProject.client,
    category: "salt-plants",
    location: jagdambaProject.location,
    capacity: jagdambaProject.capacity,
    mediaType: "video",
    mediaSrc: jagdambaCompletedMedia.src,
    poster: jagdambaProject.coverImage,
    mediaLabel: "COMPLETED PLANT / PROJECT FOOTAGE",
    mediaAlt: "Completed 15 TPH Jagdamba salt refinery in Phalodi, Rajasthan",
    detailHref: jagdambaProject.detailHref,
    isFeatured: true,
    supportingMediaSrc: jagdambaProject.coverImage,
    supportingMediaAlt: "Completed Jagdamba salt refinery project overview",
  },
  {
    id: "jk-salt-santalpur",
    slug: "jk-salt-santalpur",
    name: "JK Salt Pvt. Ltd.",
    category: "salt-plants",
    location: "Santalpur, Gujarat",
    mediaType: "video",
    mediaSrc: "/images/projects/Jk salt/JK_Salt_25TPH_Completed_Plant_Clean_Logo.mp4",
    poster: "/images/projects/Jk salt/Cover Image.png",
    mediaLabel: "COMPLETED PLANT / PROJECT FOOTAGE",
    mediaAlt: "Completed 25 TPH JK Salt refinery in Santalpur, Gujarat",
    detailHref: "/projects/jk-salt-santalpur",
    isFeatured: false,
  },
  {
    id: "royal-salt-jambusar",
    slug: "royal-salt-jambusar",
    name: "Royal Salt",
    category: "salt-plants",
    location: "Jambusar, Gujarat",
    mediaType: "video",
    mediaSrc: "/images/projects/Royal Salt/Royal_Salt_80TPH_Completed_Machinery_Clean_Logo.mp4",
    poster: "/images/projects/Royal Salt/Royal_Salt_80TPH_Cover_Cinematic.webp",
    mediaLabel: "COMPLETED MACHINERY / PROJECT FOOTAGE",
    mediaAlt: "Completed machinery for the 80 TPH Royal Salt refinery in Jambusar, Gujarat",
    detailHref: "/projects/royal-salt-jambusar",
    isFeatured: false,
  },
  {
    id: "bharat-salt-santalpur",
    slug: "bharat-salt-santalpur",
    name: "Bharat Salt",
    category: "salt-plants",
    location: "Santalpur, Gujarat",
    mediaType: "image",
    mediaSrc: "/images/salt-refinery/execution/fabricated-equipment.jpeg",
    mediaLabel: "PROCESS EQUIPMENT / WORKSHOP FABRICATION",
    mediaAlt: "Stainless-steel salt processing equipment during workshop fabrication",
    detailHref: "/projects/bharat-salt-santalpur",
    isFeatured: false,
  },
  {
    id: blowerProject?.id ?? "id-fan-blower",
    slug: "id-fan-blower",
    name: blowerProject?.title ?? "ID FAN / BLOWER",
    category: "air-dust",
    mediaType: "image",
    mediaSrc: blowerProject?.coverImage ?? "/images/salt-refinery/execution/fabrication-blower.jpeg",
    mediaLabel: "AIR HANDLING / WORKSHOP FABRICATION",
    mediaAlt: "Industrial ID fan and blower fabricated by S.K. Engineering Works",
    detailHref: "/projects/id-fan-blower",
    isFeatured: false,
  },
  {
    id: beltConveyorProject?.id ?? "belt-conveyor",
    slug: "belt-conveyor",
    name: beltConveyorProject?.title ?? "BELT CONVEYOR",
    category: "material-handling",
    mediaType: "image",
    mediaSrc: beltConveyorProject?.coverImage ?? "/images/process/belt-conveyor.png",
    mediaLabel: "MATERIAL HANDLING / EQUIPMENT",
    mediaAlt: "Belt conveyor manufactured for industrial material handling",
    detailHref: "/projects/belt-conveyor",
    isFeatured: false,
  },
  {
    id: cycloneProject?.id ?? "cyclone",
    slug: "cyclone",
    name: cycloneProject?.title ?? "CYCLONE",
    category: "air-dust",
    mediaType: "image",
    mediaSrc: cycloneProject?.coverImage ?? "/images/salt-refinery/execution/plant-structure.jpeg",
    mediaLabel: "AIR / DUST SEPARATION",
    mediaAlt: "Industrial cyclone system installed within a fabricated plant structure",
    detailHref: "/projects/cyclone",
    isFeatured: false,
  },
];

// Real workshop and field media used by the scroll-driven visual archive.
// The presentation reads directly from this list so media can be replaced
// without changing the gallery component.
export const projectGallery: ProjectGalleryItem[] = [
  {
    id: "completed-refinery",
    type: "video",
    src: "/images/projects/jagdamba/03_jagdamba_completed_plant.mp4",
    poster: "/images/projects/jagdamba/cover Image.png",
    alt: "Completed Jagdamba salt refinery operating in Phalodi, Rajasthan",
    label: "COMPLETED PLANT",
    detail: "PHALODI / RAJASTHAN",
    format: "landscape",
    level: "middle",
  },
  {
    id: "plant-structure",
    type: "image",
    src: "/images/salt-refinery/execution/plant-structure.jpeg",
    alt: "Installed salt refinery equipment inside a fabricated plant structure",
    label: "SITE EXECUTION",
    detail: "INSTALLED PLANT STRUCTURE",
    format: "portrait",
    level: "high",
  },
  {
    id: "workshop-fabrication",
    type: "video",
    src: "/images/projects/jagdamba/01_jagdamba_fabrication.mp4",
    poster: "/images/salt-refinery/execution/fabricated-equipment.jpeg",
    alt: "Salt refinery machinery being fabricated in the workshop",
    label: "WORKSHOP RECORD",
    detail: "MACHINE FABRICATION",
    format: "portrait",
    level: "low",
  },
  {
    id: "air-handling",
    type: "image",
    src: "/images/salt-refinery/execution/fabrication-blower.jpeg",
    alt: "Industrial ID fan and blower fabricated by S.K. Engineering Works",
    label: "AIR HANDLING",
    detail: "ID FAN / BLOWER",
    format: "square",
    level: "middle",
  },
  {
    id: "site-installation",
    type: "video",
    src: "/images/projects/jagdamba/02_jagdamba_site_installation.mp4",
    poster: "/images/salt-refinery/execution/plant-structure.jpeg",
    alt: "Salt refinery equipment being installed on site",
    label: "FIELD ASSEMBLY",
    detail: "SITE INSTALLATION",
    format: "portrait",
    level: "high",
  },
  {
    id: "process-equipment",
    type: "image",
    src: "/images/salt-refinery/execution/fabricated-equipment.jpeg",
    alt: "Stainless-steel process equipment completed in the workshop",
    label: "PROCESS EQUIPMENT",
    detail: "FABRICATED IN-HOUSE",
    format: "landscape",
    level: "low",
  },
  {
    id: "refinery-overview",
    type: "image",
    src: "/images/projects/jagdamba/cover Image.png",
    alt: "Wide view of a completed salt refinery project",
    label: "PROJECT PROOF",
    detail: "BUILT / INSTALLED / RUNNING",
    format: "landscape",
    level: "middle",
  },
];
