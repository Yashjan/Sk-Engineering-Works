import { createMachine } from "./create-machine";
export const pinMill = createMachine({
  slug: "pin-mill", name: "Pin Mill", stageId: "pin-mill", tagline: "Fine grinding for powdered salt production.", identity: "FROM GRADED PRODUCT TO FINER MATERIAL.",
  description: "The pin mill reduces salt particle size for a finer product. Its feed and discharge arrangements connect grinding with downstream collection and product handling.",
  components: [["FEED INLET", "Introduces product into the grinding chamber."], ["GRINDING CHAMBER", "Contains the rotating elements used for particle-size reduction."], ["DRIVE ASSEMBLY", "Provides movement for grinding."], ["PRODUCT DISCHARGE", "Connects the ground material to downstream handling."]],
  steps: [["FEED", "Product enters the grinding chamber."], ["GRIND", "Rotating elements reduce particle size."], ["DISCHARGE", "Fine product exits for downstream collection and handling."]],
});
