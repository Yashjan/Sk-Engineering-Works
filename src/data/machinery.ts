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

export const machineryCatalog: readonly MachineryItem[] = [
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
] as const;

export const materialHandlingMachines = machineryCatalog.filter(
  (machine) => machine.categorySlug === "material-handling",
);

export function getMachineBySlug(slug: string) {
  return machineryCatalog.find((machine) => machine.slug === slug);
}
