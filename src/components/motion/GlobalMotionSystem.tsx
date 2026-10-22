"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "lenis/dist/lenis.css";
import "./global-motion.css";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

gsap.registerPlugin(ScrollTrigger);

export default function GlobalMotionSystem() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    if (window.__lenis) return;

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      syncTouch: false,
      touchMultiplier: 1,
      anchors: { duration: 0.9 },
      stopInertiaOnNavigate: true,
      respectReducedMotion: true,
      autoRaf: false,
      prevent: (node) => node.closest("[data-lenis-prevent]") !== null,
    });
    const updateScrollTrigger = () => ScrollTrigger.update();
    const tick = (time: number) => lenis.raf(time * 1000);

    window.__lenis = lenis;
    lenis.on("scroll", updateScrollTrigger);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.off("scroll", updateScrollTrigger);
      lenis.destroy();
      if (window.__lenis === lenis) delete window.__lenis;
    };
  }, []);

  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    const refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const revealUp = gsap.utils.toArray<HTMLElement>('[data-motion="reveal-up"]');
      const labels = gsap.utils.toArray<HTMLElement>('[data-motion="section-label"]');
      const lines = gsap.utils.toArray<HTMLElement>('[data-motion="line-reveal"]');
      const mediaScale = gsap.utils.toArray<HTMLElement>('[data-motion="media-scale"]');

      revealUp.forEach((element) => {
        gsap.fromTo(element, { autoAlpha: 0, y: 30 }, {
          autoAlpha: 1,
          y: 0,
          duration: 0.85,
          ease: "power3.out",
          clearProps: "willChange",
          onStart: () => { element.style.willChange = "transform, opacity"; },
          scrollTrigger: { trigger: element, start: "top 86%", once: true },
        });
      });

      labels.forEach((element) => {
        gsap.fromTo(element, { autoAlpha: 0, y: 12 }, {
          autoAlpha: 1,
          y: 0,
          duration: 0.65,
          ease: "power3.out",
          clearProps: "willChange",
          onStart: () => { element.style.willChange = "transform, opacity"; },
          scrollTrigger: { trigger: element, start: "top 88%", once: true },
        });
      });

      lines.forEach((element) => {
        gsap.fromTo(element, { scaleX: 0, transformOrigin: "left center" }, {
          scaleX: 1,
          duration: 0.8,
          ease: "power3.out",
          clearProps: "willChange",
          onStart: () => { element.style.willChange = "transform"; },
          scrollTrigger: { trigger: element, start: "top 88%", once: true },
        });
      });

      mediaScale.forEach((element) => {
        gsap.fromTo(element, { scale: 1.03 }, {
          scale: 1,
          duration: 1,
          ease: "power3.out",
          clearProps: "willChange",
          onStart: () => { element.style.willChange = "transform"; },
          scrollTrigger: { trigger: element, start: "top 88%", once: true },
        });
      });
    });

    media.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const parallaxMedia = gsap.utils.toArray<HTMLElement>('[data-motion="media-parallax"]');
      parallaxMedia.forEach((element) => {
        gsap.fromTo(element, { yPercent: -2 }, {
          yPercent: 2,
          ease: "none",
          scrollTrigger: { trigger: element, start: "top bottom", end: "bottom top", scrub: 0.6 },
          onStart: () => { element.style.willChange = "transform"; },
          onComplete: () => { element.style.willChange = ""; },
        });
      });
    });

    return () => {
      cancelAnimationFrame(refreshFrame);
      media.revert();
      document.querySelectorAll<HTMLElement>("[data-motion]").forEach((element) => {
        element.style.willChange = "";
      });
    };
  }, [pathname]);

  return null;
}
