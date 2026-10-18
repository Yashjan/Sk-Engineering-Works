export type EngineeringStage = {
  id: string;
  title: string;
  description: string;
};

// General execution framework, not a record of verified Jagdamba project scope.
// Keep project-specific methods and deliverables out until they are confirmed.
export const engineeringExecutionStages: readonly EngineeringStage[] = [
  {
    id: "01",
    title: "PLANNING",
    description: "Defining equipment arrangement and project requirements.",
  },
  {
    id: "02",
    title: "FABRICATION",
    description: "Manufacturing equipment and structures for the project.",
  },
  {
    id: "03",
    title: "INTEGRATION",
    description: "Coordinating machinery as part of one plant system.",
  },
  {
    id: "04",
    title: "SITE EXECUTION",
    description: "Managing equipment placement and site-level coordination.",
  },
  {
    id: "05",
    title: "INSTALLATION",
    description: "Bringing the plant configuration together on site.",
  },
];
