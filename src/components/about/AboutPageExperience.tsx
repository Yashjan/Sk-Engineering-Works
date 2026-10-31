"use client";

import ProgressiveVideo from "@/components/media/ProgressiveVideo";

import Image from "@/components/media/ProgressiveImage";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { assetPath } from "@/lib/asset-path";
import "./about-page.css";

type JourneyPhase = { label: string; title: string; paragraphs: string[]; media?: string; mediaAlt?: string; mediaCaption?: string };

const journey: JourneyPhase[] = [
  {
    label: "1990s / THE BEGINNING",
    title: "CHAIN PULLEY BLOCKS.\nMECHANICAL ROOTS.",
    paragraphs: [
      "S.K. Engineering Works began in the 1990s with chain pulley blocks and mechanical fabrication work, grounded in workshop skill and hands-on engineering.",
      "As motorized lifting systems became more common, the company adapted instead of remaining limited to one product.",
    ],
    media: "/images/salt-refinery/complete-execution/fabricated-equipment.jpeg",
    mediaAlt: "Current S.K. Engineering Works fabrication showing the practical workshop foundation that began with mechanical work",
    mediaCaption: "PRACTICAL FABRICATION / THE FOUNDATION REMAINS",
  },
  {
    label: "NEXT CHAPTER / AGRICULTURE + HANDLING",
    title: "FROM LIFTING\nTO MOVING MATERIAL.",
    paragraphs: [
      "The company expanded into agricultural machinery and material-handling systems, building on its mechanical and fabrication experience.",
      "For around eight years, this work strengthened its engineering capability and long-term customer relationships across the region.",
    ],
  },
  {
    label: "2003 / ENTRY INTO SALT",
    title: "ENGINEERING\nMEETS SAMBHAR.",
    paragraphs: [
      "Based in Sambhar Lake, one of Rajasthan’s major salt-producing regions, S.K. Engineering Works naturally moved toward salt-processing plants and machinery.",
      "Shree Namak Udhyog became the company’s first major salt-industry client and an important milestone in that transition.",
    ],
    media: "/videos/salt-refinery/SK_Salt_Refinery_Plants_Hero_Poster.jpg",
    mediaAlt: "Salt refinery machinery representing S.K. Engineering Works' entry into the Sambhar salt industry",
    mediaCaption: "SALT PROCESSING / SAMBHAR ENGINEERING CONTEXT",
  },
  {
    label: "GROWTH / SALT INDUSTRY",
    title: "FROM MAINTENANCE\nTO COMPLETE SYSTEMS.",
    paragraphs: [
      "Machinery and maintenance work grew into equipment replacement, process improvements, material handling, salt refinery machinery and complete plant execution.",
      "Today, S.K. Engineering Works supports a significant part of the Sambhar–Nawa salt-industry ecosystem through machinery, maintenance and plant engineering.",
    ],
  },
  {
    label: "EXPANSION / GUJARAT",
    title: "BEYOND\nRAJASTHAN.",
    paragraphs: [
      "Growing experience in salt machinery and complete refinery systems took the company beyond Rajasthan and into Gujarat.",
      "S.K. Engineering Works now executes work across both states, carrying workshop capability through to site installation.",
    ],
    media: "/images/projects/jagdamba/cover Image.png",
    mediaAlt: "Completed salt refinery plant representing S.K. Engineering Works execution across Rajasthan and Gujarat",
    mediaCaption: "COMPLETE REFINERY / FIELD EXECUTION",
  },
  {
    label: "NEXT / EXPORT",
    title: "THE NEXT CHAPTER\nIS GLOBAL.",
    paragraphs: [
      "The next goal is to take S.K. Engineering Works beyond Rajasthan and Gujarat and build an export presence for industrial machinery and salt refinery systems.",
      "The company is preparing for that next stage of growth; this is the direction ahead, not a claim of current exports.",
    ],
  },
];

const founderRoles = ["TECHNICAL DIRECTION", "PLANT PLANNING", "MACHINERY SELECTION", "FABRICATION GUIDANCE", "SITE EXECUTION", "CLIENT COORDINATION", "MAINTENANCE & PROBLEM SOLVING", "BUSINESS EXPANSION"];

