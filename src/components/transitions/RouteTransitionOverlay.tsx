"use client";

import { forwardRef, useImperativeHandle, useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { assetPath } from "@/lib/asset-path";
import "./route-transition.css";

export type RouteTransitionOverlayHandle = {
  cover: (onCovered: () => void) => void;
  reveal: (onComplete: () => void) => void;
};

const RouteTransitionOverlay = forwardRef<RouteTransitionOverlayHandle>(function RouteTransitionOverlay(_, forwardedRef) {
  const root = useRef<HTMLDivElement>(null);
  const brand = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLSpanElement>(null);
  const coverRef = useRef<(onCovered: () => void) => void>(() => undefined);
  const revealRef = useRef<(onComplete: () => void) => void>(() => undefined);

  useImperativeHandle(forwardedRef, () => ({
    cover: (onCovered) => coverRef.current(onCovered),
    reveal: (onComplete) => revealRef.current(onComplete),
  }), []);

  useLayoutEffect(() => {
    const overlay = root.current;
    const wordmark = brand.current;
    const rule = line.current;
    if (!overlay || !wordmark || !rule) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    gsap.set(overlay, { autoAlpha: 0, yPercent: 100 });
    gsap.set(wordmark, { opacity: 0, y: 8 });
    gsap.set(rule, { scaleX: 0, transformOrigin: "left center" });

    const coverTimeline = gsap.timeline({ paused: true })
      .set(overlay, { autoAlpha: 1, yPercent: 100 })
      .set(wordmark, { opacity: 0, y: 8 })
      .set(rule, { scaleX: 0 })
      .to(overlay, { yPercent: 0, duration: 0.2, ease: "power2.inOut" }, 0)
      .to(wordmark, { opacity: 1, y: 0, duration: 0.14, ease: "power2.out" }, 0.06)
      .to(rule, { scaleX: 0.72, duration: 0.2, ease: "power1.out" }, 0);

    const revealTimeline = gsap.timeline({ paused: true })
      .to(rule, { scaleX: 1, duration: 0.1, ease: "power2.out" }, 0)
      .to(wordmark, { opacity: 0, y: -4, duration: 0.08, ease: "power1.in" }, 0.08)
      .to(overlay, { yPercent: -100, duration: 0.28, ease: "power2.inOut" }, 0.1);

    const reducedCoverTimeline = gsap.timeline({ paused: true })
      .set(overlay, { autoAlpha: 1, yPercent: 0, opacity: 0 })
      .set(wordmark, { opacity: 1, y: 0 })
      .set(rule, { scaleX: 0, transformOrigin: "left center" })
      .to(overlay, { opacity: 1, duration: 0.1, ease: "none" }, 0)
      .to(rule, { scaleX: 0.72, duration: 0.1, ease: "none" }, 0);

    const reducedRevealTimeline = gsap.timeline({ paused: true })
      .to(rule, { scaleX: 1, duration: 0.06, ease: "none" }, 0)
      .to(overlay, { opacity: 0, duration: 0.14, ease: "none" }, 0.06);

    const timelines = [coverTimeline, revealTimeline, reducedCoverTimeline, reducedRevealTimeline];
    const pauseAll = () => timelines.forEach((timeline) => timeline.pause());

    coverRef.current = (onCovered) => {
      pauseAll();
      const timeline = reducedMotion.matches ? reducedCoverTimeline : coverTimeline;
      timeline.eventCallback("onComplete", onCovered).restart();
    };

    revealRef.current = (onComplete) => {
      pauseAll();
      const timeline = reducedMotion.matches ? reducedRevealTimeline : revealTimeline;
      timeline.eventCallback("onComplete", () => {
        gsap.set(overlay, { autoAlpha: 0, yPercent: 100, opacity: 1 });
        gsap.set(wordmark, { opacity: 0, y: 8 });
        gsap.set(rule, { scaleX: 0, transformOrigin: "left center" });
        onComplete();
      }).restart();
    };

    return () => {
      timelines.forEach((timeline) => timeline.kill());
      coverRef.current = () => undefined;
      revealRef.current = () => undefined;
    };
  }, []);

  return (
    <div ref={root} className="route-transition-overlay" aria-hidden="true">
      <div className="route-transition-brand">
        <div ref={brand} className="route-transition-identity">
          <Image
            src={assetPath("/images/sk-logo.png")}
            alt=""
            width={160}
            height={64}
            className="route-transition-logo"
          />
          <span>SK WORKS</span>
        </div>
        <span className="route-transition-progress">
          <span ref={line} className="route-transition-line" />
        </span>
      </div>
    </div>
  );
});

export default RouteTransitionOverlay;
