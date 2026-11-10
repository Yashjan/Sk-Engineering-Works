/** @jsxImportSource @/i18n/react */
import ProjectsVisualGallery from "@/components/projects/ProjectsVisualGallery";
import type { ProjectGalleryItem } from "@/data/projects";

// General workshop and field records. They provide company context, but are not
// presented as evidence of this specific Screw Conveyor until provenance is confirmed.
const fabricationGallery: ProjectGalleryItem[] = [
  {
    id: "workshop-fabrication",
    type: "video",
    src: "/images/projects/jagdamba/fabrication.mp4",
    poster: "/images/common/field-media/fabricated-equipment.webp",
    alt: "Salt refinery machinery during workshop fabrication",
    label: "WORKSHOP RECORD",
    detail: "MACHINE FABRICATION",
    format: "landscape",
    level: "middle",
  },
  {
    id: "fabricated-equipment",
    type: "image",
    src: "/images/common/field-media/fabricated-equipment.webp",
    alt: "Stainless-steel process equipment on a workshop floor",
    label: "FABRICATION",
    detail: "PROCESS EQUIPMENT / WORKSHOP FLOOR",
    format: "portrait",
    level: "high",
  },
  {
    id: "air-handling-fabrication",
    type: "image",
    src: "/images/common/field-media/fabrication-blower.webp",
    alt: "Industrial blower assembly in a workshop",
    label: "ASSEMBLY",
    detail: "INDUSTRIAL EQUIPMENT / WORKSHOP",
    format: "square",
    level: "low",
  },
  {
    id: "site-installation",
    type: "video",
    src: "/images/projects/jagdamba/site-installation.mp4",
    poster: "/images/common/field-media/plant-structure.webp",
    alt: "Salt refinery process equipment being installed on site",
    label: "FIELD ASSEMBLY",
    detail: "SITE INSTALLATION",
    format: "portrait",
    level: "middle",
  },
  {
    id: "installed-plant-structure",
    type: "image",
    src: "/images/common/field-media/plant-structure.webp",
    alt: "Process equipment within a salt refinery plant structure",
    label: "INSTALLATION",
    detail: "EQUIPMENT / PLANT SYSTEM",
    format: "landscape",
    level: "high",
  },
  {
    id: "completed-plant",
    type: "video",
    src: "/images/projects/jagdamba/completed-plant.mp4",
    poster: "/images/projects/jagdamba/cover-image.webp",
    alt: "Salt refinery plant equipment at an industrial site",
    label: "PLANT RECORD",
    detail: "EQUIPMENT / INDUSTRIAL SITE",
    format: "landscape",
    level: "low",
  },
];

export default function ScrewConveyorFabricationGallery() {
  return (
    <ProjectsVisualGallery
      items={fabricationGallery}
      eyebrow="09 / WORKSHOP & FIELD RECORD"
      heading={["ENGINEERING CONTEXT", "WORKSHOP & FIELD RECORDS."]}
      headingId="screw-conveyor-fabrication-heading"
      ariaLabel="General workshop and field records"
      footerPrompt="SCROLL TO MOVE THROUGH THE WORKSHOP"
      finalLines={["ENGINEERING", "WORKSHOP", "FIELD RECORDS."]}
      finalLabel="GENERAL PROJECT RECORD"
      scrollTriggerId="screw-conveyor-fabrication-gallery"
    />
  );
}
