"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { assetPath } from "@/lib/asset-path";
import "./project-media-story.css";

type VideoRecord = {
  type: "video";
  id: string;
  number: string;
  className: string;
  src: string;
  caption: string;
  major?: boolean;
};

type ImageRecord = {
  type: "image";
  id: string;
  number: string;
  className: string;
  src: string;
  caption: string;
  alt: string;
};

type MediaRecord = VideoRecord | ImageRecord;

const poster = "/images/projects/jagdamba/hero/jagdamba-cover-1600.webp";
const records: readonly MediaRecord[] = [
  {
    type: "video",
    id: "completed-refinery",
    number: "01",
    className: "project-media-record--primary",
    src: "/images/projects/jagdamba/03_jagdamba_completed_plant.mp4",
    caption: "Installed process equipment inside the completed refinery.",
    major: true,
  },
  {
    type: "image",
    id: "refinery-building",
    number: "01",
    className: "project-media-record--frame",
    src: poster,
    caption: "Refinery building at the project site.",
    alt: "Exterior of the Jagdamba Salt refinery building at the Phalodi project site",
  },
  {
    type: "video",
    id: "workshop-fabrication",
    number: "02",
    className: "project-media-record--secondary",
    src: "/images/projects/jagdamba/01_jagdamba_fabrication.mp4",
    caption: "Fabricated equipment and workshop activity.",
  },
  {
    type: "video",
    id: "site-installation",
    number: "03",
    className: "project-media-record--final",
    src: "/images/projects/jagdamba/02_jagdamba_site_installation.mp4",
    caption: "Equipment, structural frame and installation activity at the project site.",
    major: true,
  },
];

