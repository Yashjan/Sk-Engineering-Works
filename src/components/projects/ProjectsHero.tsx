"use client";

import Image from "@/components/media/ProgressiveImage";
import ProgressiveVideo from "@/components/media/ProgressiveVideo";
import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { assetPath } from "@/lib/asset-path";
import "./projects-hero.css";

const primaryMedia = {
  id: "projects-in-motion",
  className: "projects-hero-evidence-motion",
  src: "/images/projects/page-hero/projects-hero-plant.mp4",
  poster: "/images/projects/page-hero/plant-exterior-concept.webp",
  alt: "S.K. Engineering Works salt refinery project footage",
  label: "PROJECTS IN MOTION",
  detail: "FIELD EXECUTION",
  speed: 8,
};

const supportingMedia = [
  {
    id: "plant-exterior",
    className: "projects-hero-evidence-exterior",
    src: "/images/projects/page-hero/plant-exterior-concept.webp",
    alt: "Salt refinery facility with production building and covered material handling area",
    label: "PLANT INFRASTRUCTURE",
    detail: "INDUSTRIAL FACILITY",
    speed: 7,
  },
  {
    id: "installed-machinery",
    className: "projects-hero-evidence-installed",
    src: "/images/projects/page-hero/installed-machinery-concept.webp",
    alt: "Installed salt refinery process machinery with cyclone and connected ducting",
    label: "PROCESSING SYSTEMS",
    detail: "EQUIPMENT INTEGRATION",
    speed: -6,
  },
  {
    id: "refinery-system",
    className: "projects-hero-evidence-system",
    src: "/images/projects/page-hero/refinery-equipment-concept.webp",
    alt: "Connected salt refinery equipment arranged as a complete process line",
    label: "REFINERY EQUIPMENT",
    detail: "CONNECTED PROCESS LINE",
    speed: 5,
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
      } else {
        element.pause();
      }
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
          <p className="projects-hero-eyebrow">PROJECTS / PLANT SYSTEMS</p>
          <p>ENGINEERING RECORDS / SK</p>
        </div>

        <div className="projects-hero-composition">
          <h1 id="projects-hero-heading" className="projects-hero-heading">
            <span className="projects-hero-heading-line"><span>BUILT.</span></span>
            <span className="projects-hero-heading-line"><span>INSTALLED.</span></span>
            <span className="projects-hero-heading-line"><span>RUNNING.</span></span>
          </h1>

          <div className="projects-hero-filmstrip" aria-label="Project execution evidence">
            <figure
              className={`projects-hero-evidence ${primaryMedia.className}`}
              data-project-parallax={primaryMedia.speed}
            >
              <div className="projects-hero-media-visual">
                <ProgressiveVideo
                  ref={video}
                  src={assetPath(primaryMedia.src)}
                  poster={assetPath(primaryMedia.poster)}
                  aria-label={primaryMedia.alt}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
              </div>
              <figcaption className="projects-hero-media-meta">
                <span>{primaryMedia.label}</span>
                <strong>{primaryMedia.detail}</strong>
              </figcaption>
            </figure>

            {supportingMedia.map((item) => (
              <figure
                key={item.id}
                className={`projects-hero-evidence ${item.className}`}
                data-project-parallax={item.speed}
              >
                <div className="projects-hero-media-visual">
                  <Image
                    src={assetPath(item.src)}
                    alt={item.alt}
                    fill
                    loading={item.id === "plant-exterior" ? "eager" : undefined}
                    sizes="(max-width: 767px) 92vw, (max-width: 1099px) 58vw, 26vw"
                  />
                </div>
                <figcaption className="projects-hero-media-meta">
                  <span>{item.label}</span>
                  <strong>{item.detail}</strong>
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="projects-hero-support">
            <p>From engineered equipment to integrated refinery systems, explore the scale, craftsmanship and technical capabilities behind S.K. Engineering Works.</p>
          </div>
        </div>

        <footer className="projects-hero-footer">
          <p>SCROLL TO EXPLORE PROJECTS <span aria-hidden="true">&darr;</span></p>
          <span aria-hidden="true" />
          <p>FACILITY / EQUIPMENT / PROCESS</p>
        </footer>
      </div>
    </section>
  );
}
