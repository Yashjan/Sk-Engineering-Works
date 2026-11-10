import "server-only";
import { isTranslatedLocale, type Locale, type TranslatedLocale } from "../config";
import { plantCopy } from "./salt-refinery-plants.en";
import ar from "./salt-refinery-plants.ar.json";
import hi from "./salt-refinery-plants.hi.json";
import type { PlantCopy } from "./types";

const translations: Readonly<Record<TranslatedLocale, Readonly<Record<string, string>>>> = { hi, ar };

function translateCopy<Value>(value: Value, locale: TranslatedLocale): Value {
  if (typeof value === "string") {
    if (!Object.hasOwn(translations[locale], value)) throw new Error(`Missing ${locale} plant copy: ${value}`);
    return translations[locale][value] as Value;
  }
  return Object.fromEntries(Object.entries(value as object).map(([key, entry]) => [key, translateCopy(entry, locale)])) as Value;
}

export function getPlantCopy(locale: Locale): PlantCopy {
  return isTranslatedLocale(locale) ? translateCopy(plantCopy, locale) : plantCopy;
}
