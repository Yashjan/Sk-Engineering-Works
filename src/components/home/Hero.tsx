"use client";

import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { waitForIntro } from "@/components/layout/intro-coordination";
import { assetPath } from "@/lib/asset-path";

export default function Hero({ hasImage }: { hasImage: boolean }) {
  const root = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      let stopWaiting = () => {};
      const context = gsap.context(() => {
        const entrance = gsap.timeline({ paused: true, defaults: { ease: "power2.out" } })
          .to("[data-navbar]", { opacity: 1, y: 0, duration: 0.7 })
          .to(".hero-eyebrow", { opacity: 1, y: 0, duration: 0.6 }, "-=0.3")
          .to(".headline-line > span", { y: 0, yPercent: 0, duration: 0.9, stagger: 0.13 }, "-=0.25")
          .to(".hero-description", { opacity: 1, y: 0, duration: 0.6 }, "-=0.5")
          .to(".hero-actions", { opacity: 1, y: 0, duration: 0.6 }, "-=0.35")
          .to(".hero-footer", { opacity: 1, y: 0, duration: 0.7 }, "-=0.3");
        stopWaiting = waitForIntro(() => { entrance.play(); });
        gsap.to(".hero-media", { yPercent: 12, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } });
        gsap.to(".hero-copy", { y: -45, opacity: 0.3, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } });
      });
      return () => { stopWaiting(); context.revert(); };
    });
    return () => media.revert();
  }, []);

  return <section ref={root} className="hero" aria-labelledby="hero-heading">
    {/* Replace this media layer with a muted, playsInline factory video later. */}
    <div className={`hero-media ${hasImage ? "has-image" : ""}`} aria-hidden="true">
      {hasImage ? <Image src={assetPath("/images/Golden Hour Salt Processing Plant.png")} alt="" fill sizes="100vw" priority className="hero-image" /> : <div className="industrial-fallback"><div className="structure structure-one" /><div className="structure structure-two" /><div className="structure structure-three" /><div className="structure-crossbeam" /><div className="technical-grid" /></div>}
    </div>
    <div className="hero-overlay" aria-hidden="true" />
    <div className="hero-copy">
      <p className="hero-eyebrow"><span aria-hidden="true" />INDUSTRIAL EQUIPMENT + PLANT ENGINEERING · SAMBHAR LAKE, RAJASTHAN</p>
      <h1 id="hero-heading" className="hero-positioning-heading">
        <span className="headline-line"><span>INDUSTRIAL<span className="hero-mobile-break"><br /></span> EQUIPMENT.</span></span>
        <span className="headline-line headline-final"><span>COMPLETE PLANT<span className="hero-mobile-break"><br /></span> SYSTEMS<span className="headline-period">.</span></span></span>
      </h1>
      <div className="hero-support"><p className="hero-description">Engineering and manufacturing industrial process equipment, material handling systems, and complete salt refinery plants.</p>
        <div className="hero-actions"><Link className="button-primary" href="/salt-refinery-plants">EXPLORE SALT REFINERY PLANTS <span aria-hidden="true">→</span></Link><Link className="button-secondary" href="/machinery">VIEW MACHINERY <span aria-hidden="true">→</span></Link></div>
      </div>
    </div>
    <div className="hero-footer"><div className="engineering-labels"><span>INDUSTRIAL PROCESS EQUIPMENT</span><span>MATERIAL HANDLING SYSTEMS</span><span>COMPLETE PLANT ENGINEERING</span></div><a className="scroll-indicator" href="#process" aria-label="Scroll to the salt refinery specialization"><span className="scroll-track"><span /></span><span>SCROLL TO EXPLORE</span></a></div>
  </section>;
}
