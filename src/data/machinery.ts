import { processStages } from "./process";

export type MachineryCategory = string;

export type MachineryItem = {
  id: string;
  number: string;
  name: string;
  shortName?: string;
  slug: string;
  category: MachineryCategory;
  categorySlug: string;
  mediaType?: "image" | "video";
  mediaSrc?: string;
  poster?: string;
  mediaAlt?: string;
  mediaFit?: "contain" | "cover";
  detailHref: `/machinery/${string}`;
};

const catalog: readonly MachineryItem[] = [
  {
    id: "belt-conveyor",
    number: "01",
    name: "BELT CONVEYOR",
    slug: "belt-conveyor",
    category: "MATERIAL HANDLING",
    categorySlug: "material-handling",
    mediaType: "image",
    mediaSrc: "/images/process/belt-conveyor.png",
    mediaAlt: "S.K. Engineering Works belt conveyor",
    mediaFit: "contain",
    detailHref: "/machinery/belt-conveyor",
  },
  {
    id: "screw-conveyor",
    number: "02",
    name: "SCREW CONVEYOR",
    slug: "screw-conveyor",
    category: "MATERIAL HANDLING",
    categorySlug: "material-handling",
    detailHref: "/machinery/screw-conveyor",
  },
  {
    id: "bucket-elevator",
    number: "03",
    name: "BUCKET ELEVATOR",
    slug: "bucket-elevator",
    category: "MATERIAL HANDLING",
    categorySlug: "material-handling",
    detailHref: "/machinery/bucket-elevator",
  },
  {
    id: "portable-belt-conveyor",
    number: "04",
    name: "PORTABLE BELT CONVEYOR",
    shortName: "PORTABLE BELT",
    slug: "portable-belt-conveyor",
    category: "MATERIAL HANDLING",
    categorySlug: "material-handling",
    detailHref: "/machinery/portable-belt-conveyor",
  },
  {
    id: "hopper",
    number: "05",
    name: "HOPPER",
    slug: "hopper",
    category: "MATERIAL HANDLING",
    categorySlug: "material-handling",
    mediaType: "image",
    mediaSrc: "/images/process/hopper.png",
    mediaAlt: "S.K. Engineering Works material receiving hopper",
    mediaFit: "contain",
    detailHref: "/machinery/hopper",
  },
  {
    id: "wet-mill",
    number: "01",
    name: "WET MILL",
    slug: "wet-mill",
    category: "MILLING & SIZE REDUCTION",
    categorySlug: "milling-size-reduction",
    mediaType: "image",
    mediaSrc: "/images/process/wet-mill.png",
    mediaAlt: "S.K. Engineering Works wet mill",
    mediaFit: "contain",
    detailHref: "/machinery/wet-mill",
  },
  {
    id: "pin-mill",
    number: "02",
    name: "PIN MILL",
    slug: "pin-mill",
    category: "MILLING & SIZE REDUCTION",
    categorySlug: "milling-size-reduction",
    detailHref: "/machinery/pin-mill",
  },
  {
    id: "hammer-mill-crusher",
    number: "03",
    name: "HAMMER MILL / CRUSHER",
    slug: "hammer-mill-crusher",
    category: "MILLING & SIZE REDUCTION",
    categorySlug: "milling-size-reduction",
    detailHref: "/machinery/hammer-mill-crusher",
  },
  {
    id: "id-fan-blower",
    number: "01",
    name: "ID FAN / BLOWER",
    slug: "id-fan-blower",
    category: "AIR + DUST HANDLING",
    categorySlug: "air-dust-handling",
    mediaType: "image",
    mediaSrc: "/images/salt-refinery/complete-execution/fabrication-blower.jpeg",
    mediaAlt: "S.K. Engineering Works ID fan / blower inside the fabrication workshop",
    mediaFit: "contain",
    detailHref: "/machinery/id-fan-blower",
  },
  {
    id: "bag-filter",
    number: "02",
    name: "BAG FILTER",
    slug: "bag-filter",
    category: "AIR + DUST HANDLING",
    categorySlug: "air-dust-handling",
    detailHref: "/machinery/bag-filter",
  },
  {
    id: "cyclone",
    number: "03",
    name: "CYCLONE",
    slug: "cyclone",
    category: "AIR + DUST HANDLING",
    categorySlug: "air-dust-handling",
    mediaType: "image",
    mediaSrc: "/images/salt-refinery/complete-execution/plant-structure.jpeg",
    mediaAlt: "Installed S.K. Engineering Works cyclone equipment and plant structure",
    mediaFit: "contain",
    detailHref: "/machinery/cyclone",
  },
  {
    id: "vibro-screen",
    number: "01",
    name: "VIBRO SCREEN",
    slug: "vibro-screen",
    category: "SCREENING & SEPARATION",
    categorySlug: "screening-separation",
    detailHref: "/machinery/vibro-screen",
  },
  {
    id: "storage-silos",
    number: "01",
    name: "STORAGE SILOS",
    slug: "storage-silos",
    category: "STORAGE & PROCESS EQUIPMENT",
    categorySlug: "storage-process-equipment",
    detailHref: "/machinery/storage-silos",
    mediaType: "image", mediaSrc: "/images/process/Sylo.png",
    mediaAlt: "S.K. Engineering Works storage silo", mediaFit: "contain",
  },
  {
    id: "process-tanks",
    number: "02",
    name: "PROCESS TANKS / WASHING TANKS",
    shortName: "PROCESS TANKS",
    slug: "process-tanks",
    category: "STORAGE & PROCESS EQUIPMENT",
    categorySlug: "storage-process-equipment",
    detailHref: "/machinery/process-tanks",
  },
  {
    id: "screw-washer", number: "03", name: "SCREW WASHER", slug: "screw-washer",
    category: "STORAGE & PROCESS EQUIPMENT", categorySlug: "storage-process-equipment",
    mediaType: "image", mediaSrc: "/images/process/Screw washer.png",
    mediaAlt: "S.K. Engineering Works screw washer", mediaFit: "contain",
    detailHref: "/machinery/screw-washer",
  },
  { id: "thickener", number: "04", name: "THICKENER", slug: "thickener", category: "STORAGE & PROCESS EQUIPMENT", categorySlug: "storage-process-equipment", detailHref: "/machinery/thickener" },
  { id: "centrifuge", number: "02", name: "CENTRIFUGE", slug: "centrifuge", category: "SCREENING & SEPARATION", categorySlug: "screening-separation", detailHref: "/machinery/centrifuge" },
  { id: "dryer", number: "05", name: "DRYER", slug: "dryer", category: "STORAGE & PROCESS EQUIPMENT", categorySlug: "storage-process-equipment", detailHref: "/machinery/dryer" },
  { id: "roller-crusher", number: "04", name: "ROLLER CRUSHER", slug: "roller-crusher", category: "MILLING & SIZE REDUCTION", categorySlug: "milling-size-reduction", detailHref: "/machinery/roller-crusher" },
] as const;

