"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { assetPath } from "@/lib/asset-path";
import "./project-final-result.css";

type ProjectFinalResultProps = {
  sectionNumber: string;
  heading: readonly string[];
  client: string;
  capacity: string;
  projectType: string;
  location: string;
  statement: string;
  mediaSrc: string;
  poster: string;
};

export default function ProjectFinalResult({
  sectionNumber,
  heading,
  client,
  capacity,
  projectType,
  location,
  statement,
  mediaSrc,
  poster,
}: ProjectFinalResultProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const userPausedRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const loadVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.src) return;
    const source = video.dataset.src;
    if (!source) return;
    video.src = source;
    video.load();
  }, []);

  const playVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    loadVideo();
    video.muted = true;
    if (video.ended) video.currentTime = 0;
    if (video.paused) void video.play().catch(() => undefined);
  }, [loadVideo]);

  const toggleVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      userPausedRef.current = false;
      playVideo();
    } else {
      userPausedRef.current = true;
      video.pause();
    }
  }, [playVideo]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    let visibleRatio = 0;

    const syncPlayback = () => {
      if (
        document.hidden
        || visibleRatio < 0.6
        || reducedMotion.matches
        || connection?.saveData
        || userPausedRef.current
      ) {
        if (!video.paused) video.pause();
        return;
      }

      playVideo();
    };

    const loadObserver = new IntersectionObserver((entries, observer) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      loadVideo();
      observer.disconnect();
    }, { rootMargin: "360px 0px", threshold: 0.01 });

    const playbackObserver = new IntersectionObserver(([entry]) => {
      visibleRatio = entry?.intersectionRatio ?? 0;
      if (visibleRatio < 0.05) userPausedRef.current = false;
      syncPlayback();
    }, { threshold: [0, 0.05, 0.25, 0.6, 0.8, 1] });

    loadObserver.observe(video);
    playbackObserver.observe(video);
    reducedMotion.addEventListener("change", syncPlayback);
    document.addEventListener("visibilitychange", syncPlayback);

    return () => {
      loadObserver.disconnect();
      playbackObserver.disconnect();
      reducedMotion.removeEventListener("change", syncPlayback);
      document.removeEventListener("visibilitychange", syncPlayback);
      video.pause();
    };
  }, [loadVideo, playVideo]);

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
          .fromTo(".project-final-kicker", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.42 })
          .fromTo(".project-final-heading-line > span", { yPercent: 108 }, { yPercent: 0, duration: 0.82, stagger: 0.09 }, "-=0.16");

        gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger: ".project-final-figure", start: "top 82%", once: true },
        })
          .fromTo(".project-final-media", {
            autoAlpha: 0,
            y: 34,
            scale: 1.02,
            clipPath: "inset(7% 0 7% 0)",
          }, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            clipPath: "inset(0% 0 0% 0)",
            duration: 0.92,
          })
          .fromTo(".project-final-caption, .project-final-identity", { autoAlpha: 0, y: 18 }, {
            autoAlpha: 1,
            y: 0,
            duration: 0.56,
            stagger: 0.1,
          }, "-=0.46");
      }, section);

      return () => context.revert();
    });

    return () => media.revert();
  }, []);

  return (
    <section ref={sectionRef} id="final-result" className="project-final" aria-labelledby="project-final-heading">
      <header className="project-final-intro">
        <p className="project-final-kicker">{sectionNumber} / FINAL RESULT</p>
        <h2 id="project-final-heading" className="project-final-heading">
          {heading.map((line) => (
            <span className="project-final-heading-line" key={line}><span>{line}</span></span>
          ))}
        </h2>
        <p className="project-final-marker">PROJECT RECORD / 001<br />FINAL STATE</p>
      </header>

      <figure className="project-final-figure">
        <div className="project-final-media">
          <video
            ref={videoRef}
            data-src={assetPath(mediaSrc)}
            poster={assetPath(poster)}
            preload="metadata"
            muted
            playsInline
            disablePictureInPicture
            aria-label="Completed Jagdamba Salt refinery plant in Phalodi, Rajasthan"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
          />
          <button
            type="button"
            className="project-final-control"
            aria-label={`${isPlaying ? "Pause" : "Play"} completed plant footage`}
            onClick={toggleVideo}
          >
            <span aria-hidden="true">{isPlaying ? "Ⅱ" : "▶"}</span>
            {isPlaying ? "PAUSE" : "PLAY"}
          </button>
        </div>
        <figcaption className="project-final-caption">
          <span>FIELD RECORD / COMPLETE</span>
          <p>{statement}</p>
          <small>JAGDAMBA SALT / PHALODI</small>
        </figcaption>
      </figure>

      <div className="project-final-identity">
        <div>
          <p>CLIENT</p>
          <h3>{client}</h3>
        </div>
        <dl>
          <div>
            <dt>CAPACITY</dt>
            <dd>{capacity}</dd>
          </div>
          <div>
            <dt>PROJECT</dt>
            <dd>{projectType}</dd>
          </div>
          <div>
            <dt>LOCATION</dt>
            <dd>{location}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
