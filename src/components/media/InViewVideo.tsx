"use client";
/** @jsxImportSource @/i18n/react */

import { useEffect, useRef, type ComponentPropsWithoutRef } from "react";
import ProgressiveVideo from "./ProgressiveVideo";

/**
 * Muted, looping ambient video that only plays while it is on screen.
 *
 * A bare `autoPlay` attribute makes browsers download the whole file during
 * page load even when the video sits far below the fold. This keeps the same
 * visual behaviour (plays when visible, loops) while deferring the download
 * until the viewer scrolls near it, and leaves it paused on its first frame /
 * poster for people who prefer reduced motion.
 */
export default function InViewVideo(props: Omit<ComponentPropsWithoutRef<"video">, "autoPlay" | "muted">) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const sync = () => {
      if (visible && !reduceMotion.matches) void video.play().catch(() => {});
      else video.pause();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    }, { rootMargin: "200px 0px", threshold: 0.15 });
    observer.observe(video);
    reduceMotion.addEventListener("change", sync);
    return () => {
      observer.disconnect();
      reduceMotion.removeEventListener("change", sync);
    };
  }, []);

  return <ProgressiveVideo ref={ref} muted loop playsInline preload="metadata" {...props} />;
}
