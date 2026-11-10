"use client";
/** @jsxImportSource @/i18n/react */

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./about-credibility-section.css";
import "./trusted-clients-section.css";

// Keep the existing marquee footprint while client relationships and logo permissions are confirmed.
const workAreas = [
  "PLANT LAYOUT PLANNING",
  "PROCESS DESIGN",
  "MACHINERY FABRICATION",
  "STRUCTURAL INTEGRATION",
  "SITE INSTALLATION",
  "MATERIAL HANDLING",
  "HOPPERS",
  "BELT CONVEYORS",
  "SCREW CONVEYORS",
  "WET MILLS",
  "CENTRIFUGES",
  "DUST COLLECTION",
];

const rowSplit = Math.ceil(workAreas.length / 2);

function WorkMark({ name, duplicate = false }: { name: string; duplicate?: boolean }) {
  return (
    <li className="about-client-mark" aria-hidden={duplicate || undefined}>
      <strong>{name}</strong>
    </li>
  );
}

function MarqueeRow({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  return (
    <div className={`about-marquee-row${reverse ? " is-reverse" : ""}`} role="region" tabIndex={0} aria-label="Engineering work areas">
      <ul className="about-marquee-track">
        {items.map((name) => <WorkMark name={name} key={name} />)}
        {items.map((name) => <WorkMark name={name} duplicate key={`duplicate-${name}`} />)}
      </ul>
    </div>
  );
}

type TrustedClientsSectionProps = {
  animate?: boolean;
  standalone?: boolean;
  sectionNumber?: string;
};

export default function TrustedClientsSection({ animate = true, standalone = false, sectionNumber = "05" }: TrustedClientsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !animate) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        gsap.timeline({ scrollTrigger: { trigger: section, start: "top 84%", toggleActions: "play none none none" } }).to(".about-trust-heading", {
          autoAlpha: 1,
          y: 0,
          duration: 0.65,
          ease: "power2.out",
        });
      }, section);
      return () => context.revert();
    });

    return () => media.revert();
  }, [animate]);

  const content = (
    <>
      <div className="about-trust-meta"><span>ENGINEERING WORK / {sectionNumber}</span><span>PROCESS EQUIPMENT / PLANT SYSTEMS</span></div>
      <h3 id="about-trust-heading" className="about-trust-heading">FABRICATION &amp;<br />PLANT SYSTEMS.</h3>
      <div className="about-marquees" aria-label="S.K. Engineering Works equipment and plant-system work">
        <MarqueeRow items={workAreas.slice(0, rowSplit)} />
        <MarqueeRow items={workAreas.slice(rowSplit)} reverse />
      </div>
    </>
  );

  if (standalone) {
    return (
      <section ref={sectionRef} className="about-trust trusted-clients-standalone" aria-labelledby="about-trust-heading">
        <div className="trusted-clients-shell">{content}</div>
      </section>
    );
  }

  return <section ref={sectionRef} className="about-trust" aria-labelledby="about-trust-heading">{content}</section>;
}
