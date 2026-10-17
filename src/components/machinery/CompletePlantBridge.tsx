"use client";

import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { assetPath } from "@/lib/asset-path";
import "./complete-plant-bridge.css";

export default function CompletePlantBridge() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        // Retain the completed trigger until cleanup so media-query refreshes
        // do not remove triggers while GSAP is initializing the page.
        gsap.timeline({ defaults: { ease: "power3.out" }, scrollTrigger: { trigger: root.current, start: "top 78%", toggleActions: "play none none none" } })
          .to(".plant-bridge-eyebrow", { opacity: 1, y: 0, duration: 0.4 })
          .to(".plant-bridge-question-line > span", { y: 0, yPercent: 0, duration: 0.65, stagger: 0.09 }, "-=0.15")
          .to(".plant-bridge-answer-line > span", { y: 0, yPercent: 0, duration: 0.65, stagger: 0.08 }, "-=0.24")
          .to(".plant-bridge-media", { opacity: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 0.85 }, "-=0.45")
          .to(".plant-bridge-copy", { opacity: 1, y: 0, duration: 0.5 }, "-=0.35")
          .to(".plant-bridge-actions", { opacity: 1, y: 0, duration: 0.5 }, "-=0.25");
      }, root);
      return () => context.revert();
    });
    return () => media.revert();
  }, []);

  return <section ref={root} id="complete-plant-systems" className="complete-plant-bridge" aria-labelledby="plant-bridge-heading">
    <div className="plant-bridge-shell">
      <p className="plant-bridge-eyebrow">08 / COMPLETE PLANT SYSTEMS</p>

      <header className="plant-bridge-headlines">
        <h2 id="plant-bridge-heading" className="plant-bridge-question">
          <span className="plant-bridge-question-line"><span>NEED MORE</span></span>
          <span className="plant-bridge-question-line"><span>THAN A MACHINE?</span></span>
        </h2>
        <p className="plant-bridge-answer">
          <span className="plant-bridge-answer-line"><span>WE BUILD COMPLETE</span></span>
          <span className="plant-bridge-answer-line"><span>SALT REFINERY PLANTS.</span></span>
        </p>
      </header>

      <figure className="plant-bridge-media">
        <div className="plant-bridge-image-frame">
          <Image src={assetPath("/images/projects/jagdamba/cover Image.png")}
            alt="Installed S.K. Engineering Works salt refinery equipment at Jagdamba Salt, Phalodi, Rajasthan"
            fill sizes="(max-width: 767px) 88vw, (max-width: 1199px) 40vw, 600px" />
        </div>
        <figcaption>REAL PROJECT / PHALODI, RAJASTHAN</figcaption>
      </figure>

      <p className="plant-bridge-copy">From process planning and machinery fabrication to installation-ready refinery systems, S.K. Engineering Works can deliver the complete salt processing line.</p>

      <div className="plant-bridge-actions">
        <Link href="/salt-refinery-plants" className="plant-bridge-link">EXPLORE SALT REFINERY PLANTS <span aria-hidden="true">&rarr;</span></Link>
        <p>FROM RAW SALT TO FINISHED PRODUCT.</p>
      </div>
    </div>
  </section>;
}
