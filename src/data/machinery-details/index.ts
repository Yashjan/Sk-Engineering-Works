import { hopper } from "./hopper";
import { beltConveyor } from "./belt-conveyor";
import { wetMill } from "./wet-mill";
import { processTanks } from "./process-tanks";
import { thickener } from "./thickener";
import { centrifuge } from "./centrifuge";
import { dryer } from "./dryer";
import { bucketElevator } from "./bucket-elevator";
import { vibroScreen } from "./vibro-screen";
import { pinMill } from "./pin-mill";
import { cyclone } from "./cyclone";
import { idFanBlower } from "./id-fan-blower";
import { rollerCrusher } from "./roller-crusher";
import { portableBeltConveyor } from "./portable-belt-conveyor";
import { hammerMillCrusher } from "./hammer-mill-crusher";
import { bagFilter } from "./bag-filter";
import { storageSilos } from "./storage-silos";
import { screwConveyor } from "./screw-conveyor";
import { screwWasher } from "./screw-washer";
import type { MachineryConfig } from "./types";
export const machineryDetails: Readonly<Record<string, MachineryConfig>> = {
  [screwConveyor.slug]: screwConveyor,
  [screwWasher.slug]: screwWasher,
  [hopper.slug]: hopper,
  [beltConveyor.slug]: beltConveyor,
  [wetMill.slug]: wetMill,
  [processTanks.slug]: processTanks,
  [thickener.slug]: thickener,
  [centrifuge.slug]: centrifuge,
  [dryer.slug]: dryer,
  [bucketElevator.slug]: bucketElevator,
  [vibroScreen.slug]: vibroScreen,
  [pinMill.slug]: pinMill,
  [cyclone.slug]: cyclone,
  [idFanBlower.slug]: idFanBlower,
  [rollerCrusher.slug]: rollerCrusher,
  [portableBeltConveyor.slug]: portableBeltConveyor,
  [hammerMillCrusher.slug]: hammerMillCrusher,
  [bagFilter.slug]: bagFilter,
  [storageSilos.slug]: storageSilos,

};
export function getMachineryDetail(slug: string) { return Object.hasOwn(machineryDetails, slug) ? machineryDetails[slug] : undefined; }
export type { MachineryConfig } from "./types";
