"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { releaseHeroEntrance } from "./intro-coordination";

export default function SiteIntro() {
  const root = useRef<HTMLDivElement>(null);
  const eligible = useRef<boolean | null>(null);

  useEffect(() => {
    const html = document.documentElement;
    eligible.current ??= html.dataset.skIntro === "active";
    if (!eligible.current) return;
    html.dataset.skIntro = "active";
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finish = () => {
      html.dataset.skIntro = "done";
      try { sessionStorage.setItem("sk-intro-played", "true"); } catch { /* Storage may be disabled. */ }
      releaseHeroEntrance();
    };
    const context = gsap.context(() => {
      gsap.timeline({ onComplete: finish })
        .to(".site-intro-logo", { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "power2.out" }, 0.1)
        .to(".site-intro-tagline", { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }, 0.25)
        .to(".site-intro-line > span", { scaleX: 1, duration: 0.75, ease: "power1.inOut" }, 0.3)
        .to(".site-intro-content", { y: -8, duration: 0.35, ease: "power2.inOut" }, 0.95)
        // The existing Hero timeline has a 0.4s navbar lead-in.
        .call(releaseHeroEntrance, [], 0.95)
        .to(root.current, { yPercent: -100, duration: 0.65, ease: "power3.inOut" }, 1.15);
    }, root);
    const reduceMotion = () => {
      if (motion.matches) { context.revert(); finish(); }
    };
    motion.addEventListener("change", reduceMotion);
    reduceMotion();
    return () => {
      motion.removeEventListener("change", reduceMotion);
      context.revert();
      html.dataset.skIntro = "done";
    };
  }, []);

  return <div ref={root} className="site-intro" aria-hidden="true">
    <div className="site-intro-content">
      <Image src="/images/sk-logo.png" alt="" width={160} height={64} priority className="site-intro-logo" />
      <p className="site-intro-tagline">SALT REFINERY ENGINEERING</p>
      <div className="site-intro-line"><span /></div>
    </div>
  </div>;
}
