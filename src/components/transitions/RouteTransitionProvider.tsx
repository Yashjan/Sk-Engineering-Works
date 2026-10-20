"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import RouteTransitionOverlay, { type RouteTransitionOverlayHandle } from "./RouteTransitionOverlay";

export type RouteTransitionPhase = "idle" | "covering" | "covered" | "navigating" | "revealing";
type NavigateOptions = { replace?: boolean; scroll?: boolean };
type Destination = NavigateOptions & { href: string; path: string; hash: string };
type LenisController = {
  start?: () => void;
  stop?: () => void;
  scrollTo?: (
    target: number | string | HTMLElement,
    options?: { immediate?: boolean; force?: boolean },
  ) => void;
};
type RouteTransitionContextValue = {
  phase: RouteTransitionPhase;
  navigateWithTransition: (href: string, options?: NavigateOptions) => boolean;
};

const RouteTransitionContext = createContext<RouteTransitionContextValue | null>(null);
const ASSET_PATH = /\.(?:avif|css|csv|docx?|gif|jpe?g|json|mp3|mp4|pdf|png|svg|txt|webm|webp|xlsx?|zip)$/i;

function normalizePath(pathname: string) {
  const normalized = pathname.replace(/\/+$/, "");
  return normalized || "/";
}

function currentLenis() {
  return (window as Window & { __lenis?: LenisController }).__lenis;
}

export function useRouteTransition() {
  const context = useContext(RouteTransitionContext);
  if (!context) throw new Error("useRouteTransition must be used inside RouteTransitionProvider.");
  return context;
}

export default function RouteTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const overlayRef = useRef<RouteTransitionOverlayHandle>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const phaseRef = useRef<RouteTransitionPhase>("idle");
  const pendingRef = useRef<Destination | null>(null);
  const settleFramesRef = useRef<number[]>([]);
  const previousInertRef = useRef(false);
  const [phase, setPhaseState] = useState<RouteTransitionPhase>("idle");

  const setPhase = useCallback((nextPhase: RouteTransitionPhase) => {
    phaseRef.current = nextPhase;
    setPhaseState(nextPhase);
  }, []);

  const clearSettleFrames = useCallback(() => {
    settleFramesRef.current.forEach((frame) => cancelAnimationFrame(frame));
    settleFramesRef.current = [];
  }, []);

  const parseDestination = useCallback((href: string): Destination | null => {
    const url = new URL(href, window.location.href);
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH?.replace(/\/$/, "") ?? "";
    if (url.origin !== window.location.origin) return null;
    if (basePath && url.pathname !== basePath && !url.pathname.startsWith(`${basePath}/`)) return null;
    const appPath = basePath ? url.pathname.slice(basePath.length) || "/" : url.pathname;
    return {
      href: `${appPath}${url.search}${url.hash}`,
      path: normalizePath(appPath),
      hash: url.hash,
    };
  }, []);

  const finishTransition = useCallback(() => {
    pendingRef.current = null;
    clearSettleFrames();
    document.documentElement.removeAttribute("data-route-transition");
    if (contentRef.current) contentRef.current.inert = previousInertRef.current;
    currentLenis()?.start?.();
    setPhase("idle");
  }, [clearSettleFrames, setPhase]);

  const revealDestination = useCallback(() => {
    if (phaseRef.current !== "navigating") return;
    clearSettleFrames();
    const firstFrame = requestAnimationFrame(() => {
      const secondFrame = requestAnimationFrame(() => {
        const destination = pendingRef.current;
        if (!destination) {
          finishTransition();
          return;
        }
        if (destination.scroll !== false) {
          const lenis = currentLenis();
          if (destination.hash) {
            const target = document.getElementById(decodeURIComponent(destination.hash.slice(1)));
            if (target && lenis?.scrollTo) lenis.scrollTo(target, { immediate: true, force: true });
            else target?.scrollIntoView();
          } else {
            if (lenis?.scrollTo) lenis.scrollTo(0, { immediate: true, force: true });
            else window.scrollTo({ top: 0, left: 0, behavior: "auto" });
          }
        }
        setPhase("revealing");
        overlayRef.current?.reveal(finishTransition);
      });
      settleFramesRef.current.push(secondFrame);
    });
    settleFramesRef.current.push(firstFrame);
  }, [clearSettleFrames, finishTransition, setPhase]);

  const startTransition = useCallback((destination: Destination, options: NavigateOptions = {}) => {
    if (phaseRef.current !== "idle" || !overlayRef.current) return false;
    if (destination.path === normalizePath(pathname)) return false;

    pendingRef.current = { ...destination, ...options };
    document.documentElement.dataset.routeTransition = "active";
    if (contentRef.current) {
      previousInertRef.current = contentRef.current.inert;
      contentRef.current.inert = true;
    }
    currentLenis()?.stop?.();
    setPhase("covering");
    overlayRef.current.cover(() => {
      if (phaseRef.current !== "covering" || !pendingRef.current) return;
      setPhase("covered");
      setPhase("navigating");
      const navigation = pendingRef.current;
      const routerOptions = { scroll: false };
      if (navigation.replace) router.replace(navigation.href, routerOptions);
      else router.push(navigation.href, routerOptions);
    });
    return true;
  }, [pathname, router, setPhase]);

  const navigateWithTransition = useCallback((href: string, options: NavigateOptions = {}) => {
    const destination = parseDestination(href);
    if (!destination) return false;
    return startTransition(destination, options);
  }, [parseDestination, startTransition]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const eventTarget = event.target;
      if (!(eventTarget instanceof Element)) return;
      const anchor = eventTarget.closest<HTMLAnchorElement>("a[href]");
      if (!anchor || (anchor.target && anchor.target !== "_self") || anchor.hasAttribute("download") || anchor.dataset.noRouteTransition !== undefined) return;

      const rawHref = anchor.getAttribute("href");
      if (!rawHref || rawHref.startsWith("#") || /^(?:mailto:|tel:|sms:|javascript:)/i.test(rawHref)) return;
      const destination = parseDestination(anchor.href);
      if (!destination || ASSET_PATH.test(destination.path) || destination.path === normalizePath(pathname)) return;

      event.preventDefault();
      if (phaseRef.current !== "idle") return;
      startTransition(destination);
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [parseDestination, pathname, startTransition]);

  useEffect(() => {
    if (phaseRef.current === "navigating" && pendingRef.current?.path === normalizePath(pathname)) {
      revealDestination();
    }
  }, [pathname, revealDestination]);

  useEffect(() => () => {
    clearSettleFrames();
    document.documentElement.removeAttribute("data-route-transition");
    currentLenis()?.start?.();
  }, [clearSettleFrames]);

  const contextValue = useMemo(() => ({ phase, navigateWithTransition }), [navigateWithTransition, phase]);

  return (
    <RouteTransitionContext.Provider value={contextValue}>
      <div ref={contentRef} data-route-content>{children}</div>
      <RouteTransitionOverlay ref={overlayRef} />
    </RouteTransitionContext.Provider>
  );
}
