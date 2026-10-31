"use client";

import ProgressiveVideo from "@/components/media/ProgressiveVideo";

import Image from "@/components/media/ProgressiveImage";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { assetPath } from "@/lib/asset-path";
import "./manufacturing-proof.css";

const workshopVideo = assetPath("/videos/manufacturing/SK_Built_Here_Workshop_Cinematic.mp4");
const workshopPoster = assetPath("/images/salt-refinery/complete-execution/fabrication-blower.jpeg");

export default function ManufacturingProof() {
  const root = useRef<HTMLElement>(null);
  const film = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const userPaused = useRef(false);
  const userRequestedPlay = useRef(false);
  const syncPlayback = useRef<() => void>(() => {});
  const [playing, setPlaying] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  useLayoutEffect(() => {
    const section = root.current;
    if (!section) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        // Keep completed triggers until context cleanup. Removing them during a
        // media-query refresh can interrupt GSAP's trigger initialization.
        const reveal = (trigger: Element | null, start: string) => gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger, start, toggleActions: "play none none none" },
        });
        reveal(section.querySelector(".proof-header"), "top 82%")
          .to(".proof-eyebrow", { opacity: 1, y: 0, duration: 0.45 })
          .to(".proof-heading-line > span", { y: 0, yPercent: 0, duration: 0.8, stagger: 0.1 }, "-=0.15");

        section.querySelectorAll<HTMLElement>(".proof-media").forEach((figure) => {
          const frame = figure.querySelector(".proof-frame");
          const caption = figure.querySelector("figcaption");
          reveal(figure, "top 86%")
            .to(frame, { opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)", duration: 0.85 })
            .to(caption, { opacity: 1, y: 0, duration: 0.45 }, "-=0.25");
        });
        reveal(section.querySelector(".proof-copy"), "top 88%")
          .to(".proof-copy", { opacity: 1, y: 0, duration: 0.65 });
        reveal(section.querySelector(".proof-statement"), "top 85%")
          .to(".proof-statement-line > span", { y: 0, yPercent: 0, duration: 0.75, stagger: 0.1 });
        reveal(section.querySelector(".proof-footer"), "top 85%")
          .to(".proof-final-line > span", { y: 0, yPercent: 0, duration: 0.75, stagger: 0.1 });
      }, section);
      return () => context.revert();
    });
    return () => media.revert();
  }, []);

  useEffect(() => {
    const element = video.current;
    const frame = film.current;
    if (!element || !frame) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let nearViewport = false;
    let disposed = false;
    const canPlay = () => nearViewport && document.visibilityState === "visible" && !userPaused.current && !videoFailed
        && (!reducedMotion.matches || userRequestedPlay.current);
    const sync = () => {
      if (canPlay()) {
        void element.play().then(() => {
          // A pending play promise must not restart an offscreen/unmounted film.
          if (disposed || !canPlay()) element.pause();
        }).catch(() => {});
      } else element.pause();
    };
    syncPlayback.current = sync;
    const observer = new IntersectionObserver(([entry]) => {
      nearViewport = entry.isIntersecting;
      sync();
    }, { rootMargin: "120px 0px", threshold: 0 });
    const motionChange = () => {
      userRequestedPlay.current = false;
      sync();
    };
    observer.observe(frame);
    reducedMotion.addEventListener("change", motionChange);
    document.addEventListener("visibilitychange", sync);
    return () => {
      disposed = true;
      observer.disconnect();
      reducedMotion.removeEventListener("change", motionChange);
      document.removeEventListener("visibilitychange", sync);
      syncPlayback.current = () => {};
      element.pause();
    };
  }, [videoFailed]);

  const togglePlayback = () => {
    if (!video.current) return;
    userPaused.current = !video.current.paused;
    userRequestedPlay.current = !userPaused.current;
    syncPlayback.current();
  };

  return <section ref={root} id="built-here" className="manufacturing-proof" aria-labelledby="proof-heading">
    <div className="proof-shell">
      <header className="proof-header">
        <p className="proof-eyebrow">07 / BUILT HERE</p>
        <h2 id="proof-heading" className="proof-heading">
          <span className="proof-heading-line"><span>ENGINEERED HERE.</span></span>
          <span className="proof-heading-line"><span>BUILT HERE.</span></span>
        </h2>
      </header>

      <div className="proof-story">
        <figure className="proof-media proof-film">
          <div ref={film} className="proof-frame proof-film-frame">
            <Image src={workshopPoster} alt={videoFailed ? "S.K. Engineering Works fabricated blower on the workshop floor" : ""} fill sizes="(max-width: 767px) 88vw, 68vw" className="proof-film-poster" />
            <ProgressiveVideo ref={video} id="proof-workshop-film" className="proof-video" src={workshopVideo} poster={workshopPoster} muted loop playsInline preload="metadata" hidden={videoFailed}
              aria-label="S.K. Engineering Works workshop manufacturing and fabrication footage"
              onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => { setVideoFailed(true); setPlaying(false); }} />
            {!videoFailed ? <button className="proof-video-control" type="button" aria-label={playing ? "Pause workshop film" : "Play workshop film"} aria-controls="proof-workshop-film" onClick={togglePlayback}>
              {playing ? "PAUSE FILM" : "PLAY FILM"}
            </button> : null}
          </div>
          <figcaption><span>01 / WORKSHOP</span><span>S.K. ENGINEERING WORKS</span></figcaption>
        </figure>

        <p className="proof-copy">From fabrication and welding to assembly and installation-ready equipment, our machinery is built around real plant requirements.</p>

        <figure className="proof-media proof-detail">
          <div className="proof-frame proof-detail-frame">
            <Image src={assetPath("/images/salt-refinery/complete-execution/fabrication-blower.jpeg")} alt="S.K. Engineering Works fabricated blower inside the workshop" fill sizes="(max-width: 767px) 88vw, 30vw" />
          </div>
          <figcaption><span>02 / BLOWER FABRICATION</span></figcaption>
        </figure>

        <p className="proof-statement"><span className="proof-statement-line"><span>FROM STEEL</span></span><span className="proof-statement-line"><span>TO WORKING</span></span><span className="proof-statement-line"><span>MACHINE.</span></span></p>

        <figure className="proof-media proof-equipment">
          <div className="proof-frame proof-equipment-frame">
            <Image src={assetPath("/images/salt-refinery/complete-execution/fabricated-equipment.jpeg")} alt="Large fabricated process equipment on the S.K. Engineering Works workshop floor" fill sizes="(max-width: 767px) 88vw, 52vw" />
          </div>
          <figcaption><span>03 / EQUIPMENT FABRICATION</span><span>WORKSHOP FLOOR</span></figcaption>
        </figure>

        <figure className="proof-media proof-built">
          <div className="proof-frame proof-built-frame">
            <Image src={assetPath("/images/salt-refinery/complete-execution/plant-structure.jpeg")} alt="Installed S.K. Engineering Works process equipment within the salt refinery plant structure" fill sizes="(max-width: 767px) 88vw, 36vw" />
          </div>
          <figcaption><span>04 / INSTALLED EQUIPMENT</span></figcaption>
        </figure>
      </div>

      <footer className="proof-footer">
        <p className="proof-final"><span className="proof-final-line"><span>ENGINEERED.</span></span><span className="proof-final-line"><span>FABRICATED.</span></span><span className="proof-final-line"><span>BUILT BY S.K.</span></span></p>
        <p className="proof-signature">S.K. ENGINEERING WORKS<br />SAMBHAR LAKE / RAJASTHAN</p>
      </footer>
    </div>
  </section>;
}
