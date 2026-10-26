import { createMachine } from "./create-machine";
export const idFanBlower = createMachine({
  slug: "id-fan-blower", name: "ID Fan / Blower", stageId: "id-fan-blower", tagline: "Controlled airflow for industrial process systems.", identity: "MOVE AIR THROUGH A CONNECTED SYSTEM.",
  description: "The ID fan moves process air through the drying and air-handling system. Inlet, discharge and duct connections are coordinated with the complete plant arrangement.",
  realMedia: [{ type: "image", src: "/images/salt-refinery/execution/fabrication-blower.jpeg", alt: "S.K. Engineering Works ID fan / blower in the fabrication workshop", caption: "ID FAN / BLOWER — WORKSHOP FABRICATION" }],
  components: [["FAN HOUSING", "Contains the airflow path through the fan."], ["ROTATING ASSEMBLY", "Produces the movement used to transfer air."], ["DRIVE ASSEMBLY", "Powers the rotating fan mechanism."], ["DUCT CONNECTIONS", "Connect the fan to the process air system."]],
  steps: [["DRAW", "The fan creates process airflow."], ["MOVE", "Air moves through the connected duct system."], ["TRANSFER", "Air continues toward the designed downstream system."]],
});
