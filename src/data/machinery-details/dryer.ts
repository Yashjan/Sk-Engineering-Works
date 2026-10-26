import { createMachine } from "./create-machine";
export const dryer = createMachine({
  slug: "dryer", name: "Dryer", stageId: "dryer", tagline: "Controlled drying for processed salt.", identity: "PREPARE THE PRODUCT FOR DOWNSTREAM HANDLING.",
  description: "The dryer reduces remaining moisture in processed salt through controlled drying. Feed, air handling and discharge arrangements are coordinated with the surrounding process equipment.",
  components: [["FEED CONNECTION", "Receives moist processed salt."], ["DRYING SECTION", "Contains the stage where heat and airflow support moisture removal."], ["AIR CONNECTIONS", "Connect the drying stage to its air-handling system."], ["DISCHARGE CONNECTION", "Transfers dried product to the next machine."]],
  steps: [["FEED", "Moist processed salt enters the dryer."], ["DRY", "Controlled airflow and heat remove remaining moisture."], ["DISCHARGE", "Dried salt moves toward downstream handling."]],
});
