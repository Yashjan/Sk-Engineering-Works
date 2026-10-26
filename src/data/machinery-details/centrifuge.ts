import { createMachine } from "./create-machine";
export const centrifuge = createMachine({
  slug: "centrifuge", name: "Centrifuge", stageId: "centrifuge", tagline: "Moisture separation for washed salt.", identity: "FROM WASHING TOWARD DRYING.",
  description: "The centrifuge separates excess moisture from washed salt before drying. It connects the washing stage with downstream conveying and dryer-feed equipment.",
  components: [["FEED SECTION", "Receives washed material."], ["ROTATING SEPARATION ASSEMBLY", "Provides the motion used for moisture separation."], ["DRIVE ASSEMBLY", "Provides rotation for the separation stage."], ["DISCHARGE SECTION", "Transfers processed material toward downstream handling."]],
  steps: [["FEED", "Washed material enters the centrifuge."], ["SEPARATE", "Rotation helps separate excess moisture."], ["DISCHARGE", "Processed salt moves toward the next handling and drying stage."]],
});
