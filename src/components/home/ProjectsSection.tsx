"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import type { Project, ProjectMedia } from "@/data/projects";
import ProjectArchive from "./ProjectArchive";
import "./projects-section.css";

type ProjectWithAsset = Project & { hasImage: boolean };

function ProjectVisual({ project, media, videoRef, muted, onPlayStateChange }: { project: ProjectWithAsset; media?: ProjectMedia; videoRef: React.RefObject<HTMLVideoElement | null>; muted: boolean; onPlayStateChange: (playing: boolean) => void }) {
  if (media?.type === "video") {
    return <video ref={videoRef} className="projects-video" src={media.src} poster={project.hasImage ? project.coverImage : undefined} muted={muted} playsInline loop preload="metadata" aria-label={`${project.title} — ${media.label.toLowerCase()}`} onPlay={() => onPlayStateChange(true)} onPause={() => onPlayStateChange(false)} />;
  }
  if (media?.type === "image" && media.src) {
    return <Image src={media.src} alt={`${project.title} — ${media.label.toLowerCase()}`} fill sizes="(min-width: 900px) 58vw, 94vw" className="projects-image" priority={project.id === "jagdamba-phalodi"} />;
  }
  return project.hasImage ? (
    <Image src={project.coverImage} alt={`${project.title} installation`} fill sizes="(min-width: 900px) 58vw, 94vw" className="projects-image" priority={project.id === "jagdamba-phalodi"} />
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
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [entered, setEntered] = useState(false);
  const media = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const visible = useRef(false);
  const active = projects[activeIndex];
  const activeMedia = active.media[activeMediaIndex];

  const playVideo = () => {
    if (!video.current || !visible.current) return;
    void video.current.play().catch(() => setPlaying(false));
  };

  useEffect(() => {
    const section = media.current;
    if (!section) return;
    const currentVideo = video.current;
    const observer = new IntersectionObserver(([entry]) => {
      visible.current = entry.isIntersecting;
      if (entry.isIntersecting) setEntered(true);
      if (entry.isIntersecting) playVideo();
      else {
        video.current?.pause();
        setPlaying(false);
      }
    }, { threshold: 0.2 });
    observer.observe(section);
    return () => { observer.disconnect(); currentVideo?.pause(); };
  }, []);

  useEffect(() => {
    const currentVideo = video.current;
    currentVideo?.pause();
    playVideo();
    return () => { currentVideo?.pause(); };
  }, [activeIndex, activeMediaIndex]);

  useLayoutEffect(() => {
    if (!entered) return;
    const context = gsap.context(() => {
      gsap.fromTo([media.current, copy.current],
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.55, ease: "power2.out", stagger: 0.04 },
      );
      const image = media.current?.querySelector(".projects-image, .projects-video, .projects-image-placeholder");
      if (image) {
        gsap.fromTo(image,
          { scale: 1.02 },
          { scale: 1, duration: 0.62, ease: "power2.out" },
        );
      }
    }, media);
    return () => context.revert();
  }, [activeIndex, activeMediaIndex, entered]);

  const selectProject = (index: number) => {
    setActiveIndex(index);
    setActiveMediaIndex(0);
  };

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

        <div id="projects-featured" className="projects-feature" tabIndex={-1}>
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
          </div>
          <div ref={media} className="projects-media">
            <div className="projects-media-stage">
              <ProjectVisual key={`${active.id}-${activeMedia?.id || "cover"}`} project={active} media={activeMedia} videoRef={video} muted={muted} onPlayStateChange={setPlaying} />
              <div className="projects-media-overlay">
                <p>{active.client || "INSTALLED PLANT PROJECT"}</p>
                <strong>{activeMedia?.label || "PROJECT VIEW"}</strong>
                <small>{active.location.toUpperCase()}</small>
              </div>
              {activeMedia?.type === "video" && <div className="projects-media-controls">
                <button type="button" onClick={() => { if (playing) video.current?.pause(); else playVideo(); }} aria-label={playing ? "Pause project video" : "Play project video"}>{playing ? "PAUSE" : "PLAY"}</button>
                <button type="button" onClick={() => setMuted((value) => !value)} aria-label={muted ? "Turn project video sound on" : "Mute project video"}>{muted ? "SOUND OFF" : "SOUND ON"}</button>
              </div>}
              <span className="projects-media-index">{String(activeIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</span>
            </div>
            {active.media.length > 0 && <nav className="projects-chapters" aria-label={`${active.client || active.title} media chapters`}>
              {active.media.map((item, index) => <button key={item.id} type="button" aria-current={index === activeMediaIndex ? "true" : undefined} onClick={() => setActiveMediaIndex(index)}><span>{String(index + 1).padStart(2, "0")}</span><i aria-hidden="true" />{item.label}</button>)}
            </nav>}
          </div>
        </div>

      </div>
      <ProjectArchive projects={projects} onSelect={selectProject} />
    </section>
  );
}
