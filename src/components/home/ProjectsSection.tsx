"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import type { Project } from "@/data/projects";
import "./projects-section.css";

type ProjectWithAsset = Project & { hasImage: boolean };

function ProjectVisual({ project }: { project: ProjectWithAsset }) {
  return project.hasImage ? (
    <Image src={project.image} alt={`${project.title} installation`} fill sizes="(min-width: 900px) 58vw, 94vw" className="projects-image" priority={project.id === "jagdamba-phalodi"} />
  ) : (
    <div className="projects-image-placeholder" aria-hidden="true">
      <span className="projects-placeholder-grid" />
      <span className="projects-placeholder-frame projects-placeholder-frame-one" />
      <span className="projects-placeholder-frame projects-placeholder-frame-two" />
      <span className="projects-placeholder-label">INSTALLATION VIEW / {project.capacity}</span>
    </div>
  );
}

export default function ProjectsSection({ projects }: { projects: ProjectWithAsset[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const media = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const active = projects[activeIndex];

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      gsap.fromTo([media.current, copy.current],
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.55, ease: "power2.out", stagger: 0.04 },
      );
      const image = media.current?.querySelector(".projects-image, .projects-image-placeholder");
      if (image) {
        gsap.fromTo(image,
          { scale: 1.02 },
          { scale: 1, duration: 0.62, ease: "power2.out" },
        );
      }
    }, media);
    return () => context.revert();
  }, [activeIndex]);

  return (
    <section id="projects" className="projects-section" aria-labelledby="projects-heading">
      <div className="projects-shell">
        <header className="projects-intro">
          <p className="projects-eyebrow">PROJECTS <span>/ 02</span></p>
          <div className="projects-intro-row">
            <h2 id="projects-heading">BUILT FOR<br /><em>REAL PRODUCTION.</em></h2>
            <p>Salt refinery projects engineered for performance, reliability and long-term operation across diverse production requirements.</p>
          </div>
        </header>

        <div className="projects-feature">
          <div ref={copy} className="projects-copy">
            <p className="projects-feature-label">FEATURED INSTALLATION <span>— {String(activeIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</span></p>
            <p className="projects-client">{active.client || "INSTALLED PLANT PROJECT"}</p>
            <h3>{active.title}</h3>
            <p className="projects-location">{active.location}</p>
            <dl className="projects-meta">
              <div><dt>CAPACITY</dt><dd>{active.capacity}</dd></div>
              <div><dt>SCOPE</dt><dd>{active.scope}</dd></div>
              <div><dt>PROJECT TYPE</dt><dd>{active.projectType}</dd></div>
            </dl>
            {active.scopeChips && <ul className="projects-chips" aria-label="Selected project scope">{active.scopeChips.map((chip) => <li key={chip}>{chip}</li>)}</ul>}
            <a className="projects-view-link" href="#projects">VIEW PROJECT <span aria-hidden="true">→</span></a>
          </div>
          <div ref={media} className="projects-media">
            <ProjectVisual key={active.id} project={active} />
            <span className="projects-media-index">{String(activeIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</span>
          </div>
        </div>

        <nav className="projects-selector" aria-label="Installed plant projects">
          <div className="projects-selector-line" aria-hidden="true" />
          <ol>
            {projects.map((project, index) => (
              <li key={project.id}>
                <button type="button" className="project-selector-button" aria-current={index === activeIndex ? "true" : undefined} onClick={() => setActiveIndex(index)}>
                  <span className="project-selector-thumb" aria-hidden="true"><span /></span>
                  <span className="project-selector-copy"><strong>{String(index + 1).padStart(2, "0")}</strong><span>{project.capacity}</span><small>{project.location}</small></span>
                </button>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </section>
  );
}
