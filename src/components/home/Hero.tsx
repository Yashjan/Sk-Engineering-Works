"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { waitForIntro } from "@/components/layout/intro-coordination";

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
      {hasImage ? <Image src="/images/Golden Hour Salt Processing Plant.png" alt="" fill sizes="100vw" priority className="hero-image" /> : <div className="industrial-fallback"><div className="structure structure-one" /><div className="structure structure-two" /><div className="structure structure-three" /><div className="structure-crossbeam" /><div className="technical-grid" /></div>}
    </div>
    <div className="hero-overlay" aria-hidden="true" />
    <div className="hero-copy">
      <p className="hero-eyebrow"><span aria-hidden="true" />SALT REFINERY ENGINEERING · SAMBHAR LAKE, RAJASTHAN</p>
      <h1 id="hero-heading"><span className="headline-line"><span>WE ENGINEER</span></span><span className="headline-line"><span>SALT REFINERY</span></span><span className="headline-line headline-final"><span>PLANTS<span className="headline-period">.</span></span></span></h1>
      <div className="hero-support"><p className="hero-description">Complete salt refinery plants and industrial machinery engineered for reliable, continuous production.</p>
        <div className="hero-actions"><a className="button-primary" href="#process">EXPLORE THE PLANT <span aria-hidden="true">↓</span></a><a className="button-secondary" href="#contact">REQUEST A QUOTE <span aria-hidden="true">→</span></a></div>
      </div>
    </div>
    <div className="hero-footer"><div className="engineering-labels"><span>COMPLETE PLANT ENGINEERING</span><span>SALT PROCESSING MACHINERY</span><span>CUSTOM INDUSTRIAL SOLUTIONS</span></div><a className="scroll-indicator" href="#process" aria-label="Scroll to the plant"><span className="scroll-track"><span /></span><span>SCROLL TO EXPLORE</span></a></div>
  </section>;
}
