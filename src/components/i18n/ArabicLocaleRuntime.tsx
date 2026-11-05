"use client";

import type { ReactNode } from "react";
import ar from "@/i18n/dictionaries/ar.json";
import LocaleRuntime from "./LocaleRuntime";

export default function ArabicLocaleRuntime({ children }: { children: ReactNode }) {
  return <LocaleRuntime locale="ar" dictionary={ar}>{children}</LocaleRuntime>;
}
