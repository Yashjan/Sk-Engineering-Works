import { createMachine } from "./create-machine";
export const vibroScreen = createMachine({
  slug: "vibro-screen", name: "Vibro Screen", stageId: "vibro-screen", tagline: "Screening and product classification for salt processing.", identity: "SEPARATE PRODUCT BY THE SCREENING ARRANGEMENT.",
  description: "The vibro screen grades processed salt by particle size. Its feed, screening arrangement and outlets are selected to connect classification with the next product-handling stage.",
  components: [["FEED INLET", "Directs incoming product onto the screening section."], ["SCREENING SECTION", "Provides the surfaces used for product classification."], ["VIBRATION ASSEMBLY", "Provides movement for the screening process."], ["PRODUCT OUTLETS", "Collect and transfer the separated product streams."]],
  steps: [["FEED", "Material enters the screen."], ["CLASSIFY", "Vibration separates material according to the screening arrangement."], ["DISCHARGE", "Separated product streams leave through their respective outlets."]],
});
