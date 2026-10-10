"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import type { MachineryItem } from "@/data/machinery";

export const SEARCH_SELECTION_HOLD_MS = 3500;

type CategoryRegistration = {
  categorySlug: string;
  section: HTMLElement;
  focusTarget: HTMLElement | null;
  activateMachine: (machineId: string, holdMs: number) => void;
};

type MachineryDirectoryValue = {
  registerCategory: (registration: CategoryRegistration) => () => void;
  activateSearchResult: (machine: MachineryItem) => boolean;
  searchInteracting: boolean;
  setSearchInteracting: (interacting: boolean) => void;
};

const MachineryDirectoryContext = createContext<MachineryDirectoryValue | null>(null);

export function MachineryDirectory({ children }: { children: ReactNode }) {
  const categories = useRef(new Map<string, CategoryRegistration>());
  const [searchInteracting, setSearchInteracting] = useState(false);

  const registerCategory = useCallback((registration: CategoryRegistration) => {
    categories.current.set(registration.categorySlug, registration);
    return () => {
      if (categories.current.get(registration.categorySlug) === registration) {
        categories.current.delete(registration.categorySlug);
      }
    };
  }, []);

  const activateSearchResult = useCallback((machine: MachineryItem) => {
    const category = categories.current.get(machine.categorySlug);
    if (!category) return false;

    category.activateMachine(machine.id, SEARCH_SELECTION_HOLD_MS);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    category.section.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    requestAnimationFrame(() => category.focusTarget?.focus({ preventScroll: true }));
    return true;
  }, []);

  const value = useMemo(() => ({
    registerCategory,
    activateSearchResult,
    searchInteracting,
    setSearchInteracting,
  }), [activateSearchResult, registerCategory, searchInteracting]);

  return <MachineryDirectoryContext.Provider value={value}>{children}</MachineryDirectoryContext.Provider>;
}

export function useMachineryDirectory() {
  const value = useContext(MachineryDirectoryContext);
  if (!value) throw new Error("useMachineryDirectory must be used inside MachineryDirectory");
  return value;
}
