import "server-only";
import type { MachineryConfig } from "@/data/machinery-details/types";
import { isTranslatedLocale, type Locale, type TranslatedLocale } from "../config";
import beltConveyorAr from "./belt-conveyor.ar.json";
import beltConveyorHi from "./belt-conveyor.hi.json";
import screwConveyorAr from "./screw-conveyor.ar.json";
import screwConveyorHi from "./screw-conveyor.hi.json";

type MachineCopy = Readonly<Record<string, string>>;

// Long machine copy is resolved on the server at build time, so it reaches each page only in that
// page's language and never enters a client bundle. Short labels stay in the shared dictionaries.
const machineCopy: Readonly<Record<string, Record<TranslatedLocale, MachineCopy>>> = {
  "belt-conveyor": { hi: beltConveyorHi, ar: beltConveyorAr },
  "screw-conveyor": { hi: screwConveyorHi, ar: screwConveyorAr },
};

export function localizeMachine(machine: MachineryConfig, locale: Locale): MachineryConfig {
  if (!isTranslatedLocale(locale) || !Object.hasOwn(machineCopy, machine.slug)) return machine;
  const copy = machineCopy[machine.slug][locale];
  // A missing sentence fails the build instead of shipping English on a translated page.
  const text = (source: string) => {
    if (!Object.hasOwn(copy, source)) throw new Error(`Missing ${locale} copy for ${machine.slug}: ${source}`);
    return copy[source];
  };
  const describe = <Item extends { description: string }>(items: Item[]) => items.map((item) => ({ ...item, description: text(item.description) }));
  return {
    ...machine,
    tagline: text(machine.tagline),
    description: text(machine.description),
    seo: { title: text(machine.seo.title), description: text(machine.seo.description) },
    ...(machine.hero ? { hero: { ...machine.hero, alt: text(machine.hero.alt) } } : {}),
    identity: { ...machine.identity, copy: text(machine.identity.copy) },
    components: describe(machine.components),
    howItWorks: describe(machine.howItWorks),
    customization: describe(machine.customization),
    process: { ...machine.process, description: text(machine.process.description) },
    engineering: { ...machine.engineering, description: text(machine.engineering.description) },
    enquiry: { ...machine.enquiry, ...(machine.enquiry.description ? { description: text(machine.enquiry.description) } : {}) },
    ...(machine.fabrication ? { fabrication: { ...machine.fabrication, note: text(machine.fabrication.note) } } : {}),
  };
}