const currentCapabilities = [
  ["INDUSTRIAL EQUIPMENT", "Process machinery, blowers, filters, screens, mills and equipment developed around practical production needs."],
  ["MATERIAL HANDLING SYSTEMS", "Conveying and handling systems shaped by material flow, site conditions and operating requirements."],
  ["SALT REFINERY PLANTS", "Deep salt-processing specialization spanning individual machinery, process integration and complete plant execution."],
];

const progression = [
  ["INDIVIDUAL EQUIPMENT", "Conveyors, mills, blowers, filters, screens and process equipment."],
  ["PROCESS SYSTEM", "Machines connected around material flow, production needs and site conditions."],
  ["COMPLETE SALT REFINERY", "A coordinated plant system taken from fabrication through installation."],
];

const locations = [["SAMBHAR / NAWA", "RAJASTHAN"], ["PHALODI", "RAJASTHAN"], ["SANTALPUR", "GUJARAT"], ["JAMBUSAR", "GUJARAT"]];

export default function AboutPageExperience() {
  const rootRef = useRef<HTMLDivElement>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = heroVideoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.25) void video.play().catch(() => undefined);
      else video.pause();
    }, { threshold: [0, 0.25, 0.6] });
    observer.observe(video);
    return () => { observer.disconnect(); video.pause(); };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        gsap.timeline({ defaults: { ease: "power3.out" } })
          .from(".about-page-hero-meta", { autoAlpha: 0, y: 14, duration: 0.5 })
          .from(".about-page-hero-line > span", { yPercent: 110, duration: 0.85, stagger: 0.07 }, "-=0.18")
          .from(".about-page-hero-intro", { autoAlpha: 0, y: 16, duration: 0.6 }, "-=0.44")
          .from(".about-page-hero-media", { clipPath: "inset(0 0 100% 0)", duration: 1 }, "-=0.7");
        gsap.utils.toArray<HTMLElement>(".about-page-reveal").forEach((section) => {
          const targets = section.querySelectorAll<HTMLElement>("[data-reveal]");
          if (!targets.length) return;
          gsap.from(targets, { autoAlpha: 0, y: 22, duration: 0.68, stagger: 0.065, ease: "power2.out", scrollTrigger: { trigger: section, start: "top 80%", once: true } });
        });
        gsap.fromTo(".about-page-journey-line", { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: ".about-page-journey-list", start: "top 72%", end: "bottom 60%", scrub: 0.5 } });
        gsap.fromTo(".about-page-progress-line", { scaleX: 0 }, { scaleX: 1, duration: 1.05, ease: "power2.inOut", scrollTrigger: { trigger: ".about-page-progression", start: "top 75%", once: true } });
        gsap.to(".about-page-hero-media-inner", { yPercent: 6, ease: "none", scrollTrigger: { trigger: ".about-page-hero", start: "top top", end: "bottom top", scrub: 0.7 } });
      }, root);
      return () => context.revert();
    });
    return () => media.revert();
  }, []);

  return <div ref={rootRef} className="about-page">
    <section className="about-page-hero" aria-labelledby="about-page-title">
      <div className="about-page-hero-grid">
        <header className="about-page-hero-copy">
          <p className="about-page-hero-meta">ABOUT / S.K. ENGINEERING WORKS</p>
          <h1 id="about-page-title">
            {['BUILT THROUGH', 'ENGINEERING.', 'GROWN THROUGH', 'EXPERIENCE.'].map((line) => <span className="about-page-hero-line" key={line}><span>{line}</span></span>)}
          </h1>
          <p className="about-page-hero-intro">From mechanical fabrication and agricultural machinery to material handling systems and complete salt refinery plants.</p>
        </header>
        <figure className="about-page-hero-media">
          <div className="about-page-hero-media-inner"><ProgressiveVideo ref={heroVideoRef} muted loop playsInline preload="metadata" poster={assetPath("/images/salt-refinery/complete-execution/fabricated-equipment.jpeg")} aria-label="S.K. Engineering Works workshop fabrication"><source src={assetPath("/videos/manufacturing/SK_Inside_Our_Manufacturing_Cinematic_720p.mp4")} type="video/mp4" /></ProgressiveVideo></div>
          <figcaption><span>WORKSHOP / SAMBHAR LAKE</span><span>HANDS-ON ENGINEERING</span></figcaption>
        </figure>
      </div>
      <p className="about-page-scroll-cue" aria-hidden="true"><span /> TRACE THE JOURNEY</p>
    </section>

    <section className="about-page-story about-page-reveal" aria-labelledby="about-story-title">
      <div className="about-page-section-meta" data-reveal><span>OUR STORY / 02</span><span>1990s → NEXT</span></div>
      <header className="about-page-story-heading"><h2 id="about-story-title" data-reveal>A BUSINESS<br />THAT KEPT<br />EVOLVING.</h2><p data-reveal>S.K. Engineering Works was shaped by changing industry needs. Each chapter carried practical knowledge into the next: lifting, agriculture, material handling, salt processing and complete plant systems.</p></header>
      <div className="about-page-journey-list">
        <span className="about-page-journey-line" aria-hidden="true" />
        {journey.map((phase, index) => <article className={`about-page-journey-phase${phase.media ? " has-media" : ""}`} key={phase.label} data-reveal>
          <div className="about-page-journey-index"><span>{String(index + 1).padStart(2, "0")}</span><i aria-hidden="true" /></div>
          <div className="about-page-journey-copy"><p className="about-page-journey-label">{phase.label}</p><h3>{phase.title.split("\n").map((line) => <span key={line}>{line}</span>)}</h3>{phase.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{index === 2 ? <p className="about-page-client-milestone">FIRST MAJOR SALT-INDUSTRY CLIENT <strong>SHREE NAMAK UDHYOG</strong></p> : null}</div>
          {phase.media ? <figure className="about-page-journey-media"><Image src={assetPath(phase.media)} alt={phase.mediaAlt ?? ""} fill sizes="(max-width: 767px) 88vw, 37vw" /><figcaption>{phase.mediaCaption}</figcaption></figure> : <div className="about-page-journey-word" aria-hidden="true">{index === 1 ? "ADAPT" : index === 3 ? "SYSTEMS" : "NEXT"}</div>}
        </article>)}
      </div>
      <p className="about-page-story-statement" data-reveal>WHEN INDUSTRY CHANGED,<br /><span>WE CHANGED WITH IT.</span></p>
    </section>

    <section className="about-page-founder about-page-reveal" aria-labelledby="about-founder-title">
      <div className="about-page-section-meta" data-reveal><span>THE MAN BEHIND THE WORK / 03</span><span>MANAGING DIRECTOR</span></div>
      <div className="about-page-founder-grid">
        <figure className="about-page-founder-visual" data-reveal><Image src={assetPath("/images/salt-refinery/complete-execution/fabrication-blower.jpeg")} alt="S.K. Engineering Works workshop context for the Managing Director profile" fill sizes="(max-width: 767px) 88vw, 41vw" /><div className="about-page-founder-placeholder"><span>MANAGING DIRECTOR PORTRAIT</span><strong>TO BE ADDED</strong></div><figcaption>WORKSHOP CONTEXT / VERIFIED PORTRAIT PENDING</figcaption></figure>
        <div className="about-page-founder-copy"><h2 id="about-founder-title" data-reveal>BUILT WITH<br />HANDS-ON<br />EXPERIENCE.</h2><div className="about-page-founder-name" data-reveal><strong>FULL NAME TO BE CONFIRMED</strong><span>MANAGING DIRECTOR / S.K. ENGINEERING WORKS</span></div><div className="about-page-founder-story" data-reveal><p>Coming from a mechanical background, the Managing Director built S.K. Engineering Works around practical engineering, fabrication and problem-solving.</p><p>His work moved through chain pulley blocks, agricultural machinery and material handling before developing into large-scale salt refinery engineering.</p><p>Today, that experience guides machinery selection, fabrication, plant planning, site execution and customer problem-solving.</p></div></div>
      </div>
      <ul className="about-page-founder-roles" aria-label="Managing Director responsibilities">{founderRoles.map((role, index) => <li key={role} data-reveal><span>{String(index + 1).padStart(2, "0")}</span>{role}</li>)}</ul>
    </section>

    <section className="about-page-builds about-page-reveal" aria-labelledby="about-builds-title">
      <div className="about-page-section-meta" data-reveal><span>WHAT S.K. BUILDS TODAY / 04</span><span>BROAD ENGINEERING / DEEP SALT EXPERTISE</span></div>
      <div className="about-page-builds-heading"><h2 id="about-builds-title" data-reveal>MORE THAN<br />ONE INDUSTRY.</h2><p data-reveal>Today, S.K. Engineering Works operates across industrial machinery, material handling, agricultural equipment and salt refinery systems. Salt processing is a major specialization; the engineering foundation remains broader.</p></div>
      <ol className="about-page-builds-list">{currentCapabilities.map(([title, copy], index) => <li key={title} data-reveal><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p></li>)}</ol>
      <p className="about-page-builds-statement" data-reveal>WE DIDN&apos;T START WITH SALT.<br /><span>WE GREW INTO IT THROUGH ENGINEERING.</span></p>
    </section>

    <section className="about-page-workshop about-page-reveal" aria-labelledby="about-workshop-title">
      <div className="about-page-section-meta" data-reveal><span>BUILT HERE / 05</span><span>REAL WORKSHOP PROOF</span></div>
      <header className="about-page-workshop-heading"><h2 id="about-workshop-title" data-reveal>BUILT HERE.</h2><p data-reveal>FROM DRAWING<br />TO FABRICATION<br />TO WORKING MACHINE.</p></header>
      <div className="about-page-workshop-grid"><figure className="about-page-workshop-primary" data-reveal><Image src={assetPath("/images/salt-refinery/complete-execution/fabricated-equipment.jpeg")} alt="Fabricated stainless-steel process equipment in the S.K. Engineering Works workshop" fill sizes="(max-width: 767px) 88vw, 62vw" /><figcaption><span>PROCESS EQUIPMENT</span><span>FABRICATED IN-HOUSE</span></figcaption></figure><div className="about-page-workshop-support"><figure data-reveal><Image src={assetPath("/images/salt-refinery/complete-execution/fabrication-blower.jpeg")} alt="Large industrial blower fabricated in the workshop" fill sizes="(max-width: 767px) 88vw, 28vw" /><figcaption>INDUSTRIAL BLOWER / FABRICATION</figcaption></figure><figure data-reveal><Image src={assetPath("/images/salt-refinery/complete-execution/plant-structure.jpeg")} alt="Fabricated plant structure with installed process equipment" fill sizes="(max-width: 767px) 88vw, 28vw" /><figcaption>PLANT STRUCTURE / INSTALLED SYSTEM</figcaption></figure></div></div>
    </section>

    <section className="about-page-progression about-page-reveal" aria-labelledby="about-progression-title">
      <div className="about-page-section-meta" data-reveal><span>CAPABILITY / 06</span><span>MACHINE TO COMPLETE PLANT</span></div>
      <header className="about-page-progression-heading"><h2 id="about-progression-title" data-reveal>ONE MACHINE.<br />OR THE COMPLETE PLANT.</h2><p data-reveal>S.K. Engineering Works fabricates individual industrial machinery and connects equipment into a coordinated salt refinery process.</p></header>
      <div className="about-page-progress-track" aria-hidden="true"><span className="about-page-progress-line" /></div><ol className="about-page-progress-list">{progression.map(([title, copy], index) => <li key={title} data-reveal><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p>{index < progression.length - 1 ? <b aria-hidden="true">→</b> : null}</li>)}</ol>
    </section>

    <section className="about-page-footprint about-page-reveal" aria-labelledby="about-footprint-title">
      <div className="about-page-section-meta" data-reveal><span>EXECUTION FOOTPRINT / 07</span><span>RAJASTHAN + GUJARAT</span></div>
      <div className="about-page-footprint-grid"><div className="about-page-footprint-copy"><h2 id="about-footprint-title" data-reveal>ROOTED IN SAMBHAR.<br /><span>WORKING ACROSS REGIONS.</span></h2><p data-reveal>Mechanical roots in Sambhar Lake have grown into machinery and salt refinery execution across Rajasthan and Gujarat.</p><div className="about-page-regions" aria-hidden="true" data-reveal><span>RAJASTHAN</span><span>GUJARAT</span></div></div><div className="about-page-footprint-proof"><figure data-reveal><Image src={assetPath("/images/projects/jagdamba/cover Image.png")} alt="Completed S.K. Engineering Works salt refinery installation in Phalodi, Rajasthan" fill sizes="(max-width: 767px) 88vw, 43vw" /><figcaption>COMPLETE PLANT / FIELD EXECUTION</figcaption></figure><ul aria-label="Verified project locations">{locations.map(([city, region], index) => <li key={city} data-reveal><span>0{index + 1}</span><strong>{city}</strong><small>{region}</small></li>)}</ul></div></div>
    </section>
  </div>;
}
