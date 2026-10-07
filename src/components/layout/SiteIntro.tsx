"use client";

import { useId, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { releaseHeroEntrance } from "./intro-coordination";
import "./site-intro.css";

const INTRO_DURATION = 2.45;

export default function SiteIntro({ force = false, mobileOnly = false }: { force?: boolean; mobileOnly?: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const text = useRef<SVGTextElement>(null);
  const zoom = useRef<SVGGElement>(null);
  const eligible = useRef<boolean | null>(null);
  const [mounted, setMounted] = useState(true);
  const maskId = `intro-${useId().replace(/:/g, "")}`;

  useLayoutEffect(() => {
    const html = document.documentElement;
    const allowedViewport = !mobileOnly || window.matchMedia("(max-width: 767px)").matches;
    if (force && allowedViewport) html.dataset.skIntro = "active";
    eligible.current ??= (force && allowedViewport) || html.dataset.skIntro === "active";
    if (!eligible.current || !root.current || !text.current || !zoom.current) return;

    // Keep the pre-paint decision through React's development effect replay.
    html.dataset.skIntro = "active";
    delete html.dataset.skIntroRevealing;

    const container = root.current;
    const lettering = text.current;
    const transform = zoom.current;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const content = Array.from(document.querySelectorAll<HTMLElement>("#main, [data-navbar], .skip-link"));
    const previousInert = content.map((element) => element.inert);
    content.forEach((element) => { element.inert = true; });

    let disposed = false;
    let finished = false;
    let timeline: gsap.core.Timeline | undefined;
    const frame = { opacity: 0, entryScale: 0.85, progress: 0 };
    let geometry: { width: number; height: number; centerX: number; centerY: number; focusX: number; focusY: number; finalScale: number };

    const restoreInteraction = () => {
      content.forEach((element, index) => { element.inert = previousInert[index]; });
    };
    const finish = () => {
      if (disposed || finished) return;
      finished = true;
      timeline?.kill();
      html.dataset.skIntro = "done";
      restoreInteraction();
      releaseHeroEntrance();
      setMounted(false);
    };
    const render = () => {
      if (!geometry) return;
      const { width, height, centerX, centerY, focusX, focusY, finalScale } = geometry;
      // Interpolating in log space makes a very large final zoom feel gradual.
      const scale = frame.entryScale * Math.pow(finalScale, frame.progress);
      const x = gsap.utils.interpolate(centerX, focusX, frame.progress);
      const y = gsap.utils.interpolate(centerY, focusY, frame.progress);
      transform.setAttribute("transform", `translate(${width / 2} ${height / 2}) scale(${scale}) translate(${-x} ${-y})`);
      lettering.setAttribute("opacity", String(frame.opacity));
    };
    const measure = () => {
      const { width, height } = container.getBoundingClientRect();
      const fontSize = parseFloat(getComputedStyle(lettering).fontSize);
      const bounds = lettering.getBBox();
      // The R (index 5) has a solid left stem in the specified Arial/Helvetica
      // bold face. Zoom into its interior, never into a counter or word space.
      const stem = lettering.getStartPositionOfChar(5);
      geometry = {
        width,
        height,
        centerX: bounds.x + bounds.width / 2,
        centerY: bounds.y + bounds.height / 2,
        focusX: stem.x + fontSize * 0.13,
        focusY: -fontSize * 0.35,
        // A conservative rectangle inside the stem covers every viewport edge.
        finalScale: Math.max(width / (fontSize * 0.07), height / (fontSize * 0.5)) * 1.15,
      };
      render();
    };
    const start = () => {
      if (disposed || finished) return;
      if (motion.matches) { finish(); return; }
      measure();
      timeline = gsap.timeline({ onComplete: finish });
      timeline
        .to(frame, { opacity: 1, entryScale: 1, duration: 0.3, ease: "power2.out", onUpdate: render }, 0.1)
        .to(frame, { progress: 1, duration: INTRO_DURATION - 0.4, ease: "power2.inOut", onUpdate: render }, 0.4)
        // Start Hero content while the final reveal is already opening up.
        .call(releaseHeroEntrance, [], INTRO_DURATION - 0.75)
        // The zoom remains the primary reveal. This synchronized fade guarantees
        // that no residual mask geometry can leave a black frame at the endpoint.
        .to(container, { opacity: 0, duration: 0.5, ease: "power2.in", pointerEvents: "none" }, INTRO_DURATION - 0.5);
    };
    const reduceMotion = () => { if (motion.matches) finish(); };
    const keydown = (event: KeyboardEvent) => { if (event.key === "Escape") finish(); };
    const resize = () => { if (!finished && geometry) measure(); };

    motion.addEventListener("change", reduceMotion);
    window.addEventListener("keydown", keydown);
    window.addEventListener("resize", resize);

    // Decode the image already rendered by Hero; no second image or crop exists.
    const heroImage = document.querySelector<HTMLImageElement>(".hero-image");
    if (motion.matches) {
      finish();
    } else if (!heroImage) {
      start();
    } else {
      void heroImage.decode().then(start).catch(finish);
    }

    return () => {
      disposed = true;
      timeline?.kill();
      motion.removeEventListener("change", reduceMotion);
      window.removeEventListener("keydown", keydown);
      window.removeEventListener("resize", resize);
      lettering.setAttribute("opacity", "0");
      transform.removeAttribute("transform");
      html.dataset.skIntro = "done";
      restoreInteraction();
    };
  }, [force, mobileOnly]);

  if (!mounted) return null;

  return <div ref={root} className="site-intro" aria-hidden="true">
    <svg className="site-intro-mask" width="100%" height="100%" focusable="false">
      <defs>
        <mask id={maskId} x="0" y="0" width="100%" height="100%" maskUnits="userSpaceOnUse" style={{ maskType: "luminance" }}>
          <rect width="100%" height="100%" fill="white" />
          <g ref={zoom}>
            <text ref={text} className="site-intro-text" x="0" y="0" fill="black" opacity="0">SK WORKS</text>
          </g>
        </mask>
      </defs>
      <rect width="100%" height="100%" fill="#0B0D0E" mask={`url(#${maskId})`} />
    </svg>
  </div>;
}
