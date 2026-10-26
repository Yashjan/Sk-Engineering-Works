import { createMachine } from "./create-machine";
export const wetMill = createMachine({
  slug: "wet-mill", name: "Wet Mill", stageId: "wet-mill", tagline: "Wet grinding and initial salt processing.", identity: "PREPARE SALT FOR THE WET PROCESS.",
  description: "The wet mill handles initial wet grinding and brine mixing. It conditions incoming salt with process liquid before transfer toward settling, washing and separation equipment.",
  components: [["FEED CONNECTION", "Receives salt and process liquid."], ["MILLING SECTION", "Contains the wet-processing mechanism."], ["DRIVE ASSEMBLY", "Provides movement for the milling stage."], ["DISCHARGE CONNECTION", "Transfers processed material to the next stage."]],
  steps: [["FEED", "Salt and process liquid enter the wet-processing stage."], ["PROCESS", "Material is reduced and conditioned with process liquid."], ["TRANSFER", "Processed material moves toward subsequent settling and washing stages."]],
});
