"use client";

import { useEffect } from "react";
import type { MachineryItem } from "@/data/machinery";
import { assetPath } from "@/lib/asset-path";

const DEFAULT_PRELOAD_AHEAD = 3;

/** Warms only the next few image assets after their media sequence is visible. */
export function useAdjacentImagePreload(
  items: readonly MachineryItem[],
  activeIndex: number,
  enabled: boolean,
  preloadAhead = DEFAULT_PRELOAD_AHEAD,
) {
  useEffect(() => {
    if (!enabled || items.length < 2) return;

    const preload = () => {
      for (let offset = 1; offset <= Math.min(preloadAhead, items.length - 1); offset += 1) {
        const item = items[(activeIndex + offset) % items.length];
        if (item.mediaType !== "image" || !item.mediaSrc) continue;
        const image = new window.Image();
        image.decoding = "async";
        image.fetchPriority = "low";
        image.src = assetPath(item.mediaSrc);
      }
    };

    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(preload, { timeout: 1200 });
      return () => window.cancelIdleCallback(idleId);
    }

    const timer = globalThis.setTimeout(preload, 250);
    return () => globalThis.clearTimeout(timer);
  }, [activeIndex, enabled, items, preloadAhead]);
}
