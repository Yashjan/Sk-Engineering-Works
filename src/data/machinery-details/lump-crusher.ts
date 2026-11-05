import { createMachine } from "./create-machine";

export const lumpCrusher = createMachine({
  slug: "lump-crusher",
  name: "Lump Crusher",
  image: "/images/machinery/catalog/lump-crusher.webp",
  tagline: "Crush large particles into smaller particles for downstream processing.",
  identity: "REDUCE LARGE PARTICLES BEFORE THE NEXT PROCESS.",
  description: "The lump crusher breaks large material particles into smaller particles so they can move more consistently into the next processing or material-handling stage.",
  components: [
    ["FEED OPENING", "Receives large particles from the upstream process."],
    ["CRUSHING CHAMBER", "Contains the mechanism that breaks down larger material."],
    ["DRIVE ASSEMBLY", "Provides the movement required for crushing."],
    ["DISCHARGE SECTION", "Directs the smaller particles into the downstream stage."],
  ],
  steps: [
    ["FEED", "Large particles enter through the feed opening."],
    ["CRUSH", "The crushing mechanism breaks the material into smaller particles."],
    ["DISCHARGE", "Reduced material exits for further processing or handling."],
  ],
});
