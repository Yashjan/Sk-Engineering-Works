export type ProjectExecutionStage = {
  id: string;
  title: string;
  description: string;
  mediaType: "video" | "image";
  mediaSrc: string;
  poster?: string;
  mediaAlt: string;
  layout: "right" | "left" | "wide";
};

const jagdambaPoster = "/images/projects/jagdamba/cover Image.png";

export const jagdambaExecutionStages: readonly ProjectExecutionStage[] = [
  {
    id: "01",
    title: "FABRICATION",
    description: "Equipment and structural components prepared for project execution.",
    mediaType: "video",
    mediaSrc: "/images/projects/jagdamba/01_jagdamba_fabrication.mp4",
    poster: jagdambaPoster,
    mediaAlt: "Jagdamba project fabrication footage",
    layout: "right",
  },
  {
    id: "02",
    title: "SITE EXECUTION",
    description: "Equipment positioned and coordinated at the project site.",
    mediaType: "video",
    mediaSrc: "/images/projects/jagdamba/02_jagdamba_site_installation.mp4",
    poster: jagdambaPoster,
    mediaAlt: "Jagdamba project site installation footage",
    layout: "left",
  },
  {
    id: "03",
    title: "INSTALLED SYSTEM",
    description: "Process equipment brought together within the installed refinery system.",
    mediaType: "video",
    mediaSrc: "/images/projects/jagdamba/03_jagdamba_completed_plant.mp4",
    poster: jagdambaPoster,
    mediaAlt: "Installed Jagdamba salt refinery system footage",
    layout: "wide",
  },
];
