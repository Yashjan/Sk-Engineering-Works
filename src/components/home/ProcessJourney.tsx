"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ProcessStage } from "@/data/process";
import "./process-journey.css";

type StageWithAsset = ProcessStage & { hasImage: boolean };
const number = (value: number) => String(value).padStart(2, "0");
const HOLD = 0.65;
const TRANSITION = 1.2;

export default function ProcessJourney({ stages }: { stages: StageWithAsset[] }) {
  const root = useRef<HTMLElement>(null);
  const jumpToStage = useRef<(index: number) => void>(() => {});

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const section = root.current;
    if (!section) return;
    const scene = section.querySelector<HTMLElement>(".process-scene")!;
    const panels = Array.from(section.querySelectorAll<HTMLElement>(".process-stage"));
    const buttons = Array.from(section.querySelectorAll<HTMLButtonElement>(".process-step"));
    const counter = section.querySelector(".process-current");
    const progress = section.querySelector(".process-progress-fill");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let active = -1;

    const setActive = (index: number, pinned: boolean) => {
      if (active === index) return;
      active = index;
      if (counter) counter.textContent = number(index + 1);
      panels.forEach((panel, i) => {
        panel.inert = pinned && i !== index;
        if (pinned && i !== index) panel.setAttribute("aria-hidden", "true");
        else panel.removeAttribute("aria-hidden");
      });
      buttons.forEach((button, i) => {
        if (i === index) button.setAttribute("aria-current", "step");
        else button.removeAttribute("aria-current");
      });
    };

    const media = gsap.matchMedia();
    media.add({ base: "all", desktop: "(min-width: 768px)", reduce: "(prefers-reduced-motion: reduce)" }, (context) => {
      const { desktop, reduce } = context.conditions!;
      active = -1;
      setActive(0, Boolean(desktop && !reduce));

      if (desktop && !reduce) {
        scene.classList.add("process-scene-pinned");
        const visual = (panel: HTMLElement) => panel.querySelector(".process-visual");
        const info = (panel: HTMLElement) => panel.querySelector(".process-info");
        const numeral = (panel: HTMLElement) => panel.querySelector(".process-stage-number");
        const travel = (pixels: number) => () => pixels * Math.min(1, window.innerWidth / 1280);

        panels.forEach((panel, index) => {
          gsap.set(visual(panel), {
            x: index === 0 ? 0 : travel(index === 1 ? 280 : 240), y: index === 0 ? 0 : 40,
            scale: index === 0 ? 1 : 0.84, autoAlpha: index === 0 ? 1 : 0,
          });
          gsap.set(info(panel), { y: index === 0 ? 0 : 60, autoAlpha: index === 0 ? 1 : 0 });
          gsap.set(numeral(panel), { x: index === 0 ? 0 : 40, y: index === 0 ? 0 : 25, autoAlpha: index === 0 ? 1 : 0 });
        });

        const timeline = gsap.timeline({ defaults: { ease: "none" } });
        const dominance: number[] = [];
        panels.forEach((panel, index) => {
          if (index > 0) {
            const previous = panels[index - 1];
            const start = timeline.duration();
            timeline.addLabel(`transition${index}${index + 1}`, start);
            // Machinery overlaps; text follows the incoming machine by 0.2 units.
            timeline
              .to(visual(previous), { x: travel(index === 1 ? -180 : -220), y: -30, scale: index === 1 ? 0.82 : 0.84, autoAlpha: 0, duration: 1 }, start)
              .to(info(previous), { x: travel(-40), y: -80, autoAlpha: 0, duration: 0.8 }, start)
              .to(numeral(previous), { x: -45, y: -30, autoAlpha: 0, duration: 1.1 }, start)
              .to(visual(panel), { x: 0, y: 0, scale: 1, autoAlpha: 1, duration: 1 }, start + 0.2)
              .to(info(panel), { y: 0, autoAlpha: 1, duration: 0.7 }, start + 0.4)
              .to(numeral(panel), { x: 0, y: 0, autoAlpha: 1, duration: 1 }, start + 0.2)
              .to(".process-grid", { x: index * 20, y: index * -8, duration: TRANSITION }, start);
            dominance.push(start + 0.6);
          }
          timeline.addLabel(`stage${index + 1}`);
          timeline.to({}, { duration: HOLD });
        });

        const duration = timeline.duration();
        timeline.fromTo(progress, { scaleX: 0 }, { scaleX: 1, duration }, 0);
        timeline.eventCallback("onUpdate", () => {
          setActive(dominance.filter((time) => timeline.time() >= time).length, true);
        });
        const trigger = ScrollTrigger.create({
          trigger: scene, start: "top top",
          // Each transition gets 120vh; each inspection hold gets 65vh.
          end: () => `+=${window.innerHeight * duration}`,
          pin: true, scrub: 1, animation: timeline,
          invalidateOnRefresh: true, anticipatePin: 1,
        });
        jumpToStage.current = (index) => {
          const time = timeline.labels[`stage${index + 1}`] + HOLD / 2;
          window.scrollTo({ top: trigger.start + (time / duration) * (trigger.end - trigger.start), behavior: "smooth" });
        };
      } else {
        jumpToStage.current = (index) => panels[index]?.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "start" });
        if (!reduce) {
          gsap.fromTo(progress, { scaleX: 0 }, {
            scaleX: 1, ease: "none",
            scrollTrigger: { trigger: scene, start: "top top", end: "bottom bottom", scrub: true },
          });
        }
        panels.forEach((panel, index) => {
          ScrollTrigger.create({
            trigger: panel, start: "top 60%", end: "bottom 40%",
            onEnter: () => setActive(index, false), onEnterBack: () => setActive(index, false),
          });
          if (!reduce) {
            gsap.from(panel.querySelectorAll(".process-info, .process-visual"), {
              opacity: 0, y: 24, duration: 0.8, stagger: 0.12, ease: "power2.out",
              scrollTrigger: { trigger: panel, start: "top 85%", once: true },
            });
          }
        });
      }
      const refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => {
        cancelAnimationFrame(refreshFrame);
        scene.classList.remove("process-scene-pinned");
        panels.forEach((panel) => { panel.inert = false; panel.removeAttribute("aria-hidden"); });
      };
    }, section);
    return () => { media.revert(); jumpToStage.current = () => {}; };
  }, [stages]);

  return (
    <section ref={root} id="process" className="process-journey" aria-labelledby="process-heading">
      <header className="process-intro">
        <p className="process-eyebrow">PROCESS 01 <span> / THE REFINERY JOURNEY</span></p>
        <div className="process-intro-row">
          <h2 id="process-heading">FROM RAW SALT<br />TO FINISHED PRODUCT</h2>
          <p>Follow the engineered process from raw salt intake through refining, drying and final product handling.</p>
        </div>
      </header>
      <div className="process-scene">
        <div className="process-visual-clip">
          <div className="process-grid" aria-hidden="true" />
          <div className="process-stage-area">
            {stages.map((stage, index) => (
              <article className={`process-stage process-stage-${stage.id}`} id={`process-${stage.id}`} key={stage.id} aria-labelledby={`${stage.id}-heading`}>
                <span className="process-stage-number" aria-hidden="true">{number(index + 1)}</span>
                <div className="process-info">
                  <p className="process-stage-kicker">STAGE {number(index + 1)} <span aria-hidden="true">—</span> {stage.timelineLabel}</p>
                  <h3 id={`${stage.id}-heading`}>{stage.name}</h3>
                  <p className="process-purpose">{stage.purpose}</p>
                  <ul className="process-technical-labels">{stage.labels.map((label) => <li key={label}>{label}</li>)}</ul>
                  <a className="process-explore" href={`#${stage.id}-details`}>Explore Machine <span aria-hidden="true">→</span></a>
                </div>
                <div className="process-visual">
                  {stage.hasImage ? (
                    <Image src={stage.image} alt={stage.name} fill sizes={stage.id === "belt-conveyor" ? "(min-width: 768px) 72vw, 90vw" : "(min-width: 768px) 52vw, 90vw"} className="process-machine-image" draggable={false} onLoad={() => ScrollTrigger.refresh()} />
                  ) : (
                    <div className="process-render-placeholder" role="img" aria-label={`${stage.name}: machine image placeholder`}>
                      <div className="process-render-orbit" aria-hidden="true" />
                      <span className="process-render-crosshair" aria-hidden="true">+</span>
                      <span className="process-render-caption">{stage.name}<small>TRANSPARENT MACHINE RENDER</small></span>
                      <span className="process-render-note">VISUAL PENDING</span>
                    </div>
                  )}
                  <span className="process-visual-baseline" aria-hidden="true">{stage.timelineLabel} / PROCESS VIEW</span>
                </div>
                <div id={`${stage.id}-details`} className="process-detail" tabIndex={-1}>
                  <p>{stage.purpose} <span>Detailed machine information will follow.</span></p>
                  <a href={`#process-${stage.id}`}>Return to stage ↑</a>
                </div>
              </article>
            ))}
          </div>
        </div>
        <nav className="process-navigation" aria-label="Process stages">
          <div className="process-timeline">
            <div className="process-progress-track" aria-hidden="true"><span className="process-progress-fill" /></div>
            <ol>{stages.map((stage, index) => <li key={stage.id}><button type="button" className="process-step" aria-current={index === 0 ? "step" : undefined} onClick={() => jumpToStage.current(index)}><span>{number(index + 1)}</span>{stage.timelineLabel}</button></li>)}</ol>
          </div>
          <p className="process-count"><span className="process-current">01</span> / {number(stages.length)}</p>
        </nav>
      </div>
    </section>
  );
}
