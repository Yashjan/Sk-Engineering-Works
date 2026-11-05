import { createContext, useContext } from "react";
import type { Locale } from "./config";

export type LocaleContextValue = { locale: Locale; translate: (value: string) => string };
export const identity = (value: string) => value;
export const LocaleContext = createContext<LocaleContextValue>({ locale: "en", translate: identity });

// Kept free of dictionary imports so English pages never download the Hindi
// or Arabic translation tables just to read the (identity) translator.
export function useLocaleTranslation() { return useContext(LocaleContext); }
