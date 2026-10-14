"use client";

import { useId, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { releaseHeroEntrance } from "./intro-coordination";
import "./site-intro.css";

const INTRO_DURATION = 2.45;
const R_CHAR_INDEX = 5;
const R_STEM_FOCUS_X = 0.21;
const R_STEM_FOCUS_Y = 0.52;
const R_STEM_ENTRY_HALF_WIDTH = 0.13;
const R_STEM_SAFE_HALF_HEIGHT = 0.38;
const ANCHOR_SETTLE_START = 0.72;
const ANCHOR_SETTLE_END = 0.92;
const CLEAN_REVEAL_START = INTRO_DURATION * 0.6;
const CLEAN_REVEAL_END = INTRO_DURATION * 0.7;
const GLYPH_ZOOM_END = INTRO_DURATION * 0.78;
const HERO_RELEASE_TIME = INTRO_DURATION - 0.3;
const CLEANUP_DURATION = 0.08;
const REVEAL_OVERSCAN = 4;
const REVEAL_START_WIDTH_RATIO = 0.66;

export default function SiteIntro({ force = false, mobileOnly = false }: { force?: boolean; mobileOnly?: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const text = useRef<SVGTextElement>(null);
  const zoom = useRef<SVGGElement>(null);
  const revealShape = useRef<SVGRectElement>(null);
  const eligible = useRef<boolean | null>(null);
  const [mounted, setMounted] = useState(true);
  const maskId = `intro-${useId().replace(/:/g, "")}`;

  useLayoutEffect(() => {
    const html = document.documentElement;
    const allowedViewport = !mobileOnly || window.matchMedia("(max-width: 767px)").matches;
    if (force && allowedViewport) html.dataset.skIntro = "active";
    eligible.current ??= (force && allowedViewport) || html.dataset.skIntro === "active";
    if (!eligible.current || !root.current || !text.current || !zoom.current || !revealShape.current) return;

    // Keep the pre-paint decision through React's development effect replay.
    html.dataset.skIntro = "active";
    delete html.dataset.skIntroRevealing;

    const container = root.current;
    const lettering = text.current;
    const transform = zoom.current;
    const reveal = revealShape.current;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const content = Array.from(document.querySelectorAll<HTMLElement>("#main, [data-navbar], .skip-link"));
    const previousInert = content.map((element) => element.inert);
    content.forEach((element) => { element.inert = true; });

    let disposed = false;
    let finished = false;
    let startFrame = 0;
    let timeline: gsap.core.Timeline | undefined;
    const frame = { opacity: 0, entryScale: 0.85, progress: 0, revealOpacity: 0, revealProgress: 0 };
    let geometry: {
      width: number;
      height: number;
      centerX: number;
      centerY: number;
      focusX: number;
      focusY: number;
      safeGlyphScale: number;
      revealStartWidth: number;
      revealStartHeight: number;
    };

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
      const {
        width,
        height,
        centerX,
        centerY,
        focusX,
        focusY,
        safeGlyphScale,
        revealStartWidth,
        revealStartHeight,
      } = geometry;
      // The approved zoom remains logarithmic, but stops once it is deep in
      // the measured R stem. Clean geometry owns the fullscreen endpoint.
      const scale = frame.entryScale * Math.pow(safeGlyphScale, frame.progress);
      const settleProgress = gsap.utils.clamp(
        0,
        1,
        (frame.progress - ANCHOR_SETTLE_START) / (ANCHOR_SETTLE_END - ANCHOR_SETTLE_START),
      );
      const settledEase = settleProgress * settleProgress * (3 - 2 * settleProgress);
      const settleScale = frame.entryScale * Math.pow(safeGlyphScale, ANCHOR_SETTLE_START);
      const anchoredCoordinate = (center: number, focus: number) => {
        if (frame.progress <= ANCHOR_SETTLE_START) {
          return gsap.utils.interpolate(center, focus, frame.progress);
        }
        const startingScreenOffset = settleScale * (focus - center) * (1 - ANCHOR_SETTLE_START);
        return focus - (startingScreenOffset * (1 - settledEase)) / scale;
      };
      const x = anchoredCoordinate(centerX, focusX);
      const y = anchoredCoordinate(centerY, focusY);
      transform.setAttribute("transform", `translate(${width / 2} ${height / 2}) scale(${scale}) translate(${-x} ${-y})`);
      lettering.setAttribute("opacity", String(frame.opacity));

      const revealWidth = gsap.utils.interpolate(revealStartWidth, width + REVEAL_OVERSCAN * 2, frame.revealProgress);
      const revealHeight = gsap.utils.interpolate(revealStartHeight, height + REVEAL_OVERSCAN * 2, frame.revealProgress);
      reveal.setAttribute("x", String((width - revealWidth) / 2));
      reveal.setAttribute("y", String((height - revealHeight) / 2));
      reveal.setAttribute("width", String(revealWidth));
      reveal.setAttribute("height", String(revealHeight));
      reveal.setAttribute("opacity", String(frame.revealOpacity));
    };
    const measure = () => {
      const { width, height } = container.getBoundingClientRect();
      const bounds = lettering.getBBox();
      const rBounds = lettering.getExtentOfChar(R_CHAR_INDEX);
      if (!width || !height || !bounds.width || !bounds.height || !rBounds.width || !rBounds.height) return false;

      // These ratios describe a conservative solid area inside the measured
      // R's left stem, away from its counter, bowl, and diagonal leg.
      const focusX = rBounds.x + rBounds.width * R_STEM_FOCUS_X;
      const focusY = rBounds.y + rBounds.height * R_STEM_FOCUS_Y;
      const entryStemWidth = rBounds.width * R_STEM_ENTRY_HALF_WIDTH * 2;
      const safeStemHeight = rBounds.height * R_STEM_SAFE_HALF_HEIGHT * 2;
      const safeGlyphScale = Math.max(width / entryStemWidth, height / safeStemHeight) * 1.04;
      geometry = {
        width,
        height,
        centerX: bounds.x + bounds.width / 2,
        centerY: bounds.y + bounds.height / 2,
        focusX,
        focusY,
        safeGlyphScale,
        revealStartWidth: width * REVEAL_START_WIDTH_RATIO,
        revealStartHeight: height + REVEAL_OVERSCAN * 2,
      };
      render();
      return true;
    };
    const start = () => {
      if (disposed || finished) return;
      if (motion.matches) { finish(); return; }
      startFrame = window.requestAnimationFrame(() => {
        if (disposed || finished) return;
        if (!measure()) { finish(); return; }

        timeline = gsap.timeline({ onComplete: finish });
        timeline
          .to(frame, { opacity: 1, entryScale: 1, duration: 0.3, ease: "power2.out", onUpdate: render }, 0.1)
          .to(frame, { progress: 1, duration: GLYPH_ZOOM_END - 0.4, ease: "power2.inOut", onUpdate: render }, 0.4)
          // The clean rectangle activates while it is hidden inside the solid
          // R stem, then takes ownership of the fullscreen opening.
          .call(() => {
            frame.opacity = 0;
            frame.revealOpacity = 1;
            render();
          }, [], CLEAN_REVEAL_START)
          .to(frame, {
            revealProgress: 1,
            duration: CLEAN_REVEAL_END - CLEAN_REVEAL_START,
            ease: "power2.inOut",
            onUpdate: render,
          }, CLEAN_REVEAL_START)
          .call(releaseHeroEntrance, [], HERO_RELEASE_TIME)
          // At this point the mask is already fully open; this only removes the
          // inert SVG layer without hiding any residual glyph geometry.
          .to(container, {
            opacity: 0,
            duration: CLEANUP_DURATION,
            ease: "none",
            pointerEvents: "none",
          }, INTRO_DURATION - CLEANUP_DURATION);
      });
    };
    const reduceMotion = () => { if (motion.matches) finish(); };
    const keydown = (event: KeyboardEvent) => { if (event.key === "Escape") finish(); };
    const resize = () => { if (!finished && geometry) measure(); };

    motion.addEventListener("change", reduceMotion);
    window.addEventListener("keydown", keydown);
    window.addEventListener("resize", resize);
    window.visualViewport?.addEventListener("resize", resize);

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
      window.cancelAnimationFrame(startFrame);
      timeline?.kill();
      motion.removeEventListener("change", reduceMotion);
      window.removeEventListener("keydown", keydown);
      window.removeEventListener("resize", resize);
      window.visualViewport?.removeEventListener("resize", resize);
      lettering.setAttribute("opacity", "0");
      reveal.setAttribute("opacity", "0");
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
          <rect ref={revealShape} x="0" y="0" width="0" height="0" fill="black" opacity="0" />
        </mask>
      </defs>
      <rect width="100%" height="100%" fill="#0B0D0E" mask={`url(#${maskId})`} />
    </svg>
  </div>;
}
