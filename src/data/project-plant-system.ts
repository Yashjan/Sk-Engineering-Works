export type ProjectPlantStage = {
  id: string;
  name: string;
  role: string;
  image: string | null;
  imageAlt: string;
};

export type ProjectPlantSystemData = {
  capacity: string;
  materialFlow: readonly ProjectPlantStage[];
  airHandling: {
    sourceStageId: string;
    stages: readonly ProjectPlantStage[];
  };
};

export type ProjectPlantLayout = {
  image: string;
  imageAlt: string;
  href: string;
  label: string;
};

export const jagdambaPlantSystem: ProjectPlantSystemData = {
  capacity: "15 TPH",
  materialFlow: [
    { id: "01", name: "HOPPER", role: "Raw salt intake", image: null, imageAlt: "" },
    { id: "02", name: "BELT CONVEYOR", role: "Controlled material transfer", image: null, imageAlt: "" },
    { id: "03", name: "WET MILL", role: "Primary wet size reduction", image: null, imageAlt: "" },
    { id: "04", name: "TANKS", role: "Settling and intermediate processing", image: null, imageAlt: "" },
    { id: "05", name: "SCREW WASHER", role: "Salt washing stage", image: null, imageAlt: "" },
    { id: "06", name: "CENTRIFUGE", role: "Moisture separation", image: null, imageAlt: "" },
    { id: "07", name: "SCREW CONVEYOR", role: "Material transfer", image: null, imageAlt: "" },
    { id: "08", name: "DRYER", role: "Final drying stage", image: null, imageAlt: "" },
    { id: "09", name: "BUCKET ELEVATOR", role: "Vertical lifting", image: null, imageAlt: "" },
    { id: "10", name: "VIBRO SCREEN", role: "Screening and grading", image: null, imageAlt: "" },
    { id: "11", name: "PIN MILL", role: "Fine grinding", image: null, imageAlt: "" },
  ],
  airHandling: {
    sourceStageId: "08",
    stages: [
      { id: "A1", name: "DUCTING", role: "Air and exhaust routing", image: null, imageAlt: "" },
      { id: "A2", name: "CYCLONE", role: "Dust and fine-particle separation", image: null, imageAlt: "" },
      { id: "A3", name: "ID FAN", role: "Induced draft airflow", image: null, imageAlt: "" },
    ],
  },
};

// A verified 2D project layout can be added later without changing the section.
export const jagdambaPlantLayout: ProjectPlantLayout | null = null;
