"use client";

import Image from "next/image";
import type { CSSProperties, KeyboardEvent, PointerEvent } from "react";
import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ProjectPlantLayout, ProjectPlantStage, ProjectPlantSystemData } from "@/data/project-plant-system";
import { assetPath } from "@/lib/asset-path";
import "./project-plant-system.css";

type ProjectPlantSystemProps = {
  sectionNumber: string;
  heading: readonly string[];
  intro: string;
  system: ProjectPlantSystemData;
  layout?: ProjectPlantLayout | null;
};

type ActiveStage = ProjectPlantStage & { stream: "material" | "air" };

type MobileStageSelectorProps = {
  stages: readonly ProjectPlantStage[];
  label: string;
  description: string;
  numberOffset?: number;
};

type LenisController = {
  scrollTo: (target: HTMLElement | number, options?: {
    offset?: number;
    immediate?: boolean;
    duration?: number;
  }) => void;
};

const stageImages: Readonly<Record<string, { src: string; alt: string }>> = {
  HOPPER: { src: "/images/process/hopper.png", alt: "Salt intake hopper" },
  "BELT CONVEYOR": { src: "/images/process/belt-conveyor.png", alt: "Belt conveyor" },
  "WET MILL": { src: "/images/process/wet-mill.png", alt: "Wet mill" },
  TANKS: { src: "/images/process/tank.png", alt: "Process tank" },
  "SCREW WASHER": { src: "/images/process/Screw washer.png", alt: "Screw washer" },
  CENTRIFUGE: { src: "/images/process/Centrifuge.png", alt: "Centrifuge" },
  "SCREW CONVEYOR": { src: "/images/process/Screw conveyor.png", alt: "Screw conveyor" },
  DRYER: { src: "/images/process/dryer.png", alt: "Salt dryer" },
  "BUCKET ELEVATOR": { src: "/images/process/Bucket elevator.png", alt: "Bucket elevator" },
  "VIBRO SCREEN": { src: "/images/process/Vibro.png", alt: "Vibro screen" },
  "PIN MILL": { src: "/images/process/Pin Mill.png", alt: "Pin mill" },
  CYCLONE: { src: "/images/process/Cyclone.png", alt: "Cyclone separator" },
  "ID FAN": { src: "/images/process/Blower.png", alt: "Induced draft fan" },
};

