"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ProcessStage } from "@/data/process";
import "./process-journey.css";

type StageWithAsset = ProcessStage & { hasImage: boolean };
type SkipDirection = "down" | "up";
const number = (value: number) => String(value).padStart(2, "0");
const HOLD_STAGE_1 = 0.65;
const HOLD_LATER_STAGE = 0.8;
const TRANSITION = 1.2;

export default function ProcessJourney({ stages }: { stages: StageWithAsset[] }) {
  const root = useRef<HTMLElement>(null);
  const jumpToStage = useRef<(index: number) => void>(() => {});
  const processTrigger = useRef<ScrollTrigger | null>(null);
  const skipButton = useRef<HTMLButtonElement>(null);
  const skipTween = useRef<gsap.core.Tween | null>(null);
  const skipDirectionRef = useRef<SkipDirection>("down");
  const skipLocked = useRef(false);
  const [isProcessActive, setIsProcessActive] = useState(false);
  const [isSkipExiting, setIsSkipExiting] = useState(false);
  const [skipDirection, setSkipDirection] = useState<SkipDirection>("down");

  const handleSkip = () => {
    if (skipLocked.current) return;

    const section = root.current;
    const direction = skipDirectionRef.current;
    const destination = direction === "down"
      ? section?.nextElementSibling as HTMLElement | null
      : section?.previousElementSibling as HTMLElement | null;
    if (!section || !destination) return;

    skipLocked.current = true;
    const button = skipButton.current;
    button?.blur();
    button?.classList.add("process-skip-activated");

    const trigger = processTrigger.current;
    const destinationTop = destination.getBoundingClientRect().top + window.scrollY;
    const target = direction === "down"
      ? Math.max(destinationTop, trigger ? trigger.end + 1 : destinationTop)
      : Math.min(destinationTop, trigger ? trigger.start - 1 : destinationTop);

    const scrollTarget = Math.max(0, target);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.scrollTo({ top: scrollTarget, behavior: "instant" });
      skipLocked.current = false;
      return;
    }

    const scrollState = { y: window.scrollY };
    const distance = Math.abs(scrollTarget - scrollState.y);
    const duration = gsap.utils.clamp(0.75, 1.5, 0.75 + (distance / (window.innerHeight * 18)) * 0.75);
    skipTween.current?.kill();
    skipTween.current = gsap.to(scrollState, {
      y: scrollTarget,
      duration,
      ease: "power4.out",
      overwrite: true,
      onUpdate: () => window.scrollTo({ top: scrollState.y, behavior: "instant" }),
      onComplete: () => {
        skipTween.current = null;
        skipLocked.current = false;
      },
      onInterrupt: () => {
        skipTween.current = null;
        skipLocked.current = false;
      },
    });
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const section = root.current;
    if (!section) return;
    const scene = section.querySelector<HTMLElement>(".process-scene")!;
    const panels = Array.from(section.querySelectorAll<HTMLElement>(".process-stage"));
    const buttons = Array.from(section.querySelectorAll<HTMLButtonElement>(".process-step"));
    const stageNavigation = section.querySelector<HTMLElement>(".process-timeline");
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
      const activeButton = buttons[index];
      if (stageNavigation && activeButton && stageNavigation.scrollWidth > stageNavigation.clientWidth) {
        stageNavigation.scrollTo({
          left: activeButton.offsetLeft - (stageNavigation.clientWidth - activeButton.offsetWidth) / 2,
          behavior: reducedMotion.matches ? "auto" : "smooth",
        });
      }
    };

    const media = gsap.matchMedia();
    media.add({ base: "all", desktop: "(min-width: 768px)", reduce: "(prefers-reduced-motion: reduce)" }, (context) => {
      const { desktop, reduce } = context.conditions!;
      active = -1;
      setActive(0, Boolean(desktop && !reduce));
      let trackedDirection: SkipDirection = "down";
      let directionAnchor = window.scrollY;

      const showSkip = (direction: SkipDirection) => {
        trackedDirection = direction;
        directionAnchor = window.scrollY;
        skipDirectionRef.current = direction;
        skipLocked.current = false;
        setIsSkipExiting(false);
        setSkipDirection(direction);
        setIsProcessActive(true);
      };
      const hideSkip = () => {
        const button = skipButton.current;
        if (button && document.activeElement === button) button.blur();
        setIsProcessActive(false);
        setIsSkipExiting(!reducedMotion.matches);
      };
      const trackDirection = (self: ScrollTrigger) => {
        const currentScroll = self.scroll();
        const delta = currentScroll - directionAnchor;
        if (Math.abs(delta) < 6) return;
        directionAnchor = currentScroll;
        const nextDirection: SkipDirection = delta > 0 ? "down" : "up";
        if (nextDirection === trackedDirection) return;
        trackedDirection = nextDirection;
        skipDirectionRef.current = nextDirection;
        setSkipDirection(nextDirection);
      };

      if (desktop && !reduce) {
        scene.classList.add("process-scene-pinned");
        const visual = (panel: HTMLElement) => panel.querySelector(".process-visual");
        const info = (panel: HTMLElement) => panel.querySelector(".process-info");
        const numeral = (panel: HTMLElement) => panel.querySelector(".process-stage-number");
        const travel = (pixels: number) => () => pixels * Math.min(1, window.innerWidth / 1280);

        panels.forEach((panel, index) => {
          gsap.set(visual(panel), {
            x: index === 0 ? 0 : travel(index === 1 ? 250 : 220), y: index === 0 ? 0 : 34,
            scale: index === 0 ? 1 : 0.88, autoAlpha: index === 0 ? 1 : 0,
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
              .to(visual(previous), { x: travel(index === 1 ? -190 : -230), y: -34, scale: index === 1 ? 0.86 : 0.87, autoAlpha: 0, duration: 1 }, start)
              .to(info(previous), { x: travel(-58), y: -78, autoAlpha: 0, duration: 0.8 }, start)
              .to(numeral(previous), { x: index === 1 ? -48 : -56, y: -34, autoAlpha: 0, duration: 1.1 }, start)
              .to(visual(panel), { x: 0, y: 0, scale: 1, autoAlpha: 1, duration: 1 }, start + 0.2)
              .to(info(panel), { y: 0, autoAlpha: 1, duration: 0.7 }, start + 0.4)
              .to(numeral(panel), { x: 0, y: 0, autoAlpha: 1, duration: 1.15, ease: "none" }, start + 0.2)
              .to(".process-grid", { x: index === 1 ? 22 : 34, y: index === 1 ? -10 : -6, duration: TRANSITION }, start);
            // The incoming machine is dominant here (rather than merely visible).
            dominance.push(start + 0.95);
          }
          timeline.addLabel(`stage${index + 1}`);
          timeline.to({}, { duration: index === 0 ? HOLD_STAGE_1 : HOLD_LATER_STAGE });
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
          onEnter: () => showSkip("down"),
          onEnterBack: () => showSkip("up"),
          onLeave: hideSkip,
          onLeaveBack: hideSkip,
          onUpdate: trackDirection,
        });
        processTrigger.current = trigger;
        jumpToStage.current = (index) => {
          const stageHold = index === 0 ? HOLD_STAGE_1 : HOLD_LATER_STAGE;
          const time = timeline.labels[`stage${index + 1}`] + stageHold / 2;
          window.scrollTo({ top: trigger.start + (time / duration) * (trigger.end - trigger.start), behavior: "smooth" });
        };
      } else {
        const trigger = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          onEnter: () => showSkip("down"),
          onEnterBack: () => showSkip("up"),
          onLeave: hideSkip,
          onLeaveBack: hideSkip,
          onUpdate: trackDirection,
        });
        processTrigger.current = trigger;
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
        hideSkip();
        processTrigger.current = null;
        scene.classList.remove("process-scene-pinned");
        panels.forEach((panel) => { panel.inert = false; panel.removeAttribute("aria-hidden"); });
      };
    }, section);
    return () => {
      media.revert();
      jumpToStage.current = () => {};
      processTrigger.current = null;
      skipLocked.current = false;
      skipTween.current?.kill();
      skipTween.current = null;
    };
  }, [stages]);

  return (
    <>
      <section ref={root} id="process" className="process-journey" aria-labelledby="process-heading">
      <header className="process-intro">
        <p className="process-eyebrow">PROCESS 01 <span> / THE REFINERY JOURNEY</span></p>
        <div className="process-intro-row">
          <h2 id="process-heading">FROM RAW SALT<br />TO FINISHED PRODUCT</h2>
          <p><span className="process-specialization">A CORE PROCESS-ENGINEERING SPECIALIZATION.</span>Follow the engineered process from raw salt intake through refining, drying and final product handling.</p>
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
                    <Image src={stage.image} alt={stage.imageAlt} fill sizes={stage.id === "belt-conveyor" ? "(min-width: 768px) 72vw, 90vw" : "(min-width: 768px) 64vw, 90vw"} className="process-machine-image" draggable={false} onLoad={() => ScrollTrigger.refresh()} />
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
      {(isProcessActive || isSkipExiting) && typeof document !== "undefined" && createPortal(
        <button
          ref={skipButton}
          type="button"
          className={`process-skip${isSkipExiting ? " process-skip-exiting" : ""}`}
          data-direction={skipDirection}
          disabled={isSkipExiting}
          aria-label={skipDirection === "down"
            ? "Skip Process Journey and continue to next section"
            : "Skip Process Journey and return to previous section"}
          onClick={handleSkip}
          onAnimationEnd={(event) => {
            if (isSkipExiting && event.currentTarget === event.target) setIsSkipExiting(false);
            else if (event.currentTarget === event.target) event.currentTarget.classList.remove("process-skip-activated");
          }}
        >
          <span>SKIP</span>
          <span className="process-skip-arrow-motion" aria-hidden="true">
            <svg className="process-skip-arrow" viewBox="0 0 12 16" focusable="false">
              <path d="M6 1v12M2 9l4 4 4-4" />
            </svg>
          </span>
        </button>,
        document.body,
      )}
    </>
  );
}