export default function ProjectMediaStory() {
  const root = useRef<HTMLElement>(null);
  const videos = useRef(new Map<string, HTMLVideoElement>());
  const manualVideo = useRef<HTMLVideoElement | null>(null);
  const userPaused = useRef(new WeakSet<HTMLVideoElement>());
  const [playingId, setPlayingId] = useState<string | null>(null);

  const registerVideo = useCallback((id: string, element: HTMLVideoElement | null) => {
    if (element) videos.current.set(id, element);
    else videos.current.delete(id);
  }, []);

  const ensureVideoSource = useCallback((video: HTMLVideoElement) => {
    if (video.getAttribute("src")) return;
    const source = video.dataset.src;
    if (!source) return;
    video.src = source;
    video.load();
  }, []);

  const pauseAllExcept = useCallback((active?: HTMLVideoElement) => {
    videos.current.forEach((video) => {
      if (video !== active && !video.paused) video.pause();
    });
  }, []);

  const playVideo = useCallback((video: HTMLVideoElement) => {
    ensureVideoSource(video);
    pauseAllExcept(video);
    video.muted = true;
    if (video.paused) void video.play().catch(() => undefined);
  }, [ensureVideoSource, pauseAllExcept]);

  const toggleVideo = useCallback((id: string) => {
    const video = videos.current.get(id);
    if (!video) return;

    if (video.paused) {
      userPaused.current.delete(video);
      manualVideo.current = video;
      playVideo(video);
      return;
    }

    userPaused.current.add(video);
    if (manualVideo.current === video) manualVideo.current = null;
    video.pause();
  }, [playVideo]);

  useEffect(() => {
    const section = root.current;
    if (!section) return;

    const elements = [...videos.current.values()];
    const ratios = new Map(elements.map((video) => [video, 0]));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    let disposed = false;

    const syncPlayback = () => {
      if (disposed || document.hidden) {
        pauseAllExcept();
        return;
      }

      const manuallySelected = manualVideo.current;
      if (manuallySelected && (ratios.get(manuallySelected) ?? 0) >= 0.15) {
        playVideo(manuallySelected);
        return;
      }

      if (manuallySelected) manualVideo.current = null;

      if (reducedMotion.matches || connection?.saveData) {
        elements.forEach((video) => {
          if ((ratios.get(video) ?? 0) < 0.15 && !video.paused) video.pause();
        });
        return;
      }

      const viewportCenter = window.innerHeight / 2;
      const score = (video: HTMLVideoElement) => {
        const bounds = video.getBoundingClientRect();
        const centerDistance = Math.abs(bounds.top + bounds.height / 2 - viewportCenter);
        return (ratios.get(video) ?? 0) - Math.min(1, centerDistance / window.innerHeight) * 0.2;
      };
      const active = elements
        .filter((video) => !userPaused.current.has(video) && (ratios.get(video) ?? 0) >= 0.58)
        .sort((a, b) => score(b) - score(a))[0];

      if (active) playVideo(active);
      else pauseAllExcept();
    };

    const loadObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const video = entry.target as HTMLVideoElement;
        ensureVideoSource(video);
        observer.unobserve(video);
      });
    }, { rootMargin: "280px 0px", threshold: 0.01 });

    const playbackObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target as HTMLVideoElement;
        ratios.set(video, entry.intersectionRatio);
        if (entry.intersectionRatio < 0.05) userPaused.current.delete(video);
      });
      syncPlayback();
    }, { threshold: [0, 0.05, 0.15, 0.35, 0.5, 0.58, 0.75, 1] });

    elements.forEach((video) => {
      loadObserver.observe(video);
      playbackObserver.observe(video);
      video.addEventListener("loadedmetadata", syncPlayback);
    });
    reducedMotion.addEventListener("change", syncPlayback);
    document.addEventListener("visibilitychange", syncPlayback);

    return () => {
      disposed = true;
      loadObserver.disconnect();
      playbackObserver.disconnect();
      reducedMotion.removeEventListener("change", syncPlayback);
      document.removeEventListener("visibilitychange", syncPlayback);
      elements.forEach((video) => {
        video.removeEventListener("loadedmetadata", syncPlayback);
        video.pause();
      });
    };
  }, [ensureVideoSource, pauseAllExcept, playVideo]);

  useLayoutEffect(() => {
    const section = root.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        const intro = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger: section, start: "top 78%", once: true },
        });

        intro
          .fromTo(".project-media-story-label", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.42 })
          .fromTo(".project-media-story-heading-line > span", { yPercent: 112 }, { yPercent: 0, duration: 0.82, stagger: 0.1 }, "-=0.18")
          .fromTo(".project-media-story-summary", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.58 }, "-=0.45");

        gsap.utils.toArray<HTMLElement>(".project-media-record", section).forEach((record) => {
          const frame = record.querySelector<HTMLElement>(".project-media-frame");
          const details = record.querySelectorAll<HTMLElement>(".project-media-record-head, figcaption");
          const rule = record.querySelector<HTMLElement>(".project-media-record-rule");
          const major = record.hasAttribute("data-major");

          gsap.timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: { trigger: record, start: "top 82%", once: true },
          })
            .fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 0.62 })
            .fromTo(details, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.48, stagger: 0.08 }, "-=0.42")
            .fromTo(frame, {
              autoAlpha: 0,
              y: 42,
              scale: major ? 1.018 : 1.01,
              clipPath: major ? "inset(7% 0% 7% 0%)" : "inset(0% 0% 0% 0%)",
            }, {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              clipPath: "inset(0% 0% 0% 0%)",
              duration: major ? 0.9 : 0.72,
            }, "-=0.34");
        });
      }, section);

      return () => context.revert();
    });

    return () => media.revert();
  }, []);

  return (
    <section ref={root} id="field-footage" className="project-media-story" aria-labelledby="project-media-story-heading">
      <div className="project-media-story-intro">
        <p className="project-media-story-label">03 / FIELD FOOTAGE</p>
        <h2 id="project-media-story-heading" className="project-media-story-heading">
          <span className="project-media-story-heading-line"><span>PROJECT</span></span>
          <span className="project-media-story-heading-line"><span>IN MOTION.</span></span>
        </h2>
        <p className="project-media-story-summary">Real footage from the Jagdamba Salt 15 TPH refinery project in Phalodi, Rajasthan.</p>
      </div>

      <div className="project-media-sequence">
        {records.map((record) => {
          const label = record.type === "video" ? "FIELD CLIP" : "FIELD FRAME";
          const isPlaying = record.type === "video" && playingId === record.id;

          return (
            <figure
              className={`project-media-record ${record.className}`}
              data-major={record.type === "video" && record.major ? "true" : undefined}
              key={record.id}
            >
              <div className="project-media-record-head">
                <p>{label} / {record.number}</p>
                <p>JAGDAMBA SALT / PHALODI, RAJASTHAN</p>
                <span className="project-media-record-rule" aria-hidden="true" />
              </div>

              <div className="project-media-frame">
                {record.type === "video" ? (
                  <>
                    <video
                      ref={(element) => { registerVideo(record.id, element); }}
                      id={`project-media-${record.id}`}
                      data-src={assetPath(record.src)}
                      poster={assetPath(poster)}
                      width={1920}
                      height={1080}
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      disablePictureInPicture
                      aria-label={`${label} ${record.number}: ${record.caption}`}
                      onPlay={() => setPlayingId(record.id)}
                      onPause={() => setPlayingId((current) => current === record.id ? null : current)}
                    />
                    <button
                      type="button"
                      className="project-media-control"
                      aria-controls={`project-media-${record.id}`}
                      aria-pressed={isPlaying}
                      aria-label={`${isPlaying ? "Pause" : "Play"} field clip ${record.number}`}
                      onClick={() => toggleVideo(record.id)}
                    >
                      <span aria-hidden="true">{isPlaying ? "II" : "▶"}</span>
                      {isPlaying ? "PAUSE" : "PLAY"}
                    </button>
                  </>
                ) : (
                  <Image
                    src={assetPath(record.src)}
                    alt={record.alt}
                    fill
                    sizes="(max-width: 767px) 88vw, (max-width: 1199px) 56vw, 760px"
                  />
                )}
              </div>

              <figcaption>
                <span aria-hidden="true">{record.number}</span>
                <p>{record.caption}</p>
                <small>PROJECT / 001</small>
              </figcaption>
            </figure>
          );
        })}
      </div>
    </section>
  );
}
