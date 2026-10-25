import ProjectsVisualGallery from "@/components/projects/ProjectsVisualGallery";
import type { ProjectGalleryItem } from "@/data/projects";

// Verified S.K. Engineering Works workshop and project media. Replace individual
// entries when dedicated Screw Conveyor fabrication photography is available.
const fabricationGallery: ProjectGalleryItem[] = [
  {
    id: "workshop-fabrication",
    type: "video",
    src: "/images/projects/jagdamba/01_jagdamba_fabrication.mp4",
    poster: "/images/salt-refinery/execution/fabricated-equipment.jpeg",
    alt: "Salt refinery machinery being fabricated in the S.K. Engineering Works workshop",
    label: "WORKSHOP RECORD",
    detail: "MACHINE FABRICATION",
    format: "landscape",
    level: "middle",
  },
  {
    id: "fabricated-equipment",
    type: "image",
    src: "/images/salt-refinery/execution/fabricated-equipment.jpeg",
    alt: "Stainless-steel process equipment fabricated in the S.K. Engineering Works workshop",
    label: "FABRICATION",
    detail: "PROCESS EQUIPMENT / WORKSHOP FLOOR",
    format: "portrait",
    level: "high",
  },
  {
    id: "air-handling-fabrication",
    type: "image",
    src: "/images/salt-refinery/execution/fabrication-blower.jpeg",
    alt: "Industrial blower fabricated by S.K. Engineering Works",
    label: "ASSEMBLY",
    detail: "INDUSTRIAL EQUIPMENT / IN-HOUSE",
    format: "square",
    level: "low",
  },
  {
    id: "site-installation",
    type: "video",
    src: "/images/projects/jagdamba/02_jagdamba_site_installation.mp4",
    poster: "/images/salt-refinery/execution/plant-structure.jpeg",
    alt: "Salt refinery process equipment being installed on site",
    label: "FIELD ASSEMBLY",
    detail: "SITE INSTALLATION",
    format: "portrait",
    level: "middle",
  },
  {
    id: "installed-plant-structure",
    type: "image",
    src: "/images/salt-refinery/execution/plant-structure.jpeg",
    alt: "Fabricated process equipment installed within a salt refinery plant structure",
    label: "INSTALLATION",
    detail: "EQUIPMENT / PLANT SYSTEM",
    format: "landscape",
    level: "high",
  },
  {
    id: "completed-plant",
    type: "video",
    src: "/images/projects/jagdamba/03_jagdamba_completed_plant.mp4",
    poster: "/images/projects/jagdamba/cover Image.png",
    alt: "Completed salt refinery plant after fabrication and site installation",
    label: "COMPLETED PLANT",
    detail: "BUILT / INSTALLED / RUNNING",
    format: "landscape",
    level: "low",
  },
];

export default function ScrewConveyorFabricationGallery() {
  return (
    <ProjectsVisualGallery
      items={fabricationGallery}
      eyebrow="09 / REAL FABRICATION"
      heading={["FROM 3D ENGINEERING", "TO REAL FABRICATION."]}
      headingId="screw-conveyor-fabrication-heading"
      ariaLabel="Real fabrication and field installation"
      footerPrompt="SCROLL TO MOVE THROUGH THE WORKSHOP"
      finalLines={["FROM ENGINEERING", "TO FABRICATION", "TO THE FIELD."]}
      finalLabel="DESIGNED / BUILT / INSTALLED"
      scrollTriggerId="screw-conveyor-fabrication-gallery"
    />
  );
}
