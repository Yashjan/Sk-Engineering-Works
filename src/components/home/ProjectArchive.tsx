"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Project } from "@/data/projects";
import "./project-archive.css";

type ArchiveProject = Project & { hasImage: boolean };
const number = (value: number) => String(value).padStart(2, "0");
const SCROLL_PER_TRAVEL_PIXEL = 0.45;

export default function ProjectArchive({ projects, onSelect }: {
  projects: ArchiveProject[];
  onSelect: (index: number) => void;
}) {
  const root = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const archive = root.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!archive || !viewport || !track) return;

    gsap.registerPlugin(ScrollTrigger);
    const tiles = Array.from(track.querySelectorAll<HTMLElement>(".project-archive-tile"));
    const links = tiles.map((tile) => tile.querySelector<HTMLAnchorElement>("a")!);
    const images = tiles.map((tile) => tile.querySelector<HTMLElement>(".project-archive-parallax")!);
    const counter = archive.querySelector<HTMLElement>("[data-archive-current]")!;
    const progress = archive.querySelector<HTMLElement>("[data-archive-progress]")!;
    const media = gsap.matchMedia();

    media.add({
      base: "all",
      desktop: "(min-width: 1024px)",
      reduce: "(prefers-reduced-motion: reduce)",
    }, (context) => {
      const pinned = Boolean(context.conditions?.desktop && !context.conditions?.reduce);
      archive.classList.toggle("is-pinned", pinned);
      let active = -1;
      let travel = 0;
      let viewportWidth = 0;
      let positions: { start: number; center: number }[] = [];
      let animation: gsap.core.Tween | undefined;
      let refreshFrame = 0;
      let scrollFrame = 0;
      let disposed = false;
      const moveImages = images.map((image) => gsap.quickSetter(image, "xPercent"));

      const measure = () => {
        viewportWidth = viewport.clientWidth;
        travel = Math.max(0, track.scrollWidth - viewportWidth);
        const first = tiles[0]?.offsetLeft ?? 0;
        positions = tiles.map((tile) => ({
          start: Math.max(0, Math.min(travel, tile.offsetLeft - first)),
          center: tile.offsetLeft + tile.offsetWidth / 2,
        }));
      };

      // Follow the rendered track, including scrub smoothing, rather than the
      // target scroll progress. Featured media state is deliberately separate.
      const render = (offset: number) => {
        let nearest = 0;
        let distance = Infinity;
        positions.forEach((position, index) => {
          const relative = position.center - offset - viewportWidth / 2;
          if (Math.abs(relative) < distance) {
            nearest = index;
            distance = Math.abs(relative);
          }
          if (pinned) moveImages[index](gsap.utils.clamp(-5, 5, -relative / viewportWidth * 8));
        });
        // A wide viewport can still center the penultimate tile at the end.
        if (travel > 0 && offset >= travel - 1) nearest = tiles.length - 1;
        if (nearest !== active) {
          active = nearest;
          counter.textContent = number(active + 1);
          tiles.forEach((tile, index) => {
            tile.dataset.active = String(index === active);
            if (index === active) links[index].setAttribute("aria-current", "true");
            else links[index].removeAttribute("aria-current");
          });
        }
        progress.style.transform = `scaleX(${travel ? gsap.utils.clamp(0, 1, offset / travel) : 1})`;
      };
      const renderPinned = () => render(-Number(gsap.getProperty(track, "x")));
      const renderNative = () => render(viewport.scrollLeft);

      measure();
      if (pinned && travel > 0) {
        viewport.scrollLeft = 0;
        animation = gsap.to(track, {
          x: () => { measure(); return -travel; },
          ease: "none",
          onUpdate: renderPinned,
          scrollTrigger: {
            id: "project-archive",
            trigger: archive,
            start: "top top",
            // Use the same live geometry for the tween and its pin duration.
            end: () => { measure(); return `+=${travel * SCROLL_PER_TRAVEL_PIXEL}`; },
            pin: true,
            scrub: 0.65,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onRefresh: () => { measure(); renderPinned(); },
          },
        });
        renderPinned();
      } else {
        renderNative();
      }

      const onScroll = () => {
        if (pinned || scrollFrame) return;
        scrollFrame = requestAnimationFrame(() => {
          scrollFrame = 0;
          renderNative();
        });
      };
      const refresh = () => {
        if (refreshFrame) cancelAnimationFrame(refreshFrame);
        refreshFrame = requestAnimationFrame(() => {
          refreshFrame = 0;
          if (disposed) return;
          measure();
          if (pinned) {
            // ProcessJourney is above this archive; refresh in document order.
            ScrollTrigger.sort();
            ScrollTrigger.refresh();
          } else renderNative();
        });
      };
      const onFocus = (event: FocusEvent) => {
        const index = links.findIndex((link) => link === event.target);
        if (index < 0 || !links[index].matches(":focus-visible")) return;
        const offset = positions[index]?.start ?? 0;
        const trigger = animation?.scrollTrigger;
        if (trigger && travel > 0) {
          viewport.scrollLeft = 0;
          const fraction = offset / travel;
          // Keep normal Tab/Shift+Tab order; reveal its focused tile immediately.
          window.scrollTo({ top: trigger.start + fraction * (trigger.end - trigger.start), behavior: "instant" });
          ScrollTrigger.update();
          trigger.getTween()?.progress(1);
          animation?.progress(fraction);
        } else {
          viewport.scrollTo({ left: offset, behavior: "instant" });
          renderNative();
        }
      };

      viewport.addEventListener("scroll", onScroll, { passive: true });
      viewport.addEventListener("focusin", onFocus);
      viewport.addEventListener("load", refresh, true);
      window.addEventListener("resize", refresh);
      window.addEventListener("pageshow", refresh);
      // The existing preview can change height when a project is selected.
      // Observe that sibling, never the pin spacer, to keep its start accurate.
      const featured = archive.closest(".projects-section")?.querySelector(".projects-feature");
      const layoutObserver = new ResizeObserver(refresh);
      if (featured) layoutObserver.observe(featured);
      refresh();

      return () => {
        disposed = true;
        cancelAnimationFrame(refreshFrame);
        cancelAnimationFrame(scrollFrame);
        viewport.removeEventListener("scroll", onScroll);
        viewport.removeEventListener("focusin", onFocus);
        viewport.removeEventListener("load", refresh, true);
        window.removeEventListener("resize", refresh);
        window.removeEventListener("pageshow", refresh);
        layoutObserver.disconnect();
        archive.classList.remove("is-pinned");
        images.forEach((image) => image.style.removeProperty("transform"));
      };
    }, archive);

    return () => media.revert();
  }, [projects]);

  return (
    <section ref={root} id="project-archive" className="project-archive" aria-labelledby="project-archive-heading">
      <header className="project-archive-header">
        <h3 id="project-archive-heading">PROJECT ARCHIVE</h3>
        <p className="project-archive-counter" aria-label="Current project">
          <span data-archive-current>01</span> / {number(projects.length)}
        </p>
      </header>
      <div ref={viewportRef} className="project-archive-viewport">
        <ol ref={trackRef} className="project-archive-track">
          {projects.map((project, index) => (
            <li key={project.id} className="project-archive-tile" data-active={index === 0 ? "true" : "false"}>
              {/* Reuse the existing project preview until dedicated routes exist. */}
              <a
                className="project-archive-link"
                href="#projects-featured"
                onClick={() => onSelect(index)}
                aria-current={index === 0 ? "true" : undefined}
                aria-label={`View ${project.client ? `${project.client}, ` : ""}${project.title}, ${project.location}`}
              >
                <div className="project-archive-image">
                  <div className="project-archive-parallax">
                    <div className="project-archive-hover">
                      {project.hasImage ? (
                        <Image
                          src={project.coverImage}
                          alt={`${project.client || project.projectType} — ${project.location}, ${project.capacity}`}
                          fill
                          sizes="(max-width: 767px) 95vw, (max-width: 1023px) 85vw, (min-width: 1452px) 1010px, 70vw"
                          loading="lazy"
                          className="project-archive-cover"
                        />
                      ) : (
                        <span className="project-archive-placeholder" aria-hidden="true">
                          <span className="project-archive-placeholder-label">{project.projectType} / {project.capacity}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="project-archive-info">
                  <span className="project-archive-number" aria-hidden="true">{number(index + 1)}</span>
                  <div className="project-archive-caption">
                    {project.client && <p className="project-archive-client">{project.client}</p>}
                    <h4>{project.title}</h4>
                    <p className="project-archive-location">{project.location}</p>
                  </div>
                  <span className="project-archive-action">VIEW PROJECT <span aria-hidden="true">→</span></span>
                </div>
              </a>
            </li>
          ))}
        </ol>
      </div>
      <footer className="project-archive-footer">
        <p className="project-archive-hint-desktop">SCROLL TO EXPLORE <span aria-hidden="true">↓</span></p>
        <p className="project-archive-hint-native">SWIPE / SCROLL TO EXPLORE <span aria-hidden="true">→</span></p>
        <div className="project-archive-progress" aria-hidden="true"><span data-archive-progress /></div>
      </footer>
    </section>
  );
}
