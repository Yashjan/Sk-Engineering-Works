"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects, type Project, type ProjectMedia } from "@/data/projects";
import { assetPath } from "@/lib/asset-path";
import "./featured-project.css";

type FeaturedProjectRecord = Project & { client: string; detailHref: string };
type FeaturedProjectVideo = ProjectMedia & { type: "video" };

function getFeaturedProject(): { project: FeaturedProjectRecord; media: FeaturedProjectVideo } {
  const project = projects.find((item) => item.id === "jagdamba-phalodi");
  const media = project?.media.find((item) => item.id === "completed");
  if (!project?.client || !project.detailHref || media?.type !== "video") {
    throw new Error("The Jagdamba featured project record is incomplete.");
  }
  return { project: project as FeaturedProjectRecord, media: media as FeaturedProjectVideo };
}

const { project: featuredProject, media: completedPlantMedia } = getFeaturedProject();

const projectFacts = [
  ["CLIENT", featuredProject.client],
  ["CAPACITY", featuredProject.capacity],
  ["LOCATION", featuredProject.location],
  ["TYPE", featuredProject.projectType.replace(/ plant$/i, "")],
] as const;

const executionProof = ["COMPLETE SALT REFINERY", "FABRICATION", "INSTALLATION", "PLANT EXECUTION"];

export default function FeaturedProject() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  useLayoutEffect(() => {
    const section = root.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: section,
            start: "top 74%",
            toggleActions: "play none none none",
          },
        })
          .to(".featured-project-label, .featured-project-record", { autoAlpha: 1, y: 0, duration: 0.42, stagger: 0.06 })
          .to(".featured-project-client, .featured-project-location", { autoAlpha: 1, y: 0, duration: 0.48, stagger: 0.07 }, "-=0.18")
          .to(".featured-project-heading-line > span", { y: 0, yPercent: 0, duration: 0.76, stagger: 0.1 }, "-=0.18")
          .to(".featured-project-media-frame", { autoAlpha: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)", duration: 0.85 }, "-=0.32")
          .to(".featured-project-media-caption, .featured-project-fact, .featured-project-proof li", { autoAlpha: 1, y: 0, duration: 0.42, stagger: 0.045 }, "-=0.3")
          .to(".featured-project-link", { autoAlpha: 1, y: 0, duration: 0.45 }, "-=0.12");
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
    const canPlay = () => !disposed && visible && !document.hidden && !reducedMotion.matches;
    const syncPlayback = () => {
      if (canPlay()) {
        void element.play().then(() => {
          if (!canPlay()) element.pause();
        }).catch(() => {});
      } else {
        element.pause();
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio >= 0.2;
      syncPlayback();
    }, { threshold: [0, 0.2, 0.5] });

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
    <section ref={root} id="featured-project" className="featured-project" aria-labelledby="featured-project-heading">
      <div className="featured-project-shell">
        <div className="featured-project-topline">
          <p className="featured-project-label">FEATURED PROJECT / 02</p>
          <p className="featured-project-record">FIELD RECORD / 001</p>
        </div>

        <header className="featured-project-identity">
          <p className="featured-project-client">{featuredProject.client}</p>
          <h2 id="featured-project-heading" className="featured-project-heading">
            <span className="featured-project-heading-line"><span>{featuredProject.capacity}</span></span>
            <span className="featured-project-heading-line"><span>SALT REFINERY.</span></span>
          </h2>
          <p className="featured-project-location">{featuredProject.location}</p>
        </header>

        <div className="featured-project-stage">
          <aside className="featured-project-facts" aria-label="Featured project facts">
            <dl>
              {projectFacts.map(([label, value]) => (
                <div key={label} className="featured-project-fact">
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
            <Link className="featured-project-link" href={featuredProject.detailHref}>
              <span>VIEW PROJECT</span>
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </aside>

          <figure className="featured-project-media">
            <div className="featured-project-media-frame">
              <video
                ref={video}
                src={assetPath(completedPlantMedia.src)}
                poster={assetPath(featuredProject.coverImage)}
                aria-label="Completed 15 TPH Jagdamba salt refinery in Phalodi, Rajasthan"
                muted
                loop
                playsInline
                preload="metadata"
              />
            </div>
            <figcaption className="featured-project-media-caption">
              <span>COMPLETED PLANT / PROJECT FOOTAGE</span>
              <span>JAGDAMBA / PHALODI</span>
            </figcaption>
            <ul className="featured-project-proof" aria-label="Project execution scope">
              {executionProof.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </figure>
        </div>
      </div>
    </section>
  );
}
