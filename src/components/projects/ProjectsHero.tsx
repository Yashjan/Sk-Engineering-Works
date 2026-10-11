"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { assetPath } from "@/lib/asset-path";
import "./projects-hero.css";

const evidence = [
  {
    id: "completed-plant",
    className: "projects-hero-evidence-primary",
    type: "video" as const,
    src: "/images/projects/jagdamba/03_jagdamba_completed_plant.mp4",
    poster: "/images/projects/jagdamba/04_jagdamba_project_cover.jpg",
    alt: "Completed 15 TPH salt refinery plant in Phalodi, Rajasthan",
    label: "15 TPH / SALT REFINERY",
    detail: "PHALODI / RAJASTHAN",
    speed: 11,
  },
  {
    id: "air-handling",
    className: "projects-hero-evidence-air",
    type: "image" as const,
    src: "/images/salt-refinery/execution/fabrication-blower.jpeg",
    alt: "Fabricated ID fan and blower inside the S.K. Engineering Works workshop",
    label: "AIR HANDLING",
    detail: "ID FAN / BLOWER",
    speed: -7,
  },
  {
    id: "plant-structure",
    className: "projects-hero-evidence-structure",
    type: "image" as const,
    src: "/images/salt-refinery/execution/plant-structure.jpeg",
    alt: "Salt refinery equipment installed within a fabricated plant structure",
    label: "PROJECT EXECUTION",
    detail: "INSTALLED PLANT STRUCTURE",
    speed: 8,
  },
  {
    id: "workshop-fabrication",
    className: "projects-hero-evidence-workshop",
    type: "image" as const,
    src: "/images/salt-refinery/execution/fabricated-equipment.jpeg",
    alt: "Industrial salt processing equipment during workshop fabrication",
    label: "WORKSHOP RECORD",
    detail: "EQUIPMENT FABRICATION",
    speed: -5,
  },
];

export default function ProjectsHero() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  useLayoutEffect(() => {
    const section = root.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        gsap.timeline({ defaults: { ease: "power3.out" } })
          .to(".projects-hero-topline p", { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.06 })
          .to(".projects-hero-heading-line > span", { y: 0, duration: 0.72, stagger: 0.09 }, "-=0.14")
          .to(".projects-hero-media-visual", { autoAlpha: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)", duration: 0.72, stagger: 0.11 }, "-=0.42")
          .to(".projects-hero-media-meta", { autoAlpha: 1, y: 0, duration: 0.42, stagger: 0.07 }, "-=0.32")
          .to(".projects-hero-support", { autoAlpha: 1, y: 0, duration: 0.5 }, "-=0.16")
          .to(".projects-hero-footer", { autoAlpha: 1, y: 0, duration: 0.42 }, "-=0.22");

        gsap.utils.toArray<HTMLElement>("[data-project-parallax]").forEach((element) => {
          const distance = Number(element.dataset.projectParallax ?? 0);
          gsap.to(element, {
            y: distance,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom top",
              scrub: 0.8,
            },
          });
        });
      }, section);

      return () => context.revert();
    });

    return () => media.revert();
  }, []);

  useEffect(() => {
    const section = root.current;
    const element = video.current;
    if (!section || !element) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let disposed = false;
    const syncPlayback = () => {
      if (!disposed && visible && !document.hidden && !reducedMotion.matches) {
        void element.play().then(() => {
          if (disposed || !visible || document.hidden || reducedMotion.matches) element.pause();
        }).catch(() => {});
        return;
      }
      element.pause();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncPlayback();
    }, { threshold: 0.08 });

    observer.observe(section);
    reducedMotion.addEventListener("change", syncPlayback);
    document.addEventListener("visibilitychange", syncPlayback);
    syncPlayback();
    return () => {
      disposed = true;
      observer.disconnect();
      reducedMotion.removeEventListener("change", syncPlayback);
      document.removeEventListener("visibilitychange", syncPlayback);
      element.pause();
    };
  }, []);

  return (
    <section ref={root} className="projects-hero" aria-labelledby="projects-hero-heading">
      <div className="projects-hero-shell">
        <div className="projects-hero-topline">
          <p className="projects-hero-eyebrow">PROJECTS / FIELD PROOF</p>
          <p>FIELD RECORDS / SK</p>
        </div>

        <div className="projects-hero-composition">
          <h1 id="projects-hero-heading" className="projects-hero-heading">
            <span className="projects-hero-heading-line"><span>BUILT.</span></span>
            <span className="projects-hero-heading-line"><span>INSTALLED.</span></span>
            <span className="projects-hero-heading-line"><span>RUNNING.</span></span>
          </h1>

          <div className="projects-hero-filmstrip" aria-label="Project execution evidence">
            {evidence.map((item) => (
              <figure
                key={item.id}
                className={`projects-hero-evidence ${item.className}`}
                data-project-parallax={item.speed}
              >
                <div className="projects-hero-media-visual">
                  {item.type === "video" ? (
                    <video
                      ref={video}
                      src={assetPath(item.src)}
                      poster={assetPath(item.poster)}
                      aria-label={item.alt}
                      muted
                      loop
                      playsInline
                      preload="metadata"
                    />
                  ) : (
                    <Image
                      src={assetPath(item.src)}
                      alt={item.alt}
                      fill
                      sizes="(max-width: 767px) 88vw, (max-width: 1099px) 52vw, 28vw"
                    />
                  )}
                </div>
                <figcaption className="projects-hero-media-meta">
                  <span>{item.label}</span>
                  <strong>{item.detail}</strong>
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="projects-hero-support">
            <p>Real refinery projects, industrial equipment and on-site execution by S.K. Engineering Works.</p>
            <p>From complete salt plants to fabricated machinery installed in real production environments.</p>
          </div>
        </div>

        <footer className="projects-hero-footer">
          <p>SCROLL TO EXPLORE PROJECTS <span aria-hidden="true">&darr;</span></p>
          <span aria-hidden="true" />
          <p>EXECUTION / INSTALLATION / OPERATION</p>
        </footer>
      </div>
    </section>
  );
}
