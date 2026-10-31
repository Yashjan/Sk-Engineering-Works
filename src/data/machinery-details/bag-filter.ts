import { createMachine } from "./create-machine";
export const bagFilter = createMachine({
  slug: "bag-filter", name: "Bag Filter", image: "/images/process/Bag-filter.png", tagline: "Dust collection for connected industrial air systems.", identity: "COLLECT DUST FROM THE PROCESS AIR STREAM.",
  description: "The bag filter collects particulate material from a connected airflow. Its housing, filter arrangement and duct connections are planned around the air-handling application.",
  components: [["FILTER HOUSING", "Contains the filtration stage."], ["FILTER ELEMENTS", "Separate particulate material from the airflow."], ["AIR CONNECTIONS", "Connect the filter to the process duct system."], ["COLLECTION SECTION", "Receives separated material."]],
  steps: [["RECEIVE", "Dust-carrying air enters the filter housing."], ["FILTER", "Air passes through the filtration stage."], ["COLLECT", "Separated material is collected for appropriate handling."]],
});
