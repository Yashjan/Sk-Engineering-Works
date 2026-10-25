"use client";

import ProgressiveVideo from "@/components/media/ProgressiveVideo";

import Image from "@/components/media/ProgressiveImage";
import Link from "next/link";
import {
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projectArchive, type ProjectArchiveRecord } from "@/data/projects";
import { assetPath } from "@/lib/asset-path";
import "./projects-field-archive.css";

type FilterId = "all" | "salt-plants" | "machinery" | "material-handling" | "air-dust" | "process-equipment";

const FILTER_LABELS: Record<FilterId, string> = {
  all: "ALL",
  "salt-plants": "SALT PLANTS",
  machinery: "MACHINERY",
  "material-handling": "MATERIAL HANDLING",
  "air-dust": "AIR + DUST",
  "process-equipment": "PROCESS EQUIPMENT",
};

const FILTER_ORDER: FilterId[] = ["all", "salt-plants", "machinery", "material-handling", "air-dust", "process-equipment"];
const number = (value: number) => String(value).padStart(2, "0");
const fieldNumber = (project: ProjectArchiveRecord) => String(projectArchive.findIndex((item) => item.id === project.id) + 1).padStart(3, "0");
const isMachinery = (project: ProjectArchiveRecord) => project.category !== "salt-plants";
const matchesFilter = (project: ProjectArchiveRecord, filter: FilterId) => (
  filter === "all" || (filter === "machinery" ? isMachinery(project) : project.category === filter)
);