// The approved process owns machine-image paths; retain established public slugs.
const processStageForSlug: Record<string, string> = { "process-tanks": "settling-tank" };
export const machineryCatalog: readonly MachineryItem[] = catalog.map((machine) => {
  const stage = processStages.find((item) => item.id === (processStageForSlug[machine.slug] ?? machine.slug));
  if (!stage) return machine;
  return { ...machine, mediaType: "image", mediaSrc: stage.image.startsWith("/") ? stage.image : `/${stage.image}`, mediaAlt: stage.imageAlt, mediaFit: "contain" };
});

export const materialHandlingMachines = machineryCatalog.filter(
  (machine) => machine.categorySlug === "material-handling",
);

export const millingMachines = machineryCatalog.filter(
  (machine) => machine.categorySlug === "milling-size-reduction",
);

export const airDustMachines = machineryCatalog.filter(
  (machine) => machine.categorySlug === "air-dust-handling",
);

export const screeningMachines = machineryCatalog.filter(
  (machine) => machine.categorySlug === "screening-separation",
);

export const storageMachines = machineryCatalog.filter(
  (machine) => machine.categorySlug === "storage-process-equipment",
);

export function getMachineBySlug(slug: string) {
  return machineryCatalog.find((machine) => machine.slug === slug);
}
