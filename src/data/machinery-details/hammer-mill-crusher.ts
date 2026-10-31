import { createMachine } from "./create-machine";
export const hammerMillCrusher = createMachine({
  slug: "hammer-mill-crusher", name: "Hammer Mill / Crusher", image: "/images/process/Hammer-mill.png", tagline: "Material size reduction for downstream processing.", identity: "PREPARE MATERIAL FOR THE NEXT STAGE.",
  description: "The hammer mill / crusher reduces larger material pieces before subsequent processing. Its feed, drive and discharge arrangements are selected around the material and plant requirement.",
  components: [["FEED SECTION", "Receives material for size reduction."], ["PROCESSING CHAMBER", "Contains the crushing mechanism."], ["DRIVE ASSEMBLY", "Provides movement for the crushing stage."], ["DISCHARGE SECTION", "Transfers reduced material to the next stage."]],
  steps: [["FEED", "Material enters the processing chamber."], ["REDUCE", "The crushing mechanism reduces larger pieces."], ["DISCHARGE", "Reduced material leaves for downstream handling."]],
});
