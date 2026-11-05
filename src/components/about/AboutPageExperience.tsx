"use client";
/** @jsxImportSource @/i18n/react */

import ProgressiveVideo from "@/components/media/ProgressiveVideo";

import Image from "@/components/media/ProgressiveImage";
import { useEffect, useRef } from "react";
import { useLocaleTranslation } from "@/components/i18n/LocaleRuntime";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { assetPath } from "@/lib/asset-path";
import "./about-page.css";

type JourneyPhase = { label: string; title: string; paragraphs: string[]; media?: string; mediaType?: "image" | "video"; mediaAlt?: string; mediaCaption?: string };

const aboutHeadingCopy = {
  en: { hero: ["BUILT THROUGH", "ENGINEERING.", "GROWN THROUGH", "EXPERIENCE."], founder: ["BUILT WITH", "EXPERIENCE.", "LED BY PURPOSE."] },
  hi: { hero: ["इंजीनियरिंग से", "निर्मित।", "अनुभव से", "विकसित।"], founder: ["अनुभव से", "निर्मित।", "उद्देश्य से प्रेरित।"] },
  ar: { hero: ["بُنيت عبر", "الهندسة.", "ونمت عبر", "الخبرة."], founder: ["بُنيت بخبرة.", "وتقودها", "رؤية واضحة."] },
} as const;

const journey: JourneyPhase[] = [
  {
    label: "1990s / THE BEGINNING",
    title: "THE BEGINNING —\nWELL PULLEYS.",
    paragraphs: [
      "S.K. Engineering Works began its manufacturing journey with traditional hand-operated well pulleys, fabricated from mild steel (MS). These manually operated winding machines were designed to draw water from wells, marking the company's early foundation in practical metal fabrication and mechanical engineering.",
    ],
    media: "/images/about/well-pulley-ms-blue.png",
    mediaAlt: "Blue-painted mild steel hand-operated well pulley with cylindrical winding drum and manual crank.",
    mediaCaption: "EARLY MANUFACTURING BEGAN WITH MS WELL PULLEYS — SIMPLE, DURABLE, MANUALLY OPERATED MACHINES USED FOR DRAWING WATER FROM WELLS.",
  },
  {
    label: "NEXT CHAPTER / AGRICULTURE + HANDLING",
    title: "FROM LIFTING\nTO MOVING MATERIAL.",
    paragraphs: [
      "The company expanded into agricultural machinery and material-handling systems, building on its mechanical and fabrication experience.",
      "For around eight years, this work strengthened its engineering capability and long-term customer relationships across the region.",
    ],
    media: "/images/projects/equipment/portable-belt-conveyor/completed-machine.mp4",
    mediaType: "video",
    mediaAlt: "Completed belt conveyor manufactured by S.K. Engineering Works for material handling",
    mediaCaption: "MATERIAL HANDLING / COMPLETED BELT CONVEYOR",
  },
  {
    label: "2003 / ENTRY INTO SALT",
    title: "ENGINEERING\nMEETS SAMBHAR.",
    paragraphs: [
      "Based in Sambhar Lake, one of Rajasthan’s major salt-producing regions, S.K. Engineering Works naturally moved toward salt-processing plants and machinery.",
      "Shree Namak Udhyog became the company’s first major salt-industry client and an important milestone in that transition.",
    ],
    media: "/images/about/industrial-processing-plant-silos.webp",
    mediaAlt: "Industrial salt processing plant with silos and material conveyors",
    mediaCaption: "SALT PROCESSING / EARLY INDUSTRIAL PLANT SYSTEMS",
  },
  {
    label: "GROWTH / SALT INDUSTRY",
    title: "FROM MAINTENANCE\nTO COMPLETE SYSTEMS.",
    paragraphs: [
      "Machinery and maintenance work grew into equipment replacement, process improvements, material handling, salt refinery machinery and complete plant execution.",
      "Today, S.K. Engineering Works supports a significant part of the Sambhar–Nawa salt-industry ecosystem through machinery, maintenance and plant engineering.",
    ],
    media: "/images/salt-refinery/plant-layout/plant-elevation-preview.webp",
    mediaAlt: "Two-dimensional salt refinery plant elevation and equipment arrangement drawing",
    mediaCaption: "2D PLANT LAYOUT / COMPLETE SYSTEM PLANNING",
  },
  {
    label: "EXPANSION / GUJARAT",
    title: "BEYOND\nRAJASTHAN.",
    paragraphs: [
      "Growing experience in salt machinery and complete refinery systems took the company beyond Rajasthan and into Gujarat.",
      "S.K. Engineering Works now executes work across both states, carrying workshop capability through to site installation.",
    ],
    media: "/images/projects/jagdamba/cover-image.png",
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
    media: "/images/about/export-ready-industrial-equipment.webp",
    mediaAlt: "Industrial process equipment beside a shipping container representing future export readiness",
    mediaCaption: "EXPORT READINESS / THE NEXT CHAPTER",
  },
];

