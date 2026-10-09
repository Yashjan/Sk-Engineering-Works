"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./manufacturing-section.css";

const videoSource = "/videos/manufacturing/SK_Inside_Our_Manufacturing_Cinematic_720p.mp4";
const videoPoster = "/images/projects/jagdamba/04_jagdamba_project_cover.jpg";

const capabilities = [
  { number: "01", title: "FABRICATION", detail: "Steel structures & machine bodies" },
  { number: "02", title: "STAINLESS STEEL", detail: "Process equipment fabrication" },
  { number: "03", title: "ASSEMBLY", detail: "Mechanical assembly & fitting" },
  { number: "04", title: "QUALITY CHECK", detail: "Inspection before dispatch" },
  { number: "05", title: "SITE INSTALLATION", detail: "Plant fitting & erection" },
];

export default function ManufacturingSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const manuallyPaused = useRef(false);
  const inView = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const frame = frameRef.current;
    if (!section || !frame) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add({ motion: "(prefers-reduced-motion: no-preference)", desktop: "(min-width: 768px)" }, (conditions) => {
      if (!conditions.conditions?.motion) return;
      const desktop = Boolean(conditions.conditions.desktop);
      const context = gsap.context(() => {
        const intro = gsap.timeline({
          scrollTrigger: { trigger: ".manufacturing-intro", start: "top 82%", once: true },
        });
        intro
          .to(".manufacturing-eyebrow", { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" })
          .to(".manufacturing-title-line > span", {
            // CSS translateY(105%) is read as pixel y; reset both components.
            y: 0, yPercent: 0, autoAlpha: 1, duration: desktop ? 0.95 : 0.75,
            stagger: 0.12, ease: "power3.out",
          }, "-=0.35")
          .to(".manufacturing-secondary-line > span", {
            y: 0, yPercent: 0, autoAlpha: 1, duration: 0.8, stagger: 0.1, ease: "power3.out",
          }, "-=0.62")
          .to(".manufacturing-description", { autoAlpha: 1, y: 0, duration: 0.7, ease: "power2.out" }, "-=0.55");

        gsap.to(frame, desktop ? {
          scale: 1, clipPath: "inset(0% 0% 0% 0%)", autoAlpha: 1, ease: "none",
          scrollTrigger: { trigger: frame, start: "top 88%", end: "top 24%", scrub: 0.6 },
        } : {
          scale: 1, autoAlpha: 1, y: 0, duration: 0.75, ease: "power2.out",
          scrollTrigger: { trigger: frame, start: "top 86%", once: true },
        });

        if (desktop) {
          gsap.fromTo(".manufacturing-video", { y: 25 }, {
            y: -25, ease: "none",
            scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: 1 },
          });
        }

        gsap.to(".manufacturing-film-caption", {
          autoAlpha: 1, y: 0, duration: 0.7, ease: "power2.out",
          scrollTrigger: { trigger: frame, start: "top 40%", once: true },
        });
        gsap.to(".manufacturing-proof", {
          autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out",
          scrollTrigger: { trigger: ".manufacturing-proof", start: "top 86%", once: true },
        });
        gsap.to(".manufacturing-rule > span", {
          scaleX: 1, duration: 1.1, ease: "power2.out",
          scrollTrigger: { trigger: ".manufacturing-capabilities", start: "top 88%", once: true },
        });
        gsap.to(".manufacturing-capability", {
          autoAlpha: 1, y: 0, duration: 0.7, stagger: desktop ? 0.08 : 0.04,
          ease: "power2.out",
          scrollTrigger: { trigger: ".manufacturing-capabilities", start: "top 80%", once: true },
        });
      }, section);
      return () => context.revert();
    });
    return () => media.revert();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    const frame = frameRef.current;
    if (!video || !frame) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const playIfAllowed = () => {
      if (inView.current && !manuallyPaused.current && !reducedMotion.matches) {
        void video.play().catch(() => setPlaying(false));
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView.current = entry.isIntersecting;
      if (entry.isIntersecting) playIfAllowed();
      else video.pause();
    }, { rootMargin: "120px 0px", threshold: 0 });
    const onMotionChange = () => {
      if (reducedMotion.matches) video.pause();
      else playIfAllowed();
    };
    observer.observe(frame);
    reducedMotion.addEventListener("change", onMotionChange);
    return () => {
      observer.disconnect();
      reducedMotion.removeEventListener("change", onMotionChange);
      video.pause();
    };
  }, []);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (playing) {
      manuallyPaused.current = true;
      video.pause();
    } else {
      manuallyPaused.current = false;
      void video.play().catch(() => setPlaying(false));
    }
  };

  return (
    <section ref={sectionRef} id="manufacturing" className="manufacturing-section" aria-labelledby="manufacturing-heading">
      <header className="manufacturing-intro">
        <div className="manufacturing-eyebrow"><span>MANUFACTURING / 03</span><span>IN-HOUSE FABRICATION</span></div>
        <div className="manufacturing-intro-grid">
          <h2 id="manufacturing-heading" className="manufacturing-title">
            <span className="manufacturing-title-line"><span>BUILT IN OUR</span></span>
            <span className="manufacturing-title-line"><span>WORKSHOP.</span></span>
          </h2>
          <div className="manufacturing-intro-aside">
            <p className="manufacturing-secondary">
              <span className="manufacturing-secondary-line"><span>ENGINEERED FOR</span></span>
              <span className="manufacturing-secondary-line"><span>THE PLANT FLOOR.</span></span>
            </p>
            <p className="manufacturing-description">From raw steel to installed machinery, our process equipment, material-handling systems and structural assemblies are fabricated, assembled and prepared in-house for demanding plant-floor operation.</p>
          </div>
        </div>
      </header>

      <div className="manufacturing-film-shell">
        <div ref={frameRef} className="manufacturing-film-frame">
          <video
            ref={videoRef}
            className="manufacturing-video"
            src={videoSource}
            poster={videoPoster}
            muted
            playsInline
            loop
            preload="metadata"
            aria-label="S.K. Engineering Works manufacturing and fabrication footage"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onError={() => { setVideoFailed(true); setPlaying(false); }}
          />
          {videoFailed && <div className="manufacturing-video-fallback" role="img" aria-label="S.K. Engineering Works installed salt refinery equipment" />}
          <div className="manufacturing-film-shade" aria-hidden="true" />
          <div className="manufacturing-film-caption">
            <p>S.K. ENGINEERING WORKS</p>
            <strong>FABRICATION FLOOR</strong>
            <span>SAMBHAR LAKE / RAJASTHAN</span>
          </div>
          <div className="manufacturing-film-meta" aria-hidden="true"><span>IN-HOUSE MANUFACTURING</span><span>01 / 01</span></div>
          {!videoFailed && <button className="manufacturing-video-control" type="button" onClick={togglePlayback} aria-label={playing ? "Pause manufacturing video" : "Play manufacturing video"}>
            {playing ? "PAUSE" : "PLAY"}<span aria-hidden="true">{playing ? "Ⅱ" : "↗"}</span>
          </button>}
        </div>
      </div>

      <div className="manufacturing-outro">
        <p className="manufacturing-proof">BUILT IN-HOUSE.<br /><span>INSTALLED ON SITE.</span></p>
        <div className="manufacturing-capabilities">
          <div className="manufacturing-rule" aria-hidden="true"><span /></div>
          <ol>
            {capabilities.map((capability) => <li className="manufacturing-capability" key={capability.number}>
              <span className="manufacturing-capability-number">{capability.number}</span>
              <h3>{capability.title}</h3>
              <p>{capability.detail}</p>
            </li>)}
          </ol>
          <p className="manufacturing-swipe-hint" aria-hidden="true">SWIPE TO EXPLORE <span>→</span></p>
        </div>
      </div>
    </section>
  );
}
