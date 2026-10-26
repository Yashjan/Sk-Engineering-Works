import { createMachine } from "./create-machine";
export const hopper = createMachine({
  slug: "hopper", name: "Hopper", stageId: "hopper", tagline: "Raw material receiving and controlled feeding.", identity: "THE START OF A CONNECTED PROCESS.",
  description: "The hopper receives raw salt and holds it temporarily before feeding the next machine. Its receiving and discharge arrangement connects material intake with the refinery line.",
  components: [["RECEIVING BODY", "Receives and holds incoming material."], ["DISCHARGE OPENING", "Directs material toward the connected feeding equipment."], ["SUPPORT FRAME", "Supports the hopper at the required installation position."]],
  steps: [["RECEIVE", "Raw material enters the hopper."], ["HOLD", "The hopper provides temporary process storage."], ["FEED", "Material is directed toward the next machine."]],
});
