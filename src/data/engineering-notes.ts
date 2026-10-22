export type EngineeringNote = {
  id: string;
  title: string;
  body: string;
};

// General engineering observations, not Jagdamba-specific project claims.
export const engineeringNotes: readonly EngineeringNote[] = [
  {
    id: "01",
    title: "SYSTEM THINKING",
    body: "A refinery performs best when equipment is planned as one connected process rather than as isolated machines.",
  },
  {
    id: "02",
    title: "EQUIPMENT COORDINATION",
    body: "Material transfer, processing, drying, screening and air handling need to work together as parts of one system.",
  },
  {
    id: "03",
    title: "SITE EXECUTION",
    body: "Plant execution depends on coordination between equipment arrangement, fabrication and installation.",
  },
  {
    id: "04",
    title: "DESIGN BEFORE FABRICATION",
    body: "S.K. Engineering Works uses 2D plant layouts, equipment arrangement and engineering drawings to define a plant before fabrication begins.",
  },
];
