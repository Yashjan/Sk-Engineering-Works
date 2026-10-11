"use client";

import { useEffect, useState, type RefObject } from "react";

export function useTheatreEnvironment(sectionRef: RefObject<HTMLElement | null>) {
  const [sectionVisible, setSectionVisible] = useState(false);
  const [autoplayVisible, setAutoplayVisible] = useState(false);
  const [desktopInput, setDesktopInput] = useState(false);
  const [motionAllowed, setMotionAllowed] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      setSectionVisible(entry.isIntersecting);
      // A tall theatre cannot occupy 40% of its own height on a short laptop.
      // Measure how much of the available viewport it occupies instead.
      const referenceHeight = Math.min(entry.boundingClientRect.height, window.innerHeight);
      setAutoplayVisible(entry.isIntersecting && referenceHeight > 0 && entry.intersectionRect.height / referenceHeight >= 0.4);
    }, { threshold: Array.from({ length: 21 }, (_, index) => index / 20) });
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 768px)");
    const update = () => { setMotionAllowed(!motion.matches); setDesktopInput(desktop.matches); };
    const visibility = () => setTabVisible(document.visibilityState === "visible");
    observer.observe(section);
    update();
    visibility();
    motion.addEventListener("change", update);
    desktop.addEventListener("change", update);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      observer.disconnect();
      motion.removeEventListener("change", update);
      desktop.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [sectionRef]);

  return { sectionVisible, autoplayVisible, desktopInput, motionAllowed, tabVisible };
}
