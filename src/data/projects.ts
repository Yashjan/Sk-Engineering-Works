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
  scope?: string;
  description: string;
  videoCrop?: "portrait-center" | "landscape";
  supportingMedia: Array<{
    src: string;
    alt: string;
    label: string;
  }>;
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
    coverImage: "/images/projects/jagdamba/cover-image.webp",
    media: [
      { id: "fabrication", type: "video", src: "/images/projects/jagdamba/fabrication.mp4", label: "FABRICATION" },
      { id: "installation", type: "video", src: "/images/projects/jagdamba/site-installation.mp4", label: "SITE INSTALLATION" },
      { id: "completed", type: "video", src: "/images/projects/jagdamba/completed-plant.mp4", label: "COMPLETED PLANT" },
      { id: "overview", type: "image", src: "/images/projects/jagdamba/cover-image.webp", label: "OVERVIEW" },
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
    coverImage: "/images/projects/jk-salt/cover-image.webp",
    media: [
      { id: "fabrication", type: "video", src: "/images/projects/jk-salt/fabrication.mp4", label: "FABRICATION" },
      { id: "installation", type: "video", src: "/images/projects/jk-salt/site-installation.mp4", label: "SITE INSTALLATION" },
      { id: "completed", type: "video", src: "/images/projects/jk-salt/completed-plant.mp4", label: "COMPLETED PLANT" },
      { id: "overview", type: "image", src: "/images/projects/jk-salt/cover-image.webp", label: "OVERVIEW" },
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
    coverImage: "/images/projects/royal-salt/cover.webp",
    media: [
      { id: "fabrication", type: "video", src: "/images/projects/royal-salt/fabrication.mp4", label: "FABRICATION" },
      { id: "installation", type: "video", src: "/images/projects/royal-salt/site-installation.mp4", label: "SITE INSTALLATION" },
      { id: "completed", type: "video", src: "/images/projects/royal-salt/completed-machinery.mp4", label: "COMPLETED MACHINERY" },
      { id: "overview", type: "image", src: "/images/projects/royal-salt/cover.webp", label: "OVERVIEW" },
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
    detailHref: "/machinery/id-fan-blower",
    coverImage: "/images/machinery/catalog/id-fan-blower.webp",
    media: [
      { id: "fabrication", type: "video", src: "/images/projects/equipment/id-fan-blower/fabrication.mp4", label: "FABRICATION" },
      { id: "completed", type: "video", src: "/images/projects/equipment/id-fan-blower/completed-machine.mp4", label: "COMPLETED MACHINE" },
      { id: "overview", type: "image", src: "/images/machinery/catalog/id-fan-blower.webp", label: "EQUIPMENT VIEW" },
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
    detailHref: "/machinery/screw-conveyor",
    coverImage: "/images/machinery/catalog/screw-conveyor.webp",
    media: [
      { id: "fabrication", type: "video", src: "/images/projects/equipment/screw-conveyor/fabrication.mp4", label: "FABRICATION" },
      { id: "completed", type: "video", src: "/images/projects/equipment/screw-conveyor/completed-machine.mp4", label: "COMPLETED MACHINE" },
      { id: "overview", type: "image", src: "/images/machinery/catalog/screw-conveyor.webp", label: "EQUIPMENT VIEW" },
    ],
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
    detailHref: "/machinery/portable-belt-conveyor",
    coverImage: "/images/projects/equipment/portable-belt-conveyor/equipment-view.webp",
    media: [
      { id: "fabrication", type: "video", src: "/images/projects/equipment/portable-belt-conveyor/fabrication.mp4", label: "FABRICATION" },
      { id: "completed", type: "video", src: "/images/projects/equipment/portable-belt-conveyor/completed-machine.mp4", label: "COMPLETED MACHINE" },
      { id: "overview", type: "image", src: "/images/projects/equipment/portable-belt-conveyor/equipment-view.webp", label: "EQUIPMENT VIEW" },
    ],
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
    detailHref: "/machinery/cyclone",
    coverImage: "/images/machinery/catalog/cyclone.webp",
    media: [
      { id: "fabrication", type: "video", src: "/images/projects/equipment/cyclone/fabrication.mp4", label: "FABRICATION" },
      { id: "completed", type: "video", src: "/images/projects/equipment/cyclone/completed-machine.mp4", label: "COMPLETED MACHINE" },
      { id: "overview", type: "image", src: "/images/machinery/catalog/cyclone.webp", label: "EQUIPMENT VIEW" },
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
    detailHref: "/machinery/belt-conveyor",
    coverImage: "/images/machinery/catalog/belt-conveyor.webp",
    media: [
      { id: "fabrication", type: "video", src: "/images/projects/equipment/belt-conveyor/fabrication.mp4", label: "FABRICATION" },
      { id: "completed", type: "video", src: "/images/projects/equipment/belt-conveyor/completed-machine.mp4", label: "COMPLETED MACHINE" },
      { id: "overview", type: "image", src: "/images/machinery/catalog/belt-conveyor.webp", label: "EQUIPMENT VIEW" },
    ],
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
    detailHref: "/machinery/bag-filter",
    coverImage: "/images/machinery/catalog/bag-filter.webp",
    media: [
      { id: "fabrication", type: "video", src: "/images/projects/equipment/bag-filter/fabrication.mp4", label: "FABRICATION" },
      { id: "overview", type: "image", src: "/images/machinery/catalog/bag-filter.webp", label: "EQUIPMENT VIEW" },
    ],
  },
  {
    id: "industrial-chimney",
    kind: "equipment",
    category: "DUST COLLECTION",
    title: "CHIMNEY",
    location: "",
    capacity: "",
    scope: "",
    projectType: "Industrial Equipment",
    detailHref: "/machinery/chimney",
    coverImage: "/images/machinery/catalog/industrial-chimney.webp",
    media: [
      { id: "fabrication", type: "video", src: "/images/projects/equipment/industrial-chimney/fabrication.mp4", label: "FABRICATION" },
      { id: "completed", type: "video", src: "/images/projects/equipment/industrial-chimney/completed-machine.mp4", label: "COMPLETED MACHINE" },
      { id: "overview", type: "image", src: "/images/machinery/catalog/industrial-chimney.webp", label: "EQUIPMENT VIEW" },
    ],
  }
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
const curatedProjectArchive: ProjectArchiveRecord[] = [
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
    scope: jagdambaProject.scope,
    description: "A 15 TPH salt refinery delivered through process-equipment supply and complete plant fitting in Phalodi.",
    videoCrop: "portrait-center",
    supportingMedia: [
      { src: jagdambaProject.coverImage, alt: "Completed Jagdamba salt refinery project overview", label: "COMPLETED PLANT" },
      { src: "/images/projects/archive-stills/jagdamba-phalodi-field.webp", alt: "Jagdamba salt refinery structure during field installation", label: "SITE INSTALLATION" },
    ],
  },
  {
    id: "jk-salt-santalpur",
    slug: "jk-salt-santalpur",
    name: "JK Salt Pvt. Ltd.",
    category: "salt-plants",
    location: "Santalpur, Gujarat",
    capacity: "25 TPH",
    mediaType: "video",
    mediaSrc: "/images/projects/jk-salt/completed-plant.mp4",
    poster: "/images/projects/jk-salt/cover-image.webp",
    mediaLabel: "COMPLETED PLANT / PROJECT FOOTAGE",
    mediaAlt: "Completed 25 TPH JK Salt refinery in Santalpur, Gujarat",
    detailHref: "/projects/jk-salt-santalpur",
    isFeatured: false,
    scope: "Complete machinery supply",
    description: "Complete salt-refinery machinery supplied for the 25 TPH JK Salt facility in Santalpur.",
    videoCrop: "portrait-center",
    supportingMedia: [
      { src: "/images/projects/jk-salt/cover-image.webp", alt: "JK Salt refinery machinery overview", label: "EQUIPMENT OVERVIEW" },
      { src: "/images/projects/archive-stills/jk-salt-25tph-field.webp", alt: "JK Salt refinery equipment documented on site", label: "FIELD RECORD" },
    ],
  },
  {
    id: "royal-salt-jambusar",
    slug: "royal-salt-jambusar",
    name: "Royal Salt",
    category: "salt-plants",
    location: "Jambusar, Gujarat",
    capacity: "80 TPH",
    mediaType: "video",
    mediaSrc: "/images/projects/royal-salt/completed-machinery.mp4",
    poster: "/images/projects/royal-salt/cover.webp",
    mediaLabel: "COMPLETED MACHINERY / PROJECT FOOTAGE",
    mediaAlt: "Completed machinery for the 80 TPH Royal Salt refinery in Jambusar, Gujarat",
    detailHref: "/projects/royal-salt-jambusar",
    isFeatured: false,
    scope: "Screw conveyors, tanks and centrifuge",
    description: "Selected machinery supplied for Royal Salt's 80 TPH facility, covering screw conveyors, tanks and centrifuge equipment.",
    videoCrop: "portrait-center",
    supportingMedia: [
      { src: "/images/projects/royal-salt/cover.webp", alt: "Royal Salt machinery overview", label: "SUPPLIED MACHINERY" },
      { src: "/images/projects/archive-stills/royal-salt-80tph-field.webp", alt: "Royal Salt machinery documented at the facility", label: "FIELD RECORD" },
    ],
  },
  {
    id: "bharat-salt-santalpur",
    slug: "bharat-salt-santalpur",
    name: "Bharat Salt",
    category: "salt-plants",
    location: "Santalpur, Gujarat",
    mediaType: "image",
    mediaSrc: "/images/common/field-media/fabricated-equipment.webp",
    mediaLabel: "PROCESS EQUIPMENT / WORKSHOP FABRICATION",
    mediaAlt: "Stainless-steel salt processing equipment during workshop fabrication",
    detailHref: "/projects/bharat-salt-santalpur",
    isFeatured: false,
    scope: "Process equipment fabrication",
    description: "A field archive record documenting fabricated process equipment for salt-processing operations.",
    supportingMedia: [
      { src: "/images/common/field-media/fabricated-equipment.webp", alt: "Fabricated stainless-steel process equipment", label: "WORKSHOP FABRICATION" },
      { src: "/images/common/field-media/plant-structure.webp", alt: "Installed process equipment within a plant structure", label: "SITE EXECUTION" },
    ],
  },
  {
    id: blowerProject?.id ?? "id-fan-blower",
    slug: "id-fan-blower",
    name: blowerProject?.title ?? "ID FAN / BLOWER",
    category: "air-dust",
    mediaType: "video",
    mediaSrc: "/images/projects/equipment/id-fan-blower/completed-machine.mp4",
    poster: blowerProject?.coverImage ?? "/images/machinery/catalog/id-fan-blower.webp",
    mediaLabel: "AIR HANDLING / COMPLETED MACHINE",
    mediaAlt: "Completed industrial ID fan and blower fabricated by S.K. Engineering Works",
    detailHref: "/projects/id-fan-blower",
    isFeatured: false,
    scope: "Air-handling equipment fabrication",
    description: "An industrial ID fan and blower documented from workshop fabrication through completed-machine testing.",
    videoCrop: "portrait-center",
    supportingMedia: [
      { src: blowerProject?.coverImage ?? "/images/machinery/catalog/id-fan-blower.webp", alt: "Completed ID fan and blower", label: "EQUIPMENT OVERVIEW" },
      { src: "/images/projects/archive-stills/id-fan-blower-field.webp", alt: "ID fan and blower during workshop fabrication", label: "WORKSHOP RECORD" },
    ],
  },
  {
    id: beltConveyorProject?.id ?? "belt-conveyor",
    slug: "belt-conveyor",
    name: beltConveyorProject?.title ?? "BELT CONVEYOR",
    category: "material-handling",
    mediaType: "video",
    mediaSrc: "/images/projects/equipment/belt-conveyor/completed-machine.mp4",
    poster: beltConveyorProject?.coverImage ?? "/images/machinery/catalog/belt-conveyor.webp",
    mediaLabel: "MATERIAL HANDLING / COMPLETED MACHINE",
    mediaAlt: "Completed belt conveyor manufactured for industrial material handling",
    detailHref: "/projects/belt-conveyor",
    isFeatured: false,
    scope: "Material-handling equipment fabrication",
    description: "A belt conveyor manufactured for continuous industrial material transfer and documented in the workshop.",
    videoCrop: "portrait-center",
    supportingMedia: [
      { src: beltConveyorProject?.coverImage ?? "/images/machinery/catalog/belt-conveyor.webp", alt: "Completed industrial belt conveyor", label: "EQUIPMENT OVERVIEW" },
      { src: "/images/projects/archive-stills/belt-conveyor-field.webp", alt: "Belt conveyor during workshop fabrication", label: "WORKSHOP RECORD" },
    ],
  },
  {
    id: cycloneProject?.id ?? "cyclone",
    slug: "cyclone",
    name: cycloneProject?.title ?? "CYCLONE",
    category: "air-dust",
    mediaType: "video",
    mediaSrc: "/images/projects/equipment/cyclone/completed-machine.mp4",
    poster: cycloneProject?.coverImage ?? "/images/machinery/catalog/cyclone.webp",
    mediaLabel: "AIR / DUST SEPARATION / COMPLETED MACHINE",
    mediaAlt: "Completed industrial cyclone system fabricated by S.K. Engineering Works",
    detailHref: "/projects/cyclone",
    isFeatured: false,
    scope: "Air and dust-separation equipment fabrication",
    description: "An industrial cyclone fabricated for air and dust separation, shown through real workshop records.",
    videoCrop: "portrait-center",
    supportingMedia: [
      { src: cycloneProject?.coverImage ?? "/images/machinery/catalog/cyclone.webp", alt: "Completed industrial cyclone", label: "EQUIPMENT OVERVIEW" },
      { src: "/images/projects/archive-stills/cyclone-field.webp", alt: "Industrial cyclone during workshop fabrication", label: "WORKSHOP RECORD" },
    ],
  },
];

const archiveCategoryForProject = (project: Project): ProjectArchiveRecord["category"] => {
  if (project.kind !== "equipment") return "salt-plants";

  const category = project.category?.toLowerCase() ?? "";
  if (category.includes("material") || category.includes("convey")) return "material-handling";
  if (category.includes("air") || category.includes("dust")) return "air-dust";
  return "process-equipment";
};

const toArchiveRecord = (project: Project): ProjectArchiveRecord => {
  const media = project.media.find((item) => item.id === "completed")
    ?? project.media.find((item) => item.id === "fabrication")
    ?? project.media.find((item) => item.id === "overview")
    ?? project.media[0];
  const fallbackHref = `/projects/${project.id}`;
  const detailHref = fallbackHref;
  const hrefParts = detailHref.split("/").filter(Boolean);

  if (!media) throw new Error(`Project ${project.id} requires at least one archive media item.`);

  return {
    id: project.id,
    slug: hrefParts[hrefParts.length - 1] ?? project.id,
    name: project.client ?? project.title,
    category: archiveCategoryForProject(project),
    location: project.location || undefined,
    capacity: project.capacity || undefined,
    mediaType: media.type,
    mediaSrc: media.src,
    poster: media.type === "video" ? project.coverImage : undefined,
    mediaLabel: `${media.label} / ${project.projectType}`,
    mediaAlt: `${project.title} by S.K. Engineering Works`,
    detailHref,
    isFeatured: Boolean(project.isFeatured),
    scope: project.scope || project.category || project.projectType,
    description: project.kind === "equipment"
      ? `${project.title} documented through real workshop fabrication and completed-machine footage.`
      : `${project.title} documented through real workshop and field records.`,
    videoCrop: media.type === "video" ? "portrait-center" : undefined,
    supportingMedia: [
      { src: project.coverImage, alt: `${project.title} completed equipment view`, label: "EQUIPMENT OVERVIEW" },
      { src: `/images/projects/archive-stills/${project.id}-field.webp`, alt: `${project.title} during workshop fabrication`, label: "WORKSHOP RECORD" },
    ],
  };
};

const curatedProjectIds = new Set(curatedProjectArchive.map((project) => project.id));
const curatedProjectNames = new Set(curatedProjectArchive.map((project) => project.name));

// The homepage project source is authoritative. Curated archive records keep
// their tailored copy and order; any newly added homepage record is appended
// automatically so the /projects page cannot silently fall behind.
export const projectArchive: ProjectArchiveRecord[] = [
  ...curatedProjectArchive,
  ...projects
    .filter((project) => (
      !curatedProjectIds.has(project.id)
      && !curatedProjectNames.has(project.client ?? project.title)
    ))
    .map(toArchiveRecord),
];

// Real workshop and field media used by the scroll-driven visual archive.
// The presentation reads directly from this list so media can be replaced
// without changing the gallery component.
export const projectGallery: ProjectGalleryItem[] = [
  {
    id: "workshop-scale",
    type: "image",
    src: "/images/projects/gallery/01_Workshop_Scale.webp",
    alt: "S.K. Engineering Works fabrication workshop at full production scale",
    label: "WORKSHOP RECORD",
    detail: "BUILT AT SCALE",
    format: "landscape",
    level: "high",
  },
  {
    id: "heavy-rotary-equipment",
    type: "image",
    src: "/images/projects/gallery/02_Heavy_Rotary_Equipment.webp",
    alt: "Heavy rotary process equipment fabricated by S.K. Engineering Works",
    label: "EQUIPMENT RECORD",
    detail: "HEAVY ENGINEERING",
    format: "landscape",
    level: "low",
  },
  {
    id: "steel-fabrication-in-motion",
    type: "video",
    src: "/images/projects/gallery/01_Steel_Fabrication_In_Motion.mp4",
    poster: "/images/projects/gallery/01_Steel_Fabrication_In_Motion-poster.webp",
    alt: "Steel fabrication and equipment manufacturing in motion at the workshop",
    label: "WORKSHOP MOTION",
    detail: "FABRICATION IN MOTION",
    format: "portrait",
    level: "middle",
  },
  {
    id: "heavy-steel-assembly",
    type: "image",
    src: "/images/projects/gallery/03_Heavy_Steel_Assembly.webp",
    alt: "Large industrial steel assembly under fabrication",
    label: "ASSEMBLY RECORD",
    detail: "STRUCTURAL PRECISION",
    format: "portrait",
    level: "high",
  },
  {
    id: "stainless-fabrication",
    type: "image",
    src: "/images/projects/gallery/04_Stainless_Fabrication.webp",
    alt: "Stainless steel process equipment fabricated in the workshop",
    label: "FABRICATION RECORD",
    detail: "ENGINEERED IN STEEL",
    format: "portrait",
    level: "low",
  },
  {
    id: "plant-elevation-detail",
    type: "image",
    src: "/images/salt-refinery/plant-layout/plant-elevation-detail.webp",
    alt: "Detailed 2D plant elevation drawing prepared for salt refinery engineering",
    label: "2D ENGINEERING DRAWING",
    detail: "PLANT ELEVATION",
    format: "landscape",
    level: "middle",
  },
  {
    id: "refinery-installation-in-motion",
    type: "video",
    src: "/images/projects/gallery/02_Refinery_Installation_In_Motion.mp4",
    poster: "/images/projects/gallery/02_Refinery_Installation_In_Motion-poster.webp",
    alt: "Salt refinery machinery installation and completed processing structures in motion",
    label: "FIELD MOTION",
    detail: "MACHINERY IN MOTION",
    format: "portrait",
    level: "high",
  },
  {
    id: "completed-refinery-system",
    type: "image",
    src: "/images/projects/gallery/06_Completed_Refinery_System.webp",
    alt: "Completed salt refinery processing system installed on site",
    label: "COMPLETED SYSTEM",
    detail: "BUILT TO PERFORM",
    format: "portrait",
    level: "middle",
  },
];
