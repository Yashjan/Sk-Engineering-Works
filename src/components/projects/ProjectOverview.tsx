"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./project-overview.css";

type ProjectOverviewProps = {
  recordNumber: string;
  client: string;
  location: string;
  capacity: string;
  projectType: string;
  summary: string;
  statement: readonly string[];
};

export default function ProjectOverview({
  recordNumber,
  client,
  location,
  capacity,
  projectType,
  summary,
  statement,
}: ProjectOverviewProps) {
  const root = useRef<HTMLElement>(null);
  const facts = [
    ["CLIENT", client],
    ["LOCATION", location],
    ["CAPACITY", capacity],
    ["PROJECT TYPE", projectType],
  ] as const;

  useLayoutEffect(() => {
    const section = root.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        const statementLines = gsap.utils.toArray<HTMLElement>(
          ".project-overview-statement-line > span",
          section,
        );
        const facts = gsap.utils.toArray<HTMLElement>(
          ".project-overview-fact",
          section,
        );
        const rules = gsap.utils.toArray<HTMLElement>(
          ".project-overview-fact-rule",
          section,
        );

        gsap.set(".project-overview-register-heading", { autoAlpha: 0, y: 16 });
        gsap.set(".project-overview-record-id", { autoAlpha: 0, y: 16 });
        gsap.set(".project-overview-coordinate", { autoAlpha: 0 });
        gsap.set(statementLines, { yPercent: 112 });
        gsap.set(".project-overview-location-line", { autoAlpha: 0, y: 14 });
        gsap.set(".project-overview-summary", { autoAlpha: 0, y: 22 });
        gsap.set(facts, { autoAlpha: 0, y: 18 });
        gsap.set(rules, { scaleX: 0 });

        gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: section,
            start: "top 78%",
            once: true,
          },
        })
          .to(".project-overview-register-heading", { autoAlpha: 1, y: 0, duration: 0.42 })
          .to(".project-overview-record-id", { autoAlpha: 1, y: 0, duration: 0.42 }, "<0.06")
          .to(".project-overview-coordinate", { autoAlpha: 1, duration: 0.35 }, "<")
          .to(statementLines, { yPercent: 0, duration: 0.86, stagger: 0.1 }, "-=0.08")
          .to(".project-overview-location-line", { autoAlpha: 1, y: 0, duration: 0.46 }, "-=0.4")
          .to(".project-overview-summary", { autoAlpha: 1, y: 0, duration: 0.58 }, "-=0.5")
          .to(rules, { scaleX: 1, duration: 0.62, stagger: 0.07 }, "-=0.18")
          .to(facts, { autoAlpha: 1, y: 0, duration: 0.52, stagger: 0.07 }, "<0.08");
      }, section);

      return () => context.revert();
    });

    return () => media.revert();
  }, []);

  return (
    <section
      ref={root}
      id="project-overview"
      className="project-overview"
      aria-labelledby="project-overview-heading"
    >
      <div className="project-overview-sheet">
        <header className="project-overview-masthead">
          <div className="project-overview-register-heading">
            <span aria-hidden="true">02 /</span>
            <h2 id="project-overview-heading">PROJECT OVERVIEW</h2>
          </div>
          <p className="project-overview-record-id">PROJECT / {recordNumber}</p>
        </header>

        <div className="project-overview-composition">
          <div className="project-overview-statement-wrap">
            <span className="project-overview-coordinate project-overview-coordinate--a" aria-hidden="true">A01</span>
            <p className="project-overview-statement">
              {statement.map((line, index) => (
                <span
                  className={`project-overview-statement-line${index === statement.length - 1 ? " project-overview-statement-line--wide" : ""}`}
                  key={line}
                >
                  <span>{line}</span>
                </span>
              ))}
            </p>
            <p className="project-overview-location-line">{location.replace(", ", " / ")}</p>
          </div>

          <div className="project-overview-summary-wrap">
            <span className="project-overview-coordinate project-overview-coordinate--b" aria-hidden="true">B02</span>
            <p className="project-overview-summary-label">FIELD RECORD / {recordNumber}</p>
            <p className="project-overview-summary">{summary}</p>
          </div>

          <span className="project-overview-watermark" aria-hidden="true">{recordNumber}</span>
        </div>

        <div className="project-overview-facts-heading" aria-hidden="true">
          <span>FIELD INDEX</span>
          <span>VERIFIED PROJECT DATA</span>
        </div>

        <dl className="project-overview-facts">
          {facts.map(([label, value], index) => (
            <div className="project-overview-fact" key={label}>
              <span className="project-overview-fact-rule" aria-hidden="true" />
              <dt>
                <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <span>{label}</span>
              </dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
