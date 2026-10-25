"use client";

import ProgressiveVideo from "@/components/media/ProgressiveVideo";

import Image from "@/components/media/ProgressiveImage";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ProjectExecutionStage } from "@/data/project-execution";
import { assetPath } from "@/lib/asset-path";
import "./project-execution-journey.css";

type ProjectExecutionJourneyProps = {
  sectionNumber: string;
  heading: readonly string[];
  intro: string;
  stages: readonly ProjectExecutionStage[];
};

export default function ProjectExecutionJourney({
  sectionNumber,
  heading,
  intro,
  stages,
}: ProjectExecutionJourneyProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const videosRef = useRef(new Map<string, HTMLVideoElement>());
  const [activeStage, setActiveStage] = useState(stages[0]?.id ?? "");
  const [playingId, setPlayingId] = useState<string | null>(null);

  const registerVideo = useCallback((id: string, video: HTMLVideoElement | null) => {
    if (video) videosRef.current.set(id, video);
    else videosRef.current.delete(id);
  }, []);

  const loadVideo = useCallback((video: HTMLVideoElement) => {
    if (video.src) return;
    const source = video.dataset.src;
    if (!source) return;
    video.src = source;
    video.load();
  }, []);

  const pauseOtherVideos = useCallback((active?: HTMLVideoElement) => {
    videosRef.current.forEach((video) => {
      if (video !== active && !video.paused) video.pause();
    });
  }, []);

  const playVideo = useCallback((video: HTMLVideoElement) => {
    loadVideo(video);
    pauseOtherVideos(video);
    video.muted = true;
    if (video.paused) void video.play().catch(() => undefined);
  }, [loadVideo, pauseOtherVideos]);

  const toggleVideo = useCallback((id: string) => {
    const video = videosRef.current.get(id);
    if (!video) return;

    if (video.paused) playVideo(video);
    else video.pause();
  }, [playVideo]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const articles = [...section.querySelectorAll<HTMLElement>("[data-execution-stage]")];
    const ratios = new Map<string, number>();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const id = (entry.target as HTMLElement).dataset.executionStage;
        if (id) ratios.set(id, entry.isIntersecting ? entry.intersectionRatio : 0);
      });

      const next = [...ratios.entries()].sort((a, b) => b[1] - a[1])[0];
      if (next?.[1] > 0) setActiveStage(next[0]);
    }, {
      rootMargin: "-20% 0px -42%",
      threshold: [0, 0.15, 0.3, 0.5, 0.7, 1],
    });

    articles.forEach((article) => observer.observe(article));
    return () => observer.disconnect();
  }, [stages]);

  useEffect(() => {
    const elements = [...videosRef.current.values()];
    const visibility = new Map(elements.map((video) => [video, 0]));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;

    const syncPlayback = () => {
      if (document.hidden || reducedMotion.matches || connection?.saveData) {
        pauseOtherVideos();
        return;
      }

      const viewportCenter = window.innerHeight / 2;
      const active = elements
        .filter((video) => (visibility.get(video) ?? 0) >= 0.58)
        .sort((a, b) => {
          const aBounds = a.getBoundingClientRect();
          const bBounds = b.getBoundingClientRect();
          const aDistance = Math.abs(aBounds.top + aBounds.height / 2 - viewportCenter);
          const bDistance = Math.abs(bBounds.top + bBounds.height / 2 - viewportCenter);
          return aDistance - bDistance;
        })[0];

      if (active) playVideo(active);
      else pauseOtherVideos();
    };

    const loadObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        loadVideo(entry.target as HTMLVideoElement);
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "320px 0px", threshold: 0.01 });

    const playbackObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => visibility.set(entry.target as HTMLVideoElement, entry.intersectionRatio));
      syncPlayback();
    }, { threshold: [0, 0.15, 0.35, 0.58, 0.75, 1] });

    elements.forEach((video) => {
      loadObserver.observe(video);
      playbackObserver.observe(video);
    });
    reducedMotion.addEventListener("change", syncPlayback);
    document.addEventListener("visibilitychange", syncPlayback);

    return () => {
      loadObserver.disconnect();
      playbackObserver.disconnect();
      reducedMotion.removeEventListener("change", syncPlayback);
      document.removeEventListener("visibilitychange", syncPlayback);
      elements.forEach((video) => video.pause());
    };
  }, [loadVideo, pauseOtherVideos, playVideo]);

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
          .fromTo(".project-execution-kicker", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.42 })
          .fromTo(".project-execution-heading-line > span", { yPercent: 108 }, { yPercent: 0, duration: 0.78, stagger: 0.08 }, "-=0.16")
          .fromTo(".project-execution-intro-copy", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.5 }, "-=0.4");

        gsap.utils.toArray<HTMLElement>(".project-execution-record", section).forEach((record) => {
          const rule = record.querySelector(".project-execution-rule");
          const text = record.querySelectorAll(".project-execution-number, .project-execution-record-title, .project-execution-record-copy, .project-execution-caption");
          const frame = record.querySelector(".project-execution-media");

          gsap.timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: { trigger: record, start: "top 82%", once: true },
          })
            .fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 0.58 })
            .fromTo(text, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.06 }, "-=0.36")
            .fromTo(frame, { autoAlpha: 0, y: 34, scale: 1.018, clipPath: "inset(7% 0 7% 0)" }, {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              clipPath: "inset(0% 0 0% 0)",
              duration: 0.82,
            }, "-=0.34");
        });
      }, section);

      return () => context.revert();
    });

    return () => media.revert();
  }, []);

  return (
    <section ref={sectionRef} id="field-execution" className="project-execution" aria-labelledby="project-execution-heading">
      <header className="project-execution-intro">
        <p className="project-execution-kicker">{sectionNumber} / FIELD EXECUTION</p>
        <h2 id="project-execution-heading" className="project-execution-heading">
          {heading.map((line) => (
            <span className="project-execution-heading-line" key={line}><span>{line}</span></span>
          ))}
        </h2>
        <p className="project-execution-intro-copy">{intro}</p>
      </header>

      <div className="project-execution-layout">
        <nav className="project-execution-index" aria-label="Field execution chapters">
          <p>{sectionNumber} / BUILD RECORD</p>
          <ol>
            {stages.map((stage) => (
              <li className={activeStage === stage.id ? "is-active" : undefined} key={stage.id}>
                <a href={`#execution-${stage.id}`} aria-current={activeStage === stage.id ? "step" : undefined}>
                  <span>{stage.id}</span>{stage.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="project-execution-sequence">
          {stages.map((stage) => {
            const isPlaying = playingId === stage.id;
            return (
              <article
                id={`execution-${stage.id}`}
                className={`project-execution-record project-execution-record--${stage.layout}`}
                data-execution-stage={stage.id}
                key={stage.id}
              >
                <span className="project-execution-rule" aria-hidden="true" />
                <header className="project-execution-record-head">
                  <p className="project-execution-number">{stage.id}</p>
                  <div>
                    <p className="project-execution-record-label">FIELD RECORD / {stage.title}</p>
                    <h3 className="project-execution-record-title">{stage.title}</h3>
                    <p className="project-execution-record-copy">{stage.description}</p>
                  </div>
                </header>

                <figure className="project-execution-figure">
                  <div className="project-execution-media">
                    {stage.mediaType === "video" ? (
                      <>
                        <ProgressiveVideo
                          ref={(video) => registerVideo(stage.id, video)}
                          data-src={assetPath(stage.mediaSrc)}
                          poster={stage.poster ? assetPath(stage.poster) : undefined}
                          preload="metadata"
                          muted
                          loop
                          playsInline
                          disablePictureInPicture
                          aria-label={stage.mediaAlt}
                          onPlay={() => setPlayingId(stage.id)}
                          onPause={() => setPlayingId((current) => current === stage.id ? null : current)}
                        />
                        <button
                          type="button"
                          className="project-execution-control"
                          aria-label={`${isPlaying ? "Pause" : "Play"} ${stage.title.toLowerCase()} field footage`}
                          onClick={() => toggleVideo(stage.id)}
                        >
                          <span aria-hidden="true">{isPlaying ? "Ⅱ" : "▶"}</span>
                          {isPlaying ? "PAUSE" : "PLAY"}
                        </button>
                      </>
                    ) : (
                      <Image src={assetPath(stage.mediaSrc)} alt={stage.mediaAlt} fill sizes="(max-width: 767px) 88vw, 76vw" />
                    )}
                  </div>
                  <figcaption className="project-execution-caption">
                    <span>RECORD / {stage.id}</span>
                    <p>{stage.description}</p>
                    <small>JAGDAMBA SALT / PHALODI</small>
                  </figcaption>
                </figure>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