export default function ProjectsFieldArchive() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const rail = useRef<HTMLOListElement>(null);
  const pointerStart = useRef<number | null>(null);
  const switching = useRef(false);
  const [filter, setFilter] = useState<FilterId>("all");
  const [activeId, setActiveId] = useState(projectArchive[0].id);

  const availableFilters = useMemo(() => FILTER_ORDER.filter((candidate) => {
    if (candidate === "all") return true;
    return projectArchive.some((project) => matchesFilter(project, candidate));
  }), []);
  const filteredProjects = useMemo(
    () => projectArchive.filter((project) => matchesFilter(project, filter)),
    [filter],
  );
  const activeIndex = Math.max(0, filteredProjects.findIndex((project) => project.id === activeId));
  const activeProject = filteredProjects[activeIndex] ?? filteredProjects[0];

  useLayoutEffect(() => {
    const section = root.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger: section, start: "top 78%", once: true },
        })
          .to(".projects-field-archive-label", { autoAlpha: 1, y: 0, duration: 0.42 })
          .to(".projects-field-archive-heading-line > span", { y: 0, duration: 0.76, stagger: 0.07 }, "-=0.2")
          .to(".projects-field-archive-filter", { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.035 }, "-=0.28")
          .to(".projects-field-explorer", { autoAlpha: 1, y: 0, duration: 0.72 }, "-=0.2");
      }, section);

      return () => context.revert();
    });

    return () => media.revert();
  }, []);

  useLayoutEffect(() => {
    const container = stage.current;
    if (!container) return;
    switching.current = false;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(container.querySelectorAll("[data-active-content]"), { clearProps: "all" });
      return;
    }

    const context = gsap.context(() => {
      gsap.fromTo(".projects-field-explorer-media-frame", {
        autoAlpha: 0,
        scale: 1.015,
        y: 14,
        clipPath: "inset(8% 0 0 0)",
      }, {
        autoAlpha: 1,
        scale: 1,
        y: 0,
        clipPath: "inset(0% 0 0 0)",
        duration: 0.62,
        ease: "power3.out",
      });
      gsap.fromTo(".projects-field-explorer-counter-current", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.42, ease: "power3.out" });
      gsap.fromTo(".projects-field-explorer-media-label", { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power3.out", delay: 0.08 });
      gsap.fromTo(".projects-field-explorer-info > *", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.48, stagger: 0.055, ease: "power3.out", delay: 0.08 });
    }, container);

    return () => context.revert();
  }, [activeId, filter]);

  useEffect(() => {
    const element = video.current;
    const section = root.current;
    if (!element || !section) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let disposed = false;
    const sync = () => {
      const shouldPlay = visible && !disposed && !document.hidden && !reducedMotion.matches;
      if (shouldPlay) {
        void element.play().then(() => {
          if (disposed || !visible || document.hidden || reducedMotion.matches) element.pause();
        }).catch(() => {});
      } else {
        element.pause();
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio >= 0.2;
      sync();
    }, { threshold: [0, 0.2, 0.5] });

    observer.observe(section);
    reducedMotion.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      disposed = true;
      observer.disconnect();
      reducedMotion.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      element.pause();
    };
  }, [activeProject.id]);

  useEffect(() => {
    const list = rail.current;
    const active = list?.querySelector<HTMLElement>(`[data-project-id="${activeId}"]`);
    if (!list || !active) return;

    const target = active.offsetLeft - (list.clientWidth - active.offsetWidth) / 2;
    list.scrollTo({
      left: Math.max(0, target),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  }, [activeId, filter]);

  const activate = (id: string) => {
    if (id === activeId || switching.current) return;
    const container = stage.current;
    if (!container || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setActiveId(id);
      return;
    }

    switching.current = true;
    const timeline = gsap.timeline({ onComplete: () => setActiveId(id) });
    timeline
      .to(container.querySelector(".projects-field-explorer-media-frame"), {
        autoAlpha: 0,
        scale: 0.985,
        y: -10,
        duration: 0.3,
        ease: "power3.in",
      })
      .to(container.querySelectorAll(".projects-field-explorer-counter-current, .projects-field-explorer-info, .projects-field-explorer-media-label"), {
        autoAlpha: 0,
        y: -10,
        duration: 0.24,
        stagger: 0.018,
        ease: "power3.in",
      }, "<");
  };

  const changeFilter = (nextFilter: FilterId) => {
    if (nextFilter === filter) return;
    const nextProjects = projectArchive.filter((project) => matchesFilter(project, nextFilter));
    setFilter(nextFilter);
    if (!nextProjects.some((project) => project.id === activeId)) setActiveId(nextProjects[0].id);
  };

  const step = (direction: -1 | 1) => {
    const nextIndex = (activeIndex + direction + filteredProjects.length) % filteredProjects.length;
    activate(filteredProjects[nextIndex].id);
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse") return;
    pointerStart.current = event.clientX;
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (pointerStart.current === null) return;
    const distance = event.clientX - pointerStart.current;
    pointerStart.current = null;
    if (Math.abs(distance) < 45) return;
    step(distance < 0 ? 1 : -1);
  };

  return (
    <section ref={root} id="field-records" className="projects-field-archive" aria-labelledby="projects-field-archive-heading">
      <div className="projects-field-archive-shell">
        <header className="projects-field-archive-intro">
          <p className="projects-field-archive-label">FIELD ARCHIVE / 02</p>
          <h2 id="projects-field-archive-heading" className="projects-field-archive-heading">
            <span className="projects-field-archive-heading-line"><span>PROJECTS</span></span>
            <span className="projects-field-archive-heading-line"><span>BUILT IN THE FIELD.</span></span>
          </h2>
        </header>

        <div className="projects-field-archive-filters" role="group" aria-label="Filter projects">
          {availableFilters.map((item) => (
            <button
              key={item}
              type="button"
              className="projects-field-archive-filter"
              aria-pressed={filter === item}
              onClick={() => changeFilter(item)}
            >
              {FILTER_LABELS[item]}
            </button>
          ))}
        </div>

        <div ref={stage} className={`projects-field-explorer${activeProject.isFeatured ? " projects-field-explorer--flagship" : ""}`}>
          <p className="projects-field-explorer-counter" aria-label={`Project ${activeIndex + 1} of ${filteredProjects.length}`}>
            <span key={activeProject.id} data-active-content className="projects-field-explorer-counter-current">{number(activeIndex + 1)}</span>
            <span aria-hidden="true"> / {number(filteredProjects.length)}</span>
          </p>

          <div
            className="projects-field-explorer-media"
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={() => { pointerStart.current = null; }}
          >
            <div key={activeProject.id} data-active-content className="projects-field-explorer-media-frame">
              {activeProject.mediaType === "video" ? (
                <ProgressiveVideo
                  ref={video}
                  src={assetPath(activeProject.mediaSrc)}
                  poster={activeProject.poster ? assetPath(activeProject.poster) : undefined}
                  aria-label={activeProject.mediaAlt}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
              ) : (
                <Image
                  src={assetPath(activeProject.mediaSrc)}
                  alt={activeProject.mediaAlt}
                  fill
                  priority={activeProject.isFeatured}
                  sizes="(max-width: 767px) 88vw, (max-width: 1099px) 76vw, 68vw"
                />
              )}
            </div>
            <p key={`label-${activeProject.id}`} data-active-content className="projects-field-explorer-media-label">{activeProject.mediaLabel}</p>
          </div>

          <div key={`info-${activeProject.id}`} data-active-content className="projects-field-explorer-info">
            <p className="projects-field-explorer-field">FIELD / {fieldNumber(activeProject)}</p>
            <h3>{activeProject.name}</h3>
            {activeProject.capacity && <p className="projects-field-explorer-capacity">{activeProject.capacity} SALT REFINERY</p>}
            {activeProject.location && <p className="projects-field-explorer-location">{activeProject.location.replace(", ", " / ")}</p>}
            <Link className="projects-field-explorer-link" href={activeProject.detailHref}>
              <span>VIEW PROJECT</span>
              <span aria-hidden="true">↗</span>
            </Link>
          </div>

          <div className="projects-field-explorer-mobile-nav" aria-label="Project navigation">
            <button type="button" onClick={() => step(-1)}>← PREVIOUS</button>
            <button type="button" onClick={() => step(1)}>NEXT →</button>
          </div>

          <nav className="projects-field-explorer-rail" aria-label="Project index">
            <span className="projects-field-explorer-rail-line" aria-hidden="true" />
            <ol ref={rail}>
              {filteredProjects.map((project, index) => (
                <li key={project.id}>
                  <button
                    type="button"
                    data-project-id={project.id}
                    aria-current={project.id === activeProject.id ? "true" : undefined}
                    onPointerEnter={(event) => { if (event.pointerType === "mouse") activate(project.id); }}
                    onFocus={() => activate(project.id)}
                    onClick={() => activate(project.id)}
                  >
                    <span>{number(index + 1)}</span>
                    <span>{project.name}</span>
                  </button>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>
    </section>
  );
}
