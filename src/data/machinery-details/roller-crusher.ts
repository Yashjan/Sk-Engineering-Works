import { createMachine } from "./create-machine";
export const rollerCrusher = createMachine({
  slug: "roller-crusher", name: "Roller Crusher", stageId: "roller-crusher", tagline: "Controlled size reduction for salt processing.", identity: "BREAK DOWN OVERSIZED MATERIAL.",
  description: "The roller crusher breaks larger salt pieces into smaller material for further processing. Feed and discharge connections are planned around the product-handling arrangement.",
  components: [["FEED OPENING", "Directs incoming material toward the rollers."], ["CRUSHING ROLLERS", "Reduce the size of larger material pieces."], ["DRIVE ASSEMBLY", "Provides movement for crushing."], ["DISCHARGE SECTION", "Transfers reduced material to downstream equipment."]],
  steps: [["FEED", "Material enters between the crushing rollers."], ["CRUSH", "Rotating rollers reduce larger material pieces."], ["DISCHARGE", "Reduced material exits for further processing."]],
});
