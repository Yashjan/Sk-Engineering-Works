"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import "./salt-refinery-hero.css";

const stages = [
  "RAW SALT",
  "CRUSHING",
  "WASHING",
  "CENTRIFUGING",
  "DRYING",
  "SCREENING",
  "GRINDING",
  "STORAGE",
  "PACKING",
];

const scope = ["PROCESS DESIGN", "FABRICATION", "INSTALLATION", "UPGRADES"];

export default function SaltRefineryHero() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [motionAllowed, setMotionAllowed] = useState(false);

  useLayoutEffect(() => {
    const section = root.current;
    if (!section) return;

    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        gsap.timeline({ defaults: { ease: "power3.out" } })
          .fromTo(".salt-hero-eyebrow", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5 })
          .fromTo(".salt-hero-heading-line", { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.78, stagger: 0.09 }, "-=0.22")
          .fromTo(".salt-hero-support, .salt-hero-scope", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.58, stagger: 0.1 }, "-=0.42")
          .fromTo(".salt-hero-media", { autoAlpha: 0, scale: 0.985, clipPath: "inset(0 0 10% 0)" }, { autoAlpha: 1, scale: 1, clipPath: "inset(0 0 0% 0)", duration: 1.15 }, "-=0.72")
          .fromTo(".salt-process-line", { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: "power2.out" }, "-=0.48")
          .fromTo(".salt-process-stage", { autoAlpha: 0, y: 7 }, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.045, ease: "power2.out" }, "-=0.58");
      }, section);

      return () => context.revert();
    });

    return () => media.revert();
  }, []);

  useEffect(() => {
    const section = root.current;
    const element = video.current;
    if (!section || !element) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;

    const syncPlayback = () => {
      setMotionAllowed(!motion.matches);
      if (visible && !motion.matches) {
        void element.play().catch(() => {});
      } else {
        element.pause();
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncPlayback();
    }, { threshold: 0.08 });

    observer.observe(section);
    motion.addEventListener("change", syncPlayback);
    syncPlayback();

    return () => {
      observer.disconnect();
      motion.removeEventListener("change", syncPlayback);
      element.pause();
    };
  }, []);

  return (
    <section ref={root} className="salt-refinery-hero" aria-labelledby="salt-refinery-heading">
      <div className="salt-hero-shell">
        <div className="salt-hero-grid">
          <div className="salt-hero-copy">
            <p className="salt-hero-eyebrow">SALT REFINERY PLANTS / 01</p>
            <h1 id="salt-refinery-heading" className="salt-hero-heading">
              <span className="salt-hero-heading-line">FROM RAW SALT</span>
              <span className="salt-hero-heading-line">TO FINISHED PRODUCT.</span>
            </h1>
            <p className="salt-hero-support">Complete salt refinery engineering, equipment fabrication and plant installation for modern salt production lines.</p>
          </div>

          <div className="salt-hero-media" aria-hidden="true">
            <video
              ref={video}
              src="/videos/salt-refinery/SK_Salt_Refinery_Plants_Hero_10s.mp4"
              poster="/videos/salt-refinery/SK_Salt_Refinery_Plants_Hero_Poster.jpg"
              autoPlay={motionAllowed}
              muted
              loop
              playsInline
              preload="metadata"
              tabIndex={-1}
            />
            <span className="salt-hero-media-shade" />
            <span className="salt-hero-media-label">REAL PROJECT EXECUTION</span>
          </div>

          <ol className="salt-hero-scope" aria-label="Salt refinery plant scope">
            {scope.map((item, index) => (
              <li key={item}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item}</strong></li>
            ))}
          </ol>
        </div>

        <div className="salt-process-rail" aria-label="Salt refinery process overview">
          <span className="salt-process-line" aria-hidden="true" />
          <ol>
            {stages.map((stage) => <li className="salt-process-stage" key={stage}><span aria-hidden="true" />{stage}</li>)}
          </ol>
        </div>
      </div>
    </section>
  );
}
