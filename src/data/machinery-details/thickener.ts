import { createMachine } from "./create-machine";
export const thickener = createMachine({
  slug: "thickener", name: "Thickener", stageId: "thickener", tagline: "Controlled settling and process-liquid separation.", identity: "SEPARATE STREAMS. CONNECT THE PROCESS.",
  description: "The thickener provides a settling stage for suspended solids in process liquid. The separated streams connect with the appropriate next stages of salt washing and processing.",
  components: [["SETTLING VESSEL", "Provides space for solids to settle from process liquid."], ["FEED CONNECTION", "Introduces the incoming process stream."], ["DISCHARGE CONNECTIONS", "Connect separated streams to downstream handling."], ["SUPPORT FRAME", "Supports the vessel and its plant connections."]],
  steps: [["FEED", "Process slurry enters the thickener."], ["SETTLE", "Heavier solids settle while liquid separates."], ["TRANSFER", "Separated streams move to the appropriate next process stage."]],
});
