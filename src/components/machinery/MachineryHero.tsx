"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { assetPath } from "@/lib/asset-path";
import "./machinery-hero.css";

const videoSource = assetPath("/videos/manufacturing/SK_Inside_Our_Manufacturing_Cinematic_720p.mp4");
const videoPoster = assetPath("/images/salt-refinery/execution/fabrication-blower.jpeg");

export default function MachineryHero() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);

  useLayoutEffect(() => {
    const section = root.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        gsap.timeline({ defaults: { ease: "power3.out" } })
          .to(".machinery-hero-eyebrow", { autoAlpha: 1, y: 0, duration: 0.5 })
          .to(".machinery-hero-heading-line > span", { y: 0, duration: 0.82, stagger: 0.09 }, "-=0.2")
          .to(".machinery-hero-media", { autoAlpha: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 1.05, ease: "power4.out" }, "-=0.62")
          .to(".machinery-hero-support", { autoAlpha: 1, y: 0, duration: 0.58 }, "-=0.46")
          .to(".machinery-hero-scroll, .machinery-hero-code", { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.08 }, "-=0.3");

        gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        })
          .to(".machinery-hero-media-visual", { scale: 1.055, ease: "none" }, 0)
          .to(".machinery-hero-media", { xPercent: -2, ease: "none" }, 0)
          .to(".machinery-hero-heading", { y: -18, autoAlpha: 0.72, ease: "none" }, 0);
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

    const syncPlayback = () => {
      const allowMotion = !reducedMotion.matches;
      if (allowMotion && visible && !videoFailed) void element.play().catch(() => {});
      else element.pause();
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncPlayback();
    }, { threshold: 0.08 });

    observer.observe(section);
    reducedMotion.addEventListener("change", syncPlayback);
    syncPlayback();

    return () => {
      observer.disconnect();
      reducedMotion.removeEventListener("change", syncPlayback);
      element.pause();
    };
  }, [videoFailed]);

  return (
    <section ref={root} className="machinery-hero" aria-labelledby="machinery-hero-heading">
      <div className="machinery-hero-shell">
        <p className="machinery-hero-eyebrow">MACHINERY / SYSTEMS</p>

        <div className="machinery-hero-composition">
          <h1 id="machinery-hero-heading" className="machinery-hero-heading">
            <span className="machinery-hero-heading-line"><span>ENGINEERED</span></span>
            <span className="machinery-hero-heading-line"><span>TO KEEP</span></span>
            <span className="machinery-hero-heading-line machinery-hero-heading-line-wide"><span>INDUSTRY MOVING.</span></span>
          </h1>

          <div className="machinery-hero-media" aria-label="S.K. Engineering Works machinery fabrication">
            <div className="machinery-hero-media-visual">
              <Image
                src={videoPoster}
                alt=""
                fill
                priority
                sizes="(max-width: 767px) 88vw, (max-width: 1099px) 58vw, 50vw"
                className="machinery-hero-poster"
              />
              {!videoFailed && (
                <video
                  ref={video}
                  className="machinery-hero-video"
                  src={videoSource}
                  poster={videoPoster}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  tabIndex={-1}
                  aria-hidden="true"
                  onError={() => setVideoFailed(true)}
                />
              )}
              <span className="machinery-hero-media-shade" aria-hidden="true" />
            </div>
            <span className="machinery-hero-media-label">WORKSHOP / REAL PROJECT EXECUTION</span>
          </div>

          <div className="machinery-hero-support">
            <p>Industrial machinery and process equipment engineered for material handling, processing, air movement, screening and storage applications.</p>
          </div>
        </div>

        <div className="machinery-hero-footer">
          <p className="machinery-hero-scroll"><span aria-hidden="true" />SCROLL TO ENTER THE SYSTEM <b aria-hidden="true">↓</b></p>
          <p className="machinery-hero-code"><span>SK / MACHINERY SYSTEM</span><strong>SYSTEM / 01</strong></p>
        </div>
      </div>
    </section>
  );
}