const founderRoles = ["PRACTICAL MECHANICAL ENGINEERING", "MACHINERY DESIGN & SELECTION", "FABRICATION & MANUFACTURING GUIDANCE", "SALT PROCESSING EQUIPMENT", "PLANT LAYOUT & EQUIPMENT INTEGRATION", "QUALITY & RELIABILITY", "INSTALLATION & SITE EXECUTION", "CUSTOMER REQUIREMENT UNDERSTANDING"];

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

const locations = [["SAMBHAR / NAWA", "RAJASTHAN"], ["PHALODI", "RAJASTHAN"], ["SANTALPUR", "GUJARAT"], ["JAMBUSAR", "GUJARAT"], ["GANDHIDHAM", "GUJARAT"]];

export default function AboutPageExperience() {
  const { locale } = useLocaleTranslation();
  const headingCopy = aboutHeadingCopy[locale];
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
            {headingCopy.hero.map((line) => <span className="about-page-hero-line" key={line}><span data-no-translate>{line}</span></span>)}
          </h1>
          <p className="about-page-hero-intro">From mechanical fabrication and agricultural machinery to material handling systems and complete salt refinery plants.</p>
        </header>
        <figure className="about-page-hero-media">
          <div className="about-page-hero-media-inner"><ProgressiveVideo ref={heroVideoRef} muted loop playsInline preload="metadata" poster={assetPath("/images/common/field-media/fabricated-equipment.jpeg")} aria-label="S.K. Engineering Works workshop fabrication"><source src={assetPath("/videos/manufacturing/SK_Inside_Our_Manufacturing_Cinematic_720p.mp4")} type="video/mp4" /></ProgressiveVideo></div>
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
          {phase.media ? <figure className="about-page-journey-media" data-media-fit={index === 0 || index === 3 ? "contain" : undefined}>{phase.mediaType === "video" ? <ProgressiveVideo src={assetPath(phase.media)} aria-label={phase.mediaAlt} autoPlay muted loop playsInline preload="metadata" /> : <Image src={assetPath(phase.media)} alt={phase.mediaAlt ?? ""} fill sizes="(max-width: 767px) 88vw, 37vw" />}<figcaption>{phase.mediaCaption}</figcaption></figure> : <div className="about-page-journey-word" aria-hidden="true">{index === 1 ? "ADAPT" : index === 3 ? "SYSTEMS" : "NEXT"}</div>}
        </article>)}
      </div>
      <p className="about-page-story-statement" data-reveal>WHEN INDUSTRY CHANGED,<br /><span>WE CHANGED WITH IT.</span></p>
    </section>

    <section className="about-page-founder about-page-reveal" aria-labelledby="about-founder-title">
      <div className="about-page-section-meta" data-reveal><span>03 / THE MAN BEHIND THE WORK</span><span>FOUNDER / S.K. ENGINEERING WORKS</span></div>
      <div className="about-page-founder-grid">
        <figure className="about-page-founder-visual" data-reveal><Image src={assetPath("/images/about/ramlal-jangid-founder.webp")} alt="Mr. Ramlal Jangid, Founder of S.K. Engineering Works." fill sizes="(max-width: 767px) 88vw, (max-width: 1099px) 40vw, 41vw" /><figcaption>MR. RAMLAL JANGID / FOUNDER</figcaption></figure>
        <div className="about-page-founder-copy"><h2 id="about-founder-title" data-reveal data-no-translate>{headingCopy.founder[0]}<br />{headingCopy.founder[1]}<br /><span data-no-translate>{headingCopy.founder[2]}</span></h2><div className="about-page-founder-name" data-reveal><strong>Mr. Ramlal Jangid</strong><span>FOUNDER | S.K. ENGINEERING WORKS</span></div><div className="about-page-founder-story" data-reveal><p>Behind S.K. Engineering Works is a foundation built on practical knowledge, hands-on fabrication, and an understanding of how industrial machinery performs in real working conditions.</p><p>From the company&apos;s early work with traditional well pulleys to its expansion into salt-processing machinery and complete refinery systems, the journey reflects a commitment to mechanical engineering, dependable manufacturing, and continuous improvement.</p><p>Under the guidance of founder Mr. Ramlal Jangid, S.K. Engineering Works continues to approach each requirement with attention to practical design, fabrication quality, equipment reliability, and the demands of installation and operation.</p></div><div className="about-page-founder-philosophy" data-reveal><span>OUR APPROACH</span><p>Good engineering goes beyond drawings and machines. It is about understanding the process, building equipment that works reliably, and delivering solutions suited to real industrial conditions.</p></div></div>
      </div>
      <ul className="about-page-founder-roles" aria-label="Engineering approach and responsibilities">{founderRoles.map((role, index) => <li key={role} data-reveal><span>{String(index + 1).padStart(2, "0")}</span>{role}</li>)}</ul>
    </section>

    <section className="about-page-builds about-page-reveal" aria-labelledby="about-builds-title">
      <div className="about-page-section-meta" data-reveal><span>WHAT S.K. BUILDS TODAY / 04</span><span>BROAD ENGINEERING / DEEP SALT EXPERTISE</span></div>
      <div className="about-page-builds-heading"><h2 id="about-builds-title" data-reveal>MORE THAN<br />ONE INDUSTRY.</h2><p data-reveal>Today, S.K. Engineering Works operates across industrial machinery, material handling, agricultural equipment and salt refinery systems. Salt processing is a major specialization; the engineering foundation remains broader.</p></div>
      <ol className="about-page-builds-list">{currentCapabilities.map(([title, copy], index) => <li key={title} data-reveal><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p></li>)}</ol>
      <p className="about-page-builds-statement" data-reveal>WE DIDN&apos;T START WITH SALT.<br /><span>WE GREW INTO IT THROUGH ENGINEERING.</span></p>
    </section>

    <section className="about-page-workshop about-page-reveal" aria-labelledby="about-workshop-title">
      <div className="about-page-section-meta" data-reveal><span>05 / BUILT HERE</span><span>REAL WORKSHOP PROOF</span></div>
      <header className="about-page-workshop-heading">
        <h2 id="about-workshop-title" data-reveal>BUILT HERE.</h2>
        <div className="about-page-workshop-intro" data-reveal>
          <p className="about-page-workshop-subheading">FROM FABRICATION FLOOR TO INDUSTRIAL INSTALLATION.</p>
          <p className="about-page-workshop-statement">Real fabrication. Real equipment. Real project execution.</p>
          <p className="about-page-workshop-description">A closer look at the manufacturing and site work behind S.K. Engineering Works — from large fabricated equipment in the workshop to dispatch and integration at industrial facilities.</p>
        </div>
      </header>
      <div className="about-page-workshop-grid">
        <figure className="about-page-workshop-primary" data-reveal>
          <Image src={assetPath("/images/about/workshop-fabrication.webp")} alt="Large cylindrical industrial equipment fabricated inside the S.K. Engineering Works workshop" fill sizes="(max-width: 767px) 88vw, 62vw" />
          <figcaption>01 / WORKSHOP FABRICATION</figcaption>
        </figure>
        <div className="about-page-workshop-support">
          <figure className="about-page-workshop-dispatch" data-reveal>
            <Image src={assetPath("/images/about/equipment-dispatch.webp")} alt="Large fabricated conical industrial equipment loaded onto a transport truck for dispatch" fill sizes="(max-width: 767px) 88vw, 28vw" />
            <figcaption>02 / EQUIPMENT DISPATCH</figcaption>
          </figure>
          <figure className="about-page-workshop-installation" data-reveal>
            <Image src={assetPath("/images/about/site-installation.webp")} alt="Industrial processing equipment and structural steel installed at a project site" fill sizes="(max-width: 767px) 88vw, 28vw" />
            <figcaption>03 / SITE INSTALLATION</figcaption>
          </figure>
        </div>
      </div>
    </section>

    <section className="about-page-progression about-page-reveal" aria-labelledby="about-progression-title">
      <div className="about-page-section-meta" data-reveal><span>CAPABILITY / 06</span><span>MACHINE TO COMPLETE PLANT</span></div>
      <header className="about-page-progression-heading"><h2 id="about-progression-title" data-reveal>ONE MACHINE.<br />OR THE COMPLETE PLANT.</h2><p data-reveal>S.K. Engineering Works fabricates individual industrial machinery and connects equipment into a coordinated salt refinery process.</p></header>
      <div className="about-page-progress-track" aria-hidden="true"><span className="about-page-progress-line" /></div><ol className="about-page-progress-list">{progression.map(([title, copy], index) => <li key={title} data-reveal><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p>{index < progression.length - 1 ? <b aria-hidden="true">→</b> : null}</li>)}</ol>
    </section>

    <section className="about-page-footprint about-page-reveal" aria-labelledby="about-footprint-title">
      <div className="about-page-section-meta" data-reveal><span>EXECUTION FOOTPRINT / 07</span><span>RAJASTHAN + GUJARAT</span></div>
      <div className="about-page-footprint-grid"><div className="about-page-footprint-copy"><h2 id="about-footprint-title" data-reveal>ROOTED IN SAMBHAR.<br /><span>WORKING ACROSS REGIONS.</span></h2><p data-reveal>Mechanical roots in Sambhar Lake have grown into machinery and salt refinery execution across Rajasthan and Gujarat.</p><div className="about-page-regions" aria-hidden="true" data-reveal><span>RAJASTHAN</span><span>GUJARAT</span></div></div><div className="about-page-footprint-proof"><figure data-reveal><Image src={assetPath("/images/about/sk-engineering-workshop.webp")} alt="S.K. Engineering Works workshop in Sambhar Lake with fabricated industrial equipment" fill sizes="(max-width: 767px) 88vw, 43vw" /><figcaption>OUR MANUFACTURING BASE / SAMBHAR LAKE, RAJASTHAN</figcaption></figure><ul aria-label="Verified project locations">{locations.map(([city, region], index) => <li key={city} data-reveal><span>0{index + 1}</span><strong>{city}</strong><small>{region}</small></li>)}</ul></div></div>
    </section>
  </div>;
}
