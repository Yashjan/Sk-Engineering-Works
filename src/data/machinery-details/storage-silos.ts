import { createMachine } from "./create-machine";
export const storageSilos = createMachine({
  slug: "storage-silos", name: "Storage Silos", image: "/images/process/Sylo.png", tagline: "Product holding between processing and dispatch stages.", identity: "HOLD MATERIAL WITHIN THE PLANT FLOW.",
  description: "Storage silos provide a holding point for process material. Filling, discharge and support arrangements are coordinated with upstream handling and downstream requirements.",
  components: [["STORAGE VESSEL", "Holds process material."], ["FILLING CONNECTION", "Receives material from connected handling equipment."], ["DISCHARGE CONNECTION", "Directs material toward the next handling stage."], ["SUPPORT STRUCTURE", "Supports the vessel within the site arrangement."]],
  steps: [["FILL", "Material enters through the filling connection."], ["HOLD", "Material is held for the next handling requirement."], ["DISCHARGE", "Material moves through the outlet to connected equipment."]],
});
