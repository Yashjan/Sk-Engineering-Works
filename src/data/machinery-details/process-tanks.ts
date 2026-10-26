import { createMachine } from "./create-machine";
export const processTanks = createMachine({
  slug: "process-tanks", name: "Process Tank", stageId: "settling-tank", tagline: "Process holding and controlled settling for wet salt handling.", identity: "HOLDING SPACE WITH A PROCESS ROLE.",
  description: "The process tank receives wet-milled salt slurry for holding and controlled settling. Its connections are planned around the upstream mill and downstream processing equipment.",
  components: [["TANK / VESSEL", "Holds process material and liquid."], ["INLET CONNECTION", "Receives material from upstream equipment."], ["OUTLET CONNECTION", "Connects the vessel with the next transfer stage."], ["SUPPORT STRUCTURE", "Supports the vessel within the plant arrangement."]],
  steps: [["RECEIVE", "Wet-milled material and process liquid enter the tank."], ["HOLD / SETTLE", "Material remains available for the required holding and settling stage."], ["TRANSFER", "Connected equipment transfers material to the next process stage."]],
});
