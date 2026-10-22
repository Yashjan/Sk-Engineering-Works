"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { EngineeringNote } from "@/data/engineering-notes";
import "./project-engineering-notes.css";

type ProjectEngineeringNotesProps = {
  sectionNumber: string;
  heading: readonly string[];
  intro: string;
  notes: readonly EngineeringNote[];
};

export default function ProjectEngineeringNotes({
  sectionNumber,
  heading,
  intro,
  notes,
}: ProjectEngineeringNotesProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger: section, start: "top 78%", once: true },
        })
          .fromTo(".project-notes-kicker", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.42 })
          .fromTo(".project-notes-heading-line > span", { yPercent: 108 }, { yPercent: 0, duration: 0.78, stagger: 0.09 }, "-=0.16")
          .fromTo(".project-notes-intro-copy", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.5 }, "-=0.38");

        gsap.utils.toArray<HTMLElement>(".project-note", section).forEach((note) => {
          const rule = note.querySelector(".project-note-rule");
          const content = note.querySelectorAll(".project-note-number, .project-note-title, .project-note-body");

          gsap.timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: { trigger: note, start: "top 84%", once: true },
          })
            .fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 0.58 })
            .fromTo(content, { autoAlpha: 0, y: 20 }, {
              autoAlpha: 1,
              y: 0,
              duration: 0.52,
              stagger: 0.07,
            }, "-=0.34");
        });
      }, section);

      return () => context.revert();
    });

    return () => media.revert();
  }, []);

  return (
    <section ref={sectionRef} id="engineering-notes" className="project-notes" aria-labelledby="project-notes-heading">
      <div className="project-notes-shell">
        <header className="project-notes-intro">
          <p className="project-notes-kicker">{sectionNumber} / ENGINEERING NOTES</p>
          <h2 id="project-notes-heading" className="project-notes-heading">
            {heading.map((line) => (
              <span className="project-notes-heading-line" key={line}><span>{line}</span></span>
            ))}
          </h2>
          <p className="project-notes-intro-copy">{intro}</p>
          <p className="project-notes-marker">PROJECT / 001<br />GENERAL OBSERVATIONS</p>
        </header>

        <div className="project-notes-register">
          {notes.map((note) => (
            <article className="project-note" key={note.id}>
              <span className="project-note-rule" aria-hidden="true" />
              <p className="project-note-number" aria-hidden="true">{note.id}</p>
              <h3 className="project-note-title">{note.title}</h3>
              <p className="project-note-body">{note.body}</p>
            </article>
          ))}
        </div>
      </div>
      <span className="project-notes-registration project-notes-registration--top" aria-hidden="true" />
      <span className="project-notes-registration project-notes-registration--bottom" aria-hidden="true" />
    </section>
  );
}
