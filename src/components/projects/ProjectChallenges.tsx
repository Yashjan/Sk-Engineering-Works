"use client";

import { useId, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ProjectChallenge } from "@/data/project-challenges";
import "./project-challenges.css";

type ProjectChallengesProps = {
  sectionNumber: string;
  heading: readonly string[];
  intro: string;
  items: readonly ProjectChallenge[];
};

export default function ProjectChallenges({ sectionNumber, heading, intro, items }: ProjectChallengesProps) {
  const root = useRef<HTMLElement>(null);
  const headingId = useId();

  useLayoutEffect(() => {
    const section = root.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(section.querySelectorAll("[data-challenges-intro]"), {
        opacity: 0,
        y: 16,
        duration: 0.72,
        stagger: 0.09,
        ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 78%", once: true },
      });

      section.querySelectorAll<HTMLElement>(".project-challenges-record").forEach((record) => {
        gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger: record, start: "top 84%", once: true },
        })
          .from(record.querySelector(".project-challenges-rule"), { scaleX: 0, duration: 0.75 })
          .from(record.querySelector(".project-challenges-index"), { opacity: 0, y: 12, duration: 0.45 }, 0.1)
          .from(record.querySelector(".project-challenges-constraint"), { opacity: 0, y: 26, duration: 0.7 }, 0.18)
          .from(record.querySelector(".project-challenges-response"), { opacity: 0, y: 18, duration: 0.65 }, 0.32);
      });
    }, section);

    return () => media.revert();
  }, [items]);

  return (
    <section ref={root} id="engineering-response" className="project-challenges" aria-labelledby={headingId}>
      <div className="project-challenges-shell">
        <header className="project-challenges-intro">
          <p className="project-challenges-eyebrow" data-challenges-intro>{sectionNumber} / ENGINEERING RESPONSE</p>
          <h2 id={headingId} className="project-challenges-heading" data-challenges-intro>
            {heading.map((line, index) => (
              <span key={line}>{line}{index < heading.length - 1 ? " " : null}</span>
            ))}
          </h2>
          <div className="project-challenges-framing" data-challenges-intro>
            <span className="project-challenges-cross" aria-hidden="true" />
            <p>{intro}</p>
          </div>
        </header>

        <div className="project-challenges-register">
          {items.map((item) => {
            // An incomplete pair stays a general prompt; never publish half a case study.
            const hasProjectCopy = Boolean(item.challenge.trim() && item.response.trim());
            const recordId = `${headingId}-constraint-${item.id}`;

            return (
              <article key={item.id} className="project-challenges-record" aria-labelledby={recordId}>
                <span className="project-challenges-rule" aria-hidden="true" />
                <span className="project-challenges-index" aria-hidden="true">{item.id}</span>
                <div className="project-challenges-constraint">
                  <p className="project-challenges-label">CONSTRAINT / {item.id}</p>
                  <h3 id={recordId}>{hasProjectCopy ? item.challenge : item.preview.constraint}</h3>
                </div>
                <div className="project-challenges-response">
                  <p className="project-challenges-label">ENGINEERING RESPONSE</p>
                  <p className="project-challenges-response-copy">{hasProjectCopy ? item.response : item.preview.question}</p>
                  <p className="project-challenges-record-kind">{hasProjectCopy ? "PROJECT RECORD" : "GENERAL CONSIDERATION"}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
