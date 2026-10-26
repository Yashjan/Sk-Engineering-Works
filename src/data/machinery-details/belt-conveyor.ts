import { createMachine } from "./create-machine";
export const beltConveyor = createMachine({
  slug: "belt-conveyor", name: "Belt Conveyor", stageId: "belt-conveyor", tagline: "Continuous material transfer across process sections.", identity: "CONNECT THE FEED TO THE NEXT STAGE.",
  description: "A moving belt transfers raw salt between receiving and processing equipment. Feed points, discharge position and support arrangement are planned around the plant layout.",
  components: [["CONVEYOR BELT", "Carries material along the transfer route."], ["DRIVE & PULLEYS", "Provide and guide belt movement."], ["SUPPORT / FRAME", "Supports the belt and defines the equipment arrangement."]],
  steps: [["FEED", "Material is loaded onto the belt."], ["TRANSFER", "The moving belt carries material continuously."], ["DISCHARGE", "Material transfers into the next process stage."]],
});
