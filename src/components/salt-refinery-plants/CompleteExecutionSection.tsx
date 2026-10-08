"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./complete-execution-section.css";

type ExecutionStage = {
  number: string;
  title: string;
  description: string;
};

const executionStages: ExecutionStage[] = [
  {
    number: "01",
    title: "PLANT LAYOUT PLANNING",
    description:
      "We plan machine positioning, structure arrangement and process movement around the production requirement and available plant space.",
  },
  {
    number: "02",
    title: "PROCESS DESIGN",
    description:
      "The complete refinery flow is planned from raw salt intake through crushing, washing, centrifuging, drying, screening, grinding, storage and packing.",
  },
  {
    number: "03",
    title: "MACHINERY FABRICATION",
    description:
      "Process equipment and material-handling machinery are fabricated to suit the required refinery configuration and production flow.",
  },
  {
    number: "04",
    title: "STRUCTURAL INTEGRATION",
    description:
      "Machines, platforms, frames and interconnecting systems are coordinated into one functional plant structure.",
  },
  {
    number: "05",
    title: "INSTALLATION & SETUP",
    description:
      "Equipment is installed and aligned on site to create a connected refinery production line.",
  },
  {
    number: "06",
    title: "READY-TO-RUN REFINERY",
    description:
      "The final system brings planning, fabricated equipment and site execution together into a complete salt refinery setup.",
  },
];

const executionImages = [
  {
    src: "/images/salt-refinery/execution/plant-structure.jpeg",
    alt: "Salt refinery machinery integrated into a steel plant structure",
    caption: "PLANT STRUCTURE / SITE INTEGRATION",
  },
  {
    src: "/images/salt-refinery/execution/fabrication-blower.jpeg",
    alt: "Industrial blower fabricated inside the S.K. Engineering Works workshop",
    caption: "PROCESS EQUIPMENT / FABRICATION",
  },
  {
    src: "/images/salt-refinery/execution/fabricated-equipment.jpeg",
    alt: "Large stainless-steel salt processing equipment under fabrication",
    caption: "HEAVY EQUIPMENT / WORKSHOP",
  },
] as const;

function StageRow({ stage }: { stage: ExecutionStage }) {
  return (
    <article className="execution-stage-row">
      <span className="execution-stage-number">{stage.number}</span>
      <div>
        <h3>{stage.title}</h3>
        <p>{stage.description}</p>
      </div>
    </article>
  );
}

function ExecutionImage({
  image,
  className = "",
  sizes,
}: {
  image: (typeof executionImages)[number];
  className?: string;
  sizes: string;
}) {
  return (
    <figure className={`execution-image ${className}`}>
      <div className="execution-image-frame">
        <Image src={image.src} alt={image.alt} fill sizes={sizes} />
      </div>
      <figcaption>{image.caption}</figcaption>
    </figure>
  );
}

export default function CompleteExecutionSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        gsap
          .timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: {
              trigger: ".execution-intro",
              start: "top 78%",
              once: true,
            },
          })
          .fromTo(
            ".execution-eyebrow",
            { autoAlpha: 0, y: 12 },
            { autoAlpha: 1, y: 0, duration: 0.42 },
          )
          .fromTo(
            ".execution-heading-line > span",
            { yPercent: 108 },
            { yPercent: 0, duration: 0.72, stagger: 0.08 },
            "-=0.15",
          )
          .fromTo(
            ".execution-support, .execution-sequence",
            { autoAlpha: 0, y: 16 },
            { autoAlpha: 1, y: 0, duration: 0.52, stagger: 0.08 },
            "-=0.38",
          );

        gsap.utils.toArray<HTMLElement>(".execution-stage-row").forEach((row) => {
          gsap.fromTo(
            row,
            { autoAlpha: 0, y: 20 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.58,
              ease: "power3.out",
              scrollTrigger: { trigger: row, start: "top 88%", once: true },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>(".execution-image").forEach((item) => {
          gsap.fromTo(
            item.querySelector(".execution-image-frame"),
            { clipPath: "inset(0 0 100% 0)" },
            {
              clipPath: "inset(0 0 0% 0)",
              duration: 0.9,
              ease: "power3.inOut",
              scrollTrigger: { trigger: item, start: "top 86%", once: true },
            },
          );
        });

        gsap.to(".execution-media-secondary", {
          y: -18,
          ease: "none",
          scrollTrigger: {
            trigger: ".execution-media-composition",
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
          },
        });

        gsap.to(".execution-media-detail", {
          y: 14,
          ease: "none",
          scrollTrigger: {
            trigger: ".execution-media-composition",
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
          },
        });

        gsap.fromTo(
          ".execution-statement-line > span",
          { yPercent: 110 },
          {
            yPercent: 0,
            duration: 0.78,
            stagger: 0.09,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".execution-statement",
              start: "top 82%",
              once: true,
            },
          },
        );
      }, section);

      return () => context.revert();
    });

    return () => media.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="complete-execution"
      aria-labelledby="complete-execution-title"
    >
      <div className="execution-shell">
        <header className="execution-intro">
          <p className="execution-eyebrow">COMPLETE EXECUTION / 03</p>
          <h2 id="complete-execution-title" className="execution-heading">
            <span className="execution-heading-line"><span>WE BUILD</span></span>
            <span className="execution-heading-line"><span>SALT REFINERIES</span></span>
            <span className="execution-heading-line"><span>FROM SCRATCH.</span></span>
          </h2>
          <div className="execution-intro-copy">
            <p className="execution-support">
              From initial plant layout planning to machinery fabrication and on-site installation, S.K. Engineering Works delivers complete salt refinery execution as one connected engineering system.
            </p>
            <p className="execution-sequence" aria-label="Plan, build, install">
              <span>PLAN</span><span>BUILD</span><span>INSTALL</span>
            </p>
          </div>
        </header>

        <div className="execution-desktop-story">
          <div className="execution-stage-list">
            {executionStages.map((stage) => <StageRow key={stage.number} stage={stage} />)}
          </div>

          <div className="execution-media-composition" aria-label="Salt refinery execution photographs">
            <ExecutionImage
              image={executionImages[0]}
              className="execution-media-main"
              sizes="(max-width: 767px) 88vw, 44vw"
            />
            <ExecutionImage
              image={executionImages[1]}
              className="execution-media-secondary"
              sizes="(max-width: 767px) 88vw, 21vw"
            />
            <ExecutionImage
              image={executionImages[2]}
              className="execution-media-detail"
              sizes="(max-width: 767px) 88vw, 25vw"
            />
          </div>
        </div>

        <div className="execution-mobile-story">
          {[0, 1, 2].map((groupIndex) => (
            <div className="execution-mobile-group" key={executionImages[groupIndex].src}>
              <ExecutionImage image={executionImages[groupIndex]} sizes="88vw" />
              {executionStages
                .slice(groupIndex * 2, groupIndex * 2 + 2)
                .map((stage) => <StageRow key={stage.number} stage={stage} />)}
            </div>
          ))}
        </div>

        <footer className="execution-statement">
          <p className="execution-statement-kicker">COMPLETE SALT REFINERY EXECUTION</p>
          <p className="execution-statement-copy">
            <span className="execution-statement-line"><span>PLANNED HERE.</span></span>
            <span className="execution-statement-line"><span>BUILT HERE.</span></span>
            <span className="execution-statement-line"><span>INSTALLED ON SITE.</span></span>
          </p>
        </footer>
      </div>
    </section>
  );
}
