import { createMachine } from "./create-machine";
export const cyclone = createMachine({
  slug: "cyclone", name: "Cyclone", stageId: "cyclone", tagline: "Air-solid separation for process handling.", identity: "SEPARATE PARTICLES FROM PROCESS AIR.",
  description: "The cyclone separates salt and dust particles from the process air stream. It connects air handling with material collection and the designed downstream air system.",
  realMedia: [{ type: "image", src: "/images/salt-refinery/execution/plant-structure.jpeg", alt: "Installed cyclone equipment within an S.K. Engineering Works salt refinery plant structure", caption: "CYCLONE SYSTEM — INSTALLED PLANT EQUIPMENT" }],
  components: [["AIR / MATERIAL INLET", "Receives the particle-carrying air stream."], ["SEPARATION BODY", "Provides the space for cyclonic separation."], ["PARTICLE DISCHARGE", "Directs separated material toward collection."], ["AIR OUTLET", "Connects the remaining airflow to the downstream system."]],
  steps: [["ENTER", "Air carrying fine material enters the cyclone."], ["SEPARATE", "Cyclonic motion separates heavier particles from the airflow."], ["COLLECT", "Separated material moves toward the collection and discharge point."]],
});
