import { createContext } from "react";
import type { Locale } from "./config";

export type LocaleContextValue = { locale: Locale; translate: (value: string) => string };
export const identity = (value: string) => value;
export const LocaleContext = createContext<LocaleContextValue>({ locale: "en", translate: identity });
