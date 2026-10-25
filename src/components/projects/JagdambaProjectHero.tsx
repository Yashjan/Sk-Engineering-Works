"use client";

import ProgressiveVideo from "@/components/media/ProgressiveVideo";

import Image from "@/components/media/ProgressiveImage";
import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { assetPath } from "@/lib/asset-path";

const poster = "/images/projects/jagdamba/hero/jagdamba-cover-1600.webp";
const film = "/images/projects/jagdamba/hero/plant.mp4";
const metadata = [
  ["CLIENT", "JAGDAMBA SALT PVT. LTD."],
  ["LOCATION", "PHALODI, RAJASTHAN"],
  ["CAPACITY", "15 TPH"],
  ["PROJECT", "SALT REFINERY"],
] as const;

export default function JagdambaProjectHero() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const heroVisible = useRef(false);
  const playbackAllowed = useRef(false);
  const shrinkComplete = useRef(false);
  const playPending = useRef(false);

  const pauseVideo = useCallback(() => {
    const player = video.current;
    if (!player || player.paused) return;
    player.pause();
    playPending.current = false;
  }, []);

  const playVideo = useCallback(() => {
    const player = video.current;
    if (
      !player
      || !playbackAllowed.current
      || !heroVisible.current
      || shrinkComplete.current
      || document.hidden
      || !player.paused
      || playPending.current
    ) return;

    if (!player.getAttribute("src")) player.src = assetPath(film);
    player.muted = true;
    playPending.current = true;
    void player.play()
      .catch(() => { /* Poster stays visible when autoplay is blocked. */ })
      .finally(() => { playPending.current = false; });
  }, []);

  useEffect(() => {
    const section = root.current;
    const player = video.current;
    if (!section || !player) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    let disposed = false;
    const sync = () => {
      if (disposed) return;
      playbackAllowed.current = !motion.matches && !connection?.saveData;
      if (!playbackAllowed.current) {
        pauseVideo();
        player.removeAttribute("src");
        delete player.dataset.playing;
        player.load();
        return;
      }
      if (!heroVisible.current || document.hidden || shrinkComplete.current) {
        pauseVideo();
        return;
      }
      playVideo();
    };
    const playing = () => { player.dataset.playing = "true"; };
    const failed = () => { delete player.dataset.playing; };
    const observer = new IntersectionObserver(([entry]) => {
      heroVisible.current = entry.isIntersecting;
      sync();
    }, { threshold: 0 });
    player.addEventListener("playing", playing);
    player.addEventListener("error", failed);
    motion.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    observer.observe(section);
    return () => {
      disposed = true;
      heroVisible.current = false;
      playbackAllowed.current = false;
      observer.disconnect();
      player.removeEventListener("playing", playing);
      player.removeEventListener("error", failed);
      motion.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      pauseVideo();
      player.removeAttribute("src");
      player.load();
    };
  }, [pauseVideo, playVideo]);

  useLayoutEffect(() => {
    const section = root.current;
    if (!section) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add({ motion: "(prefers-reduced-motion: no-preference)", mobile: "(max-width: 767px)" }, (context) => {
      if (!context.conditions?.motion) return;
      const mobile = Boolean(context.conditions.mobile);
      const stage = section.querySelector<HTMLElement>(".jagdamba-project-stage")!;
      const heading = section.querySelector<HTMLElement>(".jagdamba-project-heading")!;
      const firstLine = section.querySelector<HTMLElement>(".jagdamba-project-title-first")!;
      const secondLine = section.querySelector<HTMLElement>(".jagdamba-project-title-secondary")!;
      // CSS supplies the full-screen arrival state before hydration. Only this
      // timeline owns the media transforms; there is no competing entrance tween.
      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          id: "jagdamba-project-opening",
          trigger: section,
          start: "top top",
          end: () => `+=${window.innerHeight * (mobile ? 0.45 : 1.15)}`,
          pin: mobile ? false : stage,
          scrub: mobile ? 0.6 : 0.8,
          invalidateOnRefresh: true,
          anticipatePin: mobile ? 0 : 1,
          onUpdate: (self) => {
            const ended = self.progress >= 0.99;
            shrinkComplete.current = ended;
            if (ended) pauseVideo();
            else if (self.isActive) playVideo();
          },
          onEnter: () => {
            shrinkComplete.current = false;
            playVideo();
          },
          onEnterBack: (self) => {
            if (self.progress >= 0.99) return;
            shrinkComplete.current = false;
            playVideo();
          },
          onLeave: () => {
            shrinkComplete.current = true;
            pauseVideo();
          },
          onLeaveBack: pauseVideo,
        },
      });
      timeline
        .fromTo(".jagdamba-project-media-frame", { clipPath: "inset(0% 0% 0% 0%)" }, {
          clipPath: mobile ? "inset(35% 4% 16% 4%)" : "inset(31% 10% 9% 10%)", duration: 1,
        }, 0)
        .fromTo(".jagdamba-project-media", { scale: 1, yPercent: 0 }, {
          scale: mobile ? 0.92 : 0.8, yPercent: mobile ? 9.5 : 11, duration: 1,
        }, 0)
        .fromTo(heading, { y: 0, x: 0 }, {
          y: () => (mobile ? 92 : Math.max(124, stage.clientHeight * 0.13)) - heading.offsetTop,
          x: () => mobile ? 0 : stage.clientWidth * 0.04,
          duration: 0.85,
        }, 0)
        .fromTo(".jagdamba-project-heading h1", { scale: 1 }, { scale: () => mobile ? 0.72 : stage.clientHeight < 800 ? 0.48 : 0.57, duration: 0.85 }, 0)
        .fromTo(secondLine, { x: 0, y: 0 }, {
          x: () => mobile ? 0 : firstLine.offsetWidth + 28,
          y: () => mobile ? 0 : firstLine.offsetTop - secondLine.offsetTop,
          duration: 0.85,
        }, 0)
        .fromTo(".jagdamba-project-location", { y: 0, x: 0 }, {
          y: () => (mobile ? stage.clientHeight * 0.35 - 26 : Math.max(124, stage.clientHeight * 0.13)) - section.querySelector<HTMLElement>(".jagdamba-project-location")!.offsetTop,
          x: () => mobile ? 0 : stage.clientWidth * 0.84 - section.querySelector<HTMLElement>(".jagdamba-project-location")!.offsetWidth,
          duration: 0.85,
        }, 0)
        .fromTo(".jagdamba-project-shade", { opacity: 1 }, { opacity: 0.15, duration: 0.8 }, 0)
        .fromTo(".jagdamba-project-metadata", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.3 }, 0.7)
        .fromTo(".jagdamba-project-scroll", { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.16 }, 0);
      // Dimensions are reserved in CSS, so metadata/video loading cannot move
      // the pin. Refresh only after the first layout, never on video timeupdate.
      const refreshFrame = requestAnimationFrame(() => timeline.scrollTrigger?.refresh());
      return () => cancelAnimationFrame(refreshFrame);
    }, section);
    return () => media.revert();
  }, [pauseVideo, playVideo]);

  return (
    <section ref={root} className="jagdamba-project-hero" aria-labelledby="jagdamba-project-title">
      <div className="jagdamba-project-stage">
        <div className="jagdamba-project-media-frame">
          <div className="jagdamba-project-media">
            <picture>
              <source media="(max-width: 767px)" srcSet={assetPath("/images/projects/jagdamba/hero/jagdamba-cover-960.webp")} />
              <Image src={assetPath(poster)} alt="Jagdamba Salt refinery in Phalodi, Rajasthan" fill loading="eager" fetchPriority="high" sizes="100vw" className="jagdamba-project-image" />
            </picture>
            <ProgressiveVideo ref={video} className="jagdamba-project-video" autoPlay muted playsInline loop preload="metadata" poster={assetPath(poster)} width={512} height={910} aria-hidden="true" tabIndex={-1} disablePictureInPicture />
            <div className="jagdamba-project-shade" aria-hidden="true" />
          </div>
        </div>
        <header className="jagdamba-project-heading">
          <p className="jagdamba-project-record">FIELD RECORD <span>/</span> 001</p>
          <p className="jagdamba-project-client">JAGDAMBA SALT PVT. LTD.</p>
          <h1 id="jagdamba-project-title">
            <span className="jagdamba-project-title-first">15 TPH</span>
            <span className="jagdamba-project-title-secondary">SALT REFINERY.</span>
          </h1>
        </header>
        <p className="jagdamba-project-location">PHALODI, RAJASTHAN</p>
        <dl className="jagdamba-project-metadata">
          {metadata.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
        </dl>
        <p className="jagdamba-project-scroll" aria-hidden="true">SCROLL TO EXPLORE <span>↓</span></p>
      </div>
    </section>
  );
}
