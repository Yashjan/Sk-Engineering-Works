"use client";

import { useId, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { EngineeringStage } from "@/data/engineering-approach";
import "./project-engineering-approach.css";

type ProjectEngineeringApproachProps = {
  sectionNumber: string;
  heading: readonly string[];
  intro: string;
  stages: readonly EngineeringStage[];
};

export default function ProjectEngineeringApproach({ sectionNumber, heading, intro, stages }: ProjectEngineeringApproachProps) {
  const root = useRef<HTMLElement>(null);
  const headingId = useId();

  useLayoutEffect(() => {
    const section = root.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add({
      desktop: "(min-width: 1024px)",
      motion: "(prefers-reduced-motion: no-preference)",
    }, (context) => {
      if (!context.conditions?.motion) return;

      const sequence = section.querySelector<HTMLElement>(".project-approach-stages");
      const rows = gsap.utils.toArray<HTMLElement>(".project-approach-stage", section);
      if (!sequence || !rows.length) return;

      gsap.from(section.querySelectorAll("[data-approach-intro]"), {
        opacity: 0,
        y: 16,
        duration: 0.7,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 80%", once: true },
      });

      rows.forEach((row) => {
        gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger: row, start: "top 90%", once: true },
        })
          .from(row.querySelector(".project-approach-stage-rule"), { scaleX: 0, duration: 0.7 })
          .from(row.querySelector(".project-approach-stage-content"), { opacity: 0, y: 18, duration: 0.65 }, 0.08);
      });

      if (context.conditions.desktop) {
        // Highlighting stays local to this sequence and causes no React renders on scroll.
        const progress = sequence.querySelector<HTMLElement>(".project-approach-progress");
        if (!progress) return;

        let activeIndex = -1;
        let updateFrame = 0;
        const updateStage = (progress: number) => {
          const nextIndex = Math.min(rows.length - 1, Math.floor(progress * rows.length));
          if (nextIndex === activeIndex) return;
          activeIndex = nextIndex;
          rows.forEach((row, index) => row.toggleAttribute("data-active", index === nextIndex));
        };

        sequence.setAttribute("data-tracking", "");
        progress.style.transform = "scaleY(0)";

        const updateTracking = () => {
          updateFrame = 0;
          const bounds = sequence.getBoundingClientRect();
          const startPosition = window.innerHeight * 0.58;
          const endPosition = window.innerHeight * 0.76 - bounds.height;
          const travel = Math.max(1, startPosition - endPosition);
          const value = Math.min(1, Math.max(0, (startPosition - bounds.top) / travel));

          progress.style.transform = `scaleY(${value})`;
          updateStage(value);
        };

        const scheduleTrackingUpdate = () => {
          if (updateFrame) return;
          updateFrame = requestAnimationFrame(updateTracking);
        };

        updateTracking();
        window.addEventListener("scroll", scheduleTrackingUpdate, { passive: true });
        window.addEventListener("resize", scheduleTrackingUpdate);

        return () => {
          window.removeEventListener("scroll", scheduleTrackingUpdate);
          window.removeEventListener("resize", scheduleTrackingUpdate);
          if (updateFrame) cancelAnimationFrame(updateFrame);
          progress.style.removeProperty("transform");
          sequence.removeAttribute("data-tracking");
          rows.forEach((row) => row.removeAttribute("data-active"));
        };
      }

      return () => {
        sequence.removeAttribute("data-tracking");
        rows.forEach((row) => row.removeAttribute("data-active"));
      };
    }, section);

    return () => media.revert();
  }, [stages]);

  return (
    <section ref={root} id="engineering-approach" className="project-approach" aria-labelledby={headingId}>
      <div className="project-approach-shell">
        <header className="project-approach-intro">
          <p className="project-approach-eyebrow" data-approach-intro>{sectionNumber} / ENGINEERING APPROACH</p>
          <h2 id={headingId} className="project-approach-heading" data-approach-intro>
            {heading.map((line, index) => <span key={line}>{line}{index < heading.length - 1 ? " " : null}</span>)}
          </h2>
          <p className="project-approach-description" data-approach-intro>{intro}</p>
        </header>

        <div className="project-approach-flow">
          <p className="project-approach-flow-label">EXECUTION MAP <span>/ GENERAL FRAMEWORK</span></p>
          <div className="project-approach-stages">
            <span className="project-approach-progress" aria-hidden="true" />
            {stages.map((stage) => (
              <article key={stage.id} className="project-approach-stage" aria-labelledby={`${headingId}-stage-${stage.id}`}>
                <span className="project-approach-stage-rule" aria-hidden="true" />
                <span className="project-approach-stage-node" aria-hidden="true" />
                <div className="project-approach-stage-content">
                  <span className="project-approach-stage-number" aria-hidden="true">{stage.id}</span>
                  <div className="project-approach-stage-copy">
                    <h3 id={`${headingId}-stage-${stage.id}`}>{stage.title}</h3>
                    <p>{stage.description}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