function MobileStageSelector({ stages, label, description, numberOffset = 0 }: MobileStageSelectorProps) {
  const selectorId = useId();
  const [activeIndex, setActiveIndex] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLOListElement>(null);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const transitionRef = useRef<gsap.core.Tween | null>(null);
  const entryRef = useRef<gsap.core.Tween | null>(null);
  const scrollTimerRef = useRef<number | null>(null);
  const centeringTimerRef = useRef<number | null>(null);
  const isCenteringRef = useRef(false);
  const activeStage = stages[activeIndex] ?? stages[0];
  const activeImage = activeStage ? stageImages[activeStage.name] : null;
  const displayNumber = (index: number) => String(numberOffset + index + 1).padStart(2, "0");
  const panelId = `${selectorId}-panel`;

  const centerTab = useCallback((index: number) => {
    const rail = railRef.current;
    const tab = buttonRefs.current[index];
    if (!rail || !tab) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    isCenteringRef.current = true;
    rail.scrollTo({
      left: tab.offsetLeft - (rail.clientWidth - tab.offsetWidth) / 2,
      behavior: reducedMotion ? "auto" : "smooth",
    });
    if (centeringTimerRef.current) window.clearTimeout(centeringTimerRef.current);
    centeringTimerRef.current = window.setTimeout(() => {
      isCenteringRef.current = false;
    }, reducedMotion ? 0 : 450);
  }, []);

  const activateStage = useCallback((index: number, center = true) => {
    if (index < 0 || index >= stages.length) return;
    if (center) centerTab(index);
    if (index === activeIndex) return;

    const panel = panelRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    transitionRef.current?.kill();
    entryRef.current?.kill();

    if (!panel || reducedMotion) {
      gsap.set(panel, { clearProps: "opacity,transform" });
      setActiveIndex(index);
      return;
    }

    transitionRef.current = gsap.to(panel, {
      opacity: 0,
      y: -8,
      duration: 0.16,
      ease: "power2.in",
      overwrite: true,
      onComplete: () => {
        setActiveIndex(index);
        requestAnimationFrame(() => {
          if (!panelRef.current) return;
          entryRef.current = gsap.fromTo(panelRef.current, { opacity: 0, y: 8 }, {
            opacity: 1,
            y: 0,
            duration: 0.32,
            ease: "power3.out",
            overwrite: true,
          });
        });
      },
    });
  }, [activeIndex, centerTab, stages.length]);

  const selectClosestTab = useCallback(() => {
    const rail = railRef.current;
    if (!rail || isCenteringRef.current) return;
    const railCenter = rail.getBoundingClientRect().left + rail.clientWidth / 2;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    buttonRefs.current.forEach((button, index) => {
      if (!button) return;
      const rect = button.getBoundingClientRect();
      const distance = Math.abs(rect.left + rect.width / 2 - railCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });
    activateStage(closestIndex, false);
  }, [activateStage]);

  const handleRailScroll = () => {
    if (isCenteringRef.current) return;
    if (scrollTimerRef.current) window.clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = window.setTimeout(selectClosestTab, 120);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex = index;
    if (event.key === "ArrowRight") nextIndex = Math.min(stages.length - 1, index + 1);
    else if (event.key === "ArrowLeft") nextIndex = Math.max(0, index - 1);
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = stages.length - 1;
    else return;
    event.preventDefault();
    buttonRefs.current[nextIndex]?.focus({ preventScroll: true });
    activateStage(nextIndex);
  };

  useEffect(() => () => {
    transitionRef.current?.kill();
    entryRef.current?.kill();
    if (scrollTimerRef.current) window.clearTimeout(scrollTimerRef.current);
    if (centeringTimerRef.current) window.clearTimeout(centeringTimerRef.current);
  }, []);

  if (!activeStage) return null;

  return (
    <section className="project-system-mobile-selector" aria-labelledby={`${selectorId}-heading`}>
      <div className="project-system-mobile-selector-head">
        <p id={`${selectorId}-heading`}>{label}</p>
        <p>{description}</p>
      </div>

      <div ref={panelRef} id={panelId} className="project-system-mobile-panel" role="tabpanel"
        aria-labelledby={`${selectorId}-tab-${activeIndex}`} aria-live="polite">
        <figure className="project-system-mobile-visual">
          {activeImage ? (
            <Image src={assetPath(activeImage.src)} alt={activeImage.alt} fill sizes="(max-width: 1023px) 82vw, 1px" />
          ) : (
            <div className="project-system-mobile-schematic" aria-hidden="true">
              <span>IN</span><i /><i /><span>OUT</span>
            </div>
          )}
        </figure>
        <div className="project-system-mobile-copy">
          <p>STAGE {displayNumber(activeIndex)} / {label}</p>
          <h3>{activeStage.name}</h3>
          <p>{activeStage.role}</p>
        </div>
      </div>

      <ol ref={railRef} className="project-system-mobile-rail" role="tablist"
        aria-label={`${label} stages`} onScroll={handleRailScroll}>
        {stages.map((stage, index) => {
          const selected = index === activeIndex;
          return (
            <li key={stage.id} role="presentation">
              <button ref={(node) => { buttonRefs.current[index] = node; }}
                id={`${selectorId}-tab-${index}`} type="button" role="tab"
                aria-selected={selected} aria-controls={panelId} tabIndex={selected ? 0 : -1}
                onClick={() => activateStage(index)}
                onFocus={() => { if (!selected) activateStage(index); }}
                onKeyDown={(event) => handleKeyDown(event, index)}>
                <span>{displayNumber(index)}</span>
                <strong>{stage.name}</strong>
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export default function ProjectPlantSystem({ sectionNumber, heading, intro, system, layout = null }: ProjectPlantSystemProps) {
  const root = useRef<HTMLElement>(null);
  const visualPanel = useRef<HTMLDivElement>(null);
  const headingId = useId();
  const firstStage = system.materialFlow[0];
  const [activeKey, setActiveKey] = useState(firstStage ? `material-${firstStage.id}` : "");

  const allStages = useMemo<readonly ActiveStage[]>(() => [
    ...system.materialFlow.map((stage) => ({ ...stage, stream: "material" as const })),
    ...system.airHandling.stages.map((stage) => ({ ...stage, stream: "air" as const })),
  ], [system]);

  const activeStage = allStages.find((stage) => `${stage.stream}-${stage.id}` === activeKey) ?? allStages[0];
  const activeImage = activeStage ? stageImages[activeStage.name] : null;
  const materialActiveIndex = activeStage?.stream === "material"
    ? system.materialFlow.findIndex((stage) => stage.id === activeStage.id)
    : system.materialFlow.findIndex((stage) => stage.id === system.airHandling.sourceStageId);
  const airActiveIndex = activeStage?.stream === "air"
    ? system.airHandling.stages.findIndex((stage) => stage.id === activeStage.id)
    : -1;
  const materialProgress = system.materialFlow.length > 1
    ? Math.max(0, materialActiveIndex) / (system.materialFlow.length - 1) * 100
    : 0;
  const airProgress = system.airHandling.stages.length > 1 && airActiveIndex >= 0
    ? airActiveIndex / (system.airHandling.stages.length - 1) * 100
    : 0;

  const selectStage = (stream: "material" | "air", id: string) => setActiveKey(`${stream}-${id}`);
  const selectOnMouse = (event: PointerEvent<HTMLButtonElement>, stream: "material" | "air", id: string) => {
    if (event.pointerType === "mouse") selectStage(stream, id);
  };
  const selectSupportStage = (id: string) => {
    selectStage("air", id);
    if (window.matchMedia("(max-width: 1023px)").matches) return;

    requestAnimationFrame(() => {
      const panel = visualPanel.current;
      if (!panel) return;

      const navbarHeight = document.querySelector<HTMLElement>("[data-navbar]")?.getBoundingClientRect().height ?? 112;
      const safeTop = navbarHeight + 32;
      const panelRect = panel.getBoundingClientRect();
      if (panelRect.bottom > safeTop) return;

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const lenis = (window as Window & { __lenis?: LenisController }).__lenis;
      if (lenis) {
        lenis.scrollTo(panel, {
          offset: -safeTop,
          immediate: reducedMotion,
          duration: reducedMotion ? undefined : 0.8,
        });
        return;
      }

      window.scrollTo({
        top: window.scrollY + panelRect.top - safeTop,
        behavior: reducedMotion ? "auto" : "smooth",
      });
    });
  };

  useLayoutEffect(() => {
    const section = root.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap.from(section.querySelectorAll("[data-system-reveal]"), {
        opacity: 0,
        y: 18,
        duration: 0.72,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 80%", once: true },
      });
      gsap.from(".project-system-canvas", {
        opacity: 0,
        y: 24,
        duration: 0.78,
        ease: "power3.out",
        scrollTrigger: { trigger: ".project-system-canvas", start: "top 86%", once: true },
      });
      if (window.matchMedia("(min-width: 1024px)").matches) {
        gsap.from(".project-system-desktop .project-system-material-line", {
          scaleX: 0,
          duration: 1.1,
          ease: "power2.out",
          scrollTrigger: { trigger: ".project-system-material-flow", start: "top 88%", once: true },
        });
        gsap.from(".project-system-desktop .project-system-stage", {
          opacity: 0,
          y: 14,
          duration: 0.52,
          stagger: 0.055,
          ease: "power3.out",
          scrollTrigger: { trigger: ".project-system-material-flow", start: "top 88%", once: true },
        });
        gsap.from(".project-system-desktop .project-system-air-line", {
          scaleX: 0,
          duration: 0.85,
          ease: "power2.out",
          scrollTrigger: { trigger: ".project-system-air", start: "top 90%", once: true },
        });
      }
    }, section);

    return () => context.revert();
  }, [system]);

  useLayoutEffect(() => {
    const section = root.current;
    if (!section || !activeStage || window.matchMedia("(max-width: 1023px)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const animation = gsap.fromTo(section.querySelectorAll(".project-system-desktop [data-active-detail]"), { opacity: 0, y: 10 }, {
      opacity: 1,
      y: 0,
      duration: 0.42,
      stagger: 0.045,
      ease: "power3.out",
      overwrite: true,
    });
    return () => {
      animation.revert();
    };
  }, [activeStage]);

  const materialStyle = { "--system-progress": `${materialProgress}%` } as CSSProperties;
  const airStyle = { "--air-progress": `${airProgress}%` } as CSSProperties;

  return (
    <section ref={root} id="plant-system" className="project-system" aria-labelledby={headingId}>
      <div className="project-system-shell">
        <header className="project-system-intro">
          <p className="project-system-eyebrow" data-system-reveal>{sectionNumber} / PLANT SYSTEM</p>
          <h2 id={headingId} className="project-system-heading" data-system-reveal>
            {heading.map((line, index) => <span key={line}>{line}{index < heading.length - 1 ? " " : null}</span>)}
          </h2>
          <div className="project-system-summary" data-system-reveal>
            <span className="project-system-coordinate" aria-hidden="true" />
            <p>{intro}</p>
          </div>
        </header>

        <div className="project-system-canvas">
          <div className="project-system-canvas-head">
            <p>SYSTEM / 001</p>
            <p>{system.capacity} PROCESS SEQUENCE</p>
            <p>11 PROCESS STAGES + 03 AIR STAGES</p>
          </div>

          <div className="project-system-desktop">
          <div className="project-system-main">
          <div className="project-system-primary">
          {activeStage && (
            <div className="project-system-active" aria-live="polite">
              <div className="project-system-active-index" data-active-detail>
                <span>{activeStage.id}</span>
                <p>{activeStage.stream === "material" ? "MATERIAL PROCESS" : "AIR HANDLING"}</p>
              </div>
              <div className="project-system-active-copy">
                <p className="project-system-active-label" data-active-detail>ACTIVE STAGE / {activeStage.id}</p>
                <h3 data-active-detail>{activeStage.name}</h3>
                <p className="project-system-active-role" data-active-detail>{activeStage.role}</p>
              </div>
            </div>
          )}

          <div className="project-system-flow-heading">
            <p>MATERIAL PROCESS</p>
            <p>PROJECT MACHINERY CHAIN</p>
            <p>FLOW DIRECTION <span aria-hidden="true">→</span></p>
          </div>

          <div className="project-system-material-flow" style={materialStyle}>
            <span className="project-system-material-line" aria-hidden="true"><span /></span>
            <ol className="project-system-rail" aria-label="Jagdamba Salt material process flow">
              {system.materialFlow.map((stage) => {
                const selected = activeStage.stream === "material" && stage.id === activeStage.id;
                return (
                  <li key={stage.id} className={`project-system-stage${selected ? " is-active" : ""}`}>
                    <button type="button" aria-pressed={selected}
                      onClick={() => selectStage("material", stage.id)}
                      onFocus={() => selectStage("material", stage.id)}
                      onPointerEnter={(event) => selectOnMouse(event, "material", stage.id)}>
                      <span className="project-system-stage-node" aria-hidden="true" />
                      <span className="project-system-rail-number">{stage.id}</span>
                      <span className="project-system-rail-name">{stage.name}</span>
                      <span className="project-system-rail-role">{stage.role}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          </div>
          {activeStage && (
            <div ref={visualPanel} className="project-system-detail" data-active-detail aria-live="polite">
              {activeImage ? (
                <figure className="project-system-media">
                  <Image src={assetPath(activeImage.src)} alt={activeImage.alt} fill sizes="(min-width: 1024px) 34vw, 1px" />
                </figure>
              ) : (
                <div className="project-system-schematic" aria-hidden="true">
                  <span className="project-system-schematic-in">IN</span>
                  <span className="project-system-schematic-unit"><i /><i /></span>
                  <span className="project-system-schematic-out">OUT</span>
                </div>
              )}
              <p>{activeStage.stream === "material" ? "PRIMARY PROCESS LINE" : `SUPPORT FLOW FROM DRYER / ${system.airHandling.sourceStageId}`}</p>
            </div>
          )}
          </div>

          <div className="project-system-air" style={airStyle}>
            <div className="project-system-air-intro">
              <p>AIR HANDLING</p>
              <h3>CONNECTED SUPPORT FLOW</h3>
              <p>Dryer exhaust is routed through the supporting air-handling sequence.</p>
            </div>
            <div className="project-system-air-origin">
              <span>BRANCH ORIGIN</span>
              <strong>DRYER / {system.airHandling.sourceStageId}</strong>
            </div>
            <span className="project-system-air-arrow" aria-hidden="true">→</span>
            <div className="project-system-air-flow">
              <span className="project-system-air-line" aria-hidden="true"><span /></span>
              <ol aria-label="Jagdamba Salt air and dust handling flow">
                {system.airHandling.stages.map((stage) => {
                  const selected = activeStage.stream === "air" && stage.id === activeStage.id;
                  return (
                    <li key={stage.id} className={`project-system-stage${selected ? " is-active" : ""}`}>
                      <button type="button" aria-pressed={selected}
                        onClick={() => selectSupportStage(stage.id)}
                        onFocus={() => selectStage("air", stage.id)}
                        onPointerEnter={(event) => selectOnMouse(event, "air", stage.id)}>
                        <span className="project-system-stage-node" aria-hidden="true" />
                        <span className="project-system-rail-number">{stage.id}</span>
                        <span className="project-system-rail-name">{stage.name}</span>
                        <span className="project-system-rail-role">{stage.role}</span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
          </div>

          <div className="project-system-mobile">
            <MobileStageSelector
              stages={system.materialFlow}
              label="MAIN PROCESS"
              description="MATERIAL FLOW / 01—11"
            />
            <MobileStageSelector
              stages={system.airHandling.stages}
              label="AIR HANDLING"
              description="SUPPORT SYSTEM / 12—14"
              numberOffset={11}
            />
          </div>

          {layout && (
            <a className="project-system-layout" href={layout.href}>
              <Image src={assetPath(layout.image)} alt={layout.imageAlt} width={520} height={320} />
              <span>{layout.label} <span aria-hidden="true">→</span></span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
