import { screwConveyor } from "./screw-conveyor";
import { screwWasher } from "./screw-washer";
import type { MachineryConfig } from "./types";
export const machineryDetails: Readonly<Record<string, MachineryConfig>> = {
  [screwConveyor.slug]: screwConveyor,
  [screwWasher.slug]: screwWasher,
};
export function getMachineryDetail(slug: string) { return Object.hasOwn(machineryDetails, slug) ? machineryDetails[slug] : undefined; }
export type { MachineryConfig } from "./types";
