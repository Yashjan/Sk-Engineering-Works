import { createMachine } from "./create-machine";
export const bucketElevator = createMachine({
  slug: "bucket-elevator", name: "Bucket Elevator", stageId: "bucket-elevator", tagline: "Vertical material transfer for process lines.", identity: "MOVE MATERIAL BETWEEN PROCESS LEVELS.",
  description: "The bucket elevator lifts dried salt to the next process level. Its loading and discharge points connect equipment at different heights, including the downstream screening stage.",
  components: [["LOWER LOADING SECTION", "Receives material at the lower transfer point."], ["BUCKET ASSEMBLY", "Carries material upward through the elevator."], ["DRIVE SECTION", "Provides movement for the lifting mechanism."], ["UPPER DISCHARGE", "Transfers material to equipment at the next level."]],
  steps: [["LOAD", "Material enters the lower section."], ["LIFT", "Buckets carry material vertically."], ["DISCHARGE", "Material exits at the upper transfer point."]],
});
