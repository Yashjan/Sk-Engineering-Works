import { createMachine } from "./create-machine";
export const portableBeltConveyor = createMachine({
  slug: "portable-belt-conveyor", name: "Portable Belt Conveyor", tagline: "Mobile material transfer for changing loading positions.", identity: "TRANSFER WHERE THE WORK NEEDS IT.",
  description: "A portable belt conveyor provides a movable transfer point for material handling. Its placement and connections are discussed around the required loading and discharge locations.",
  components: [["CONVEYOR BELT", "Carries material between loading and discharge points."], ["DRIVE SECTION", "Provides belt movement."], ["MOBILE SUPPORT FRAME", "Supports repositioning of the transfer equipment."]],
  steps: [["POSITION", "The conveyor is positioned for the required transfer."], ["LOAD & TRANSFER", "Material is loaded onto the moving belt."], ["DISCHARGE", "Material leaves at the selected discharge point."]],
});
