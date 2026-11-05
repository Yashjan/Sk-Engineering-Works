"use client";

import type { ReactNode } from "react";
import hi from "@/i18n/dictionaries/hi.json";
import LocaleRuntime from "./LocaleRuntime";

export default function HindiLocaleRuntime({ children }: { children: ReactNode }) {
  return <LocaleRuntime locale="hi" dictionary={hi}>{children}</LocaleRuntime>;
}
