"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { materialHandlingMachines, type MachineryItem } from "@/data/machinery";
import { assetPath } from "@/lib/asset-path";
import { useMachineryDirectory } from "./MachineryDirectory";
import "./material-handling-theatre.css";

type MediaLayer = {
  key: number;
  machineIndex: number;
  state: "active" | "outgoing";
};

const transitionDuration = 560;
export const AUTO_ADVANCE_MS = 2000;

function MachineMedia({ machine, layer, shouldPlay }: { machine: MachineryItem; layer: MediaLayer; shouldPlay: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (shouldPlay) void video.play().catch(() => {});
    else video.pause();
  }, [shouldPlay]);

  return (
    <div
      className="material-theatre-media-layer"
      data-state={layer.state}
      data-fit={machine.mediaFit ?? "contain"}
      aria-hidden={layer.state === "outgoing"}
    >
      {machine.mediaType === "image" && machine.mediaSrc ? (
        <Image src={assetPath(machine.mediaSrc)} alt={machine.mediaAlt ?? machine.name} fill sizes="(max-width: 767px) 88vw, (max-width: 1199px) 64vw, 60vw" />
      ) : null}
      {machine.mediaType === "video" && machine.mediaSrc ? (
        <video ref={videoRef} src={assetPath(machine.mediaSrc)} poster={machine.poster ? assetPath(machine.poster) : undefined} muted loop playsInline preload="metadata" aria-label={machine.mediaAlt ?? machine.name} />
      ) : null}
      {!machine.mediaSrc ? (
        <div className="material-theatre-placeholder" role="img" aria-label={`${machine.name} media coming next`}>
          <span className="material-theatre-placeholder-axis" aria-hidden="true" />
          <span>MATERIAL HANDLING / {machine.number}</span>
          <strong>MACHINE MEDIA<br />COMING NEXT</strong>
        </div>
      ) : null}
    </div>
  );
}

export default function MaterialHandlingTheatre() {
  const { registerCategory, searchInteracting } = useMachineryDirectory();
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const railItemsRef = useRef(new Map<string, HTMLButtonElement>());
  const previouslyCenteredIndex = useRef(0);
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoplayTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pauseUntil = useRef(0);
  const layerKey = useRef(1);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [layers, setLayers] = useState<MediaLayer[]>([{ key: 0, machineIndex: 0, state: "active" }]);
  const [sectionVisible, setSectionVisible] = useState(false);
  const [autoplayVisible, setAutoplayVisible] = useState(false);
  const [autoplayCapable, setAutoplayCapable] = useState(false);
  const [navigationPaused, setNavigationPaused] = useState(false);
  const [autoplayRevision, setAutoplayRevision] = useState(0);
  const [motionAllowed, setMotionAllowed] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      setSectionVisible(entry.isIntersecting);
      setAutoplayVisible(entry.intersectionRatio >= 0.4);
    }, { threshold: [0, 0.08, 0.4] });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setMotionAllowed(!query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 768px)");
    const update = () => setAutoplayCapable(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        gsap.timeline({ defaults: { ease: "power3.out" }, scrollTrigger: { trigger: section, start: "top 78%", once: true } })
          .fromTo(".material-theatre-eyebrow", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.42 })
          .fromTo(".material-theatre-heading-line > span", { yPercent: 105 }, { yPercent: 0, duration: 0.72, stagger: 0.08 }, "-=0.12")
          .fromTo(".material-theatre-index", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.55 }, "-=0.35")
          .fromTo(".material-theatre-stage", { autoAlpha: 0, x: 28 }, { autoAlpha: 1, x: 0, duration: 0.72 }, "-=0.34");
      }, section);
      return () => context.revert();
    });
    return () => media.revert();
  }, []);

  useEffect(() => () => {
    if (transitionTimer.current) clearTimeout(transitionTimer.current);
    if (autoplayTimer.current) clearTimeout(autoplayTimer.current);
    sectionRef.current?.querySelectorAll("video").forEach((video) => video.pause());
  }, []);

  const activateMachine = useCallback((index: number) => {
    if (index === activeIndexRef.current) return;
    const outgoingIndex = activeIndexRef.current;
    activeIndexRef.current = index;
    setActiveIndex(index);
    if (transitionTimer.current) clearTimeout(transitionTimer.current);
    const nextKey = layerKey.current++;
    setLayers([
      { key: nextKey, machineIndex: index, state: "active" },
      { key: nextKey + 1000, machineIndex: outgoingIndex, state: "outgoing" },
    ]);
    transitionTimer.current = setTimeout(() => {
      setLayers([{ key: nextKey, machineIndex: index, state: "active" }]);
      transitionTimer.current = null;
    }, transitionDuration);
  }, []);

  const holdAutoplay = useCallback((duration: number) => {
    pauseUntil.current = Date.now() + duration;
    setAutoplayRevision((revision) => revision + 1);
  }, []);

  const activateMachineById = useCallback((machineId: string, holdMs: number) => {
    const index = materialHandlingMachines.findIndex((machine) => machine.id === machineId);
    if (index < 0) return;
    holdAutoplay(holdMs);
    activateMachine(index);
  }, [activateMachine, holdAutoplay]);

  const handleManualActivation = useCallback((index: number) => {
    holdAutoplay(AUTO_ADVANCE_MS);
    activateMachine(index);
  }, [activateMachine, holdAutoplay]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    return registerCategory({
      categorySlug: "material-handling",
      section,
      focusTarget: stageRef.current,
      activateMachine: activateMachineById,
    });
  }, [activateMachineById, registerCategory]);

  useEffect(() => {
    if (autoplayTimer.current) clearTimeout(autoplayTimer.current);
    const canAutoplay = autoplayCapable && autoplayVisible && motionAllowed && !navigationPaused && !searchInteracting;
    if (!canAutoplay) return;

    const delay = Math.max(AUTO_ADVANCE_MS, pauseUntil.current - Date.now());
    autoplayTimer.current = setTimeout(() => {
      autoplayTimer.current = null;
      const nextIndex = (activeIndexRef.current + 1) % materialHandlingMachines.length;
      activateMachine(nextIndex);
    }, delay);

    return () => {
      if (autoplayTimer.current) clearTimeout(autoplayTimer.current);
      autoplayTimer.current = null;
    };
  }, [activeIndex, activateMachine, autoplayCapable, autoplayRevision, autoplayVisible, motionAllowed, navigationPaused, searchInteracting]);

  useEffect(() => {
    if (previouslyCenteredIndex.current === activeIndex) return;
    previouslyCenteredIndex.current = activeIndex;
    if (!window.matchMedia("(max-width: 767px)").matches) return;
    railItemsRef.current.get(materialHandlingMachines[activeIndex].id)?.scrollIntoView({
      behavior: motionAllowed ? "smooth" : "auto",
      inline: "center",
      block: "nearest",
    });
  }, [activeIndex, motionAllowed]);

  const moveMachine = (direction: -1 | 1) => {
    const nextIndex = (activeIndexRef.current + direction + materialHandlingMachines.length) % materialHandlingMachines.length;
    handleManualActivation(nextIndex);
  };

  const activeMachine = materialHandlingMachines[activeIndex];
  const activeNumber = String(activeIndex + 1).padStart(2, "0");
  const totalMachines = String(materialHandlingMachines.length).padStart(2, "0");
  const progress = materialHandlingMachines.length === 1 ? 1 : activeIndex / (materialHandlingMachines.length - 1);

  return (
    <section id="material-handling" ref={sectionRef} className="material-theatre" aria-labelledby="material-theatre-heading">
      <div className="material-theatre-shell">
        <header className="material-theatre-header">
          <p className="material-theatre-eyebrow">02 / MATERIAL HANDLING</p>
          <h2 id="material-theatre-heading" className="material-theatre-heading">
            <span className="material-theatre-heading-line"><span>BUILT</span></span>
            <span className="material-theatre-heading-line"><span>TO MOVE</span></span>
            <span className="material-theatre-heading-line"><span>MATERIAL.</span></span>
          </h2>
        </header>

        <div className="material-theatre-system">
          <nav
            className="material-theatre-index"
            aria-label="Material handling machines"
            onPointerEnter={() => setNavigationPaused(true)}
            onPointerLeave={() => {
              setNavigationPaused(false);
              holdAutoplay(AUTO_ADVANCE_MS);
            }}
            onFocusCapture={() => setNavigationPaused(true)}
            onBlurCapture={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) {
                setNavigationPaused(false);
                holdAutoplay(AUTO_ADVANCE_MS);
              }
            }}
          >
            {materialHandlingMachines.map((machine, index) => (
              <button
                key={machine.id}
                ref={(element) => {
                  if (element) railItemsRef.current.set(machine.id, element);
                  else railItemsRef.current.delete(machine.id);
                }}
                type="button"
                className="material-theatre-index-item"
                aria-pressed={activeIndex === index}
                onMouseEnter={() => handleManualActivation(index)}
                onFocus={() => handleManualActivation(index)}
                onClick={() => handleManualActivation(index)}
              >
                <span>{machine.number}</span>
                <strong>{machine.shortName ?? machine.name}</strong>
              </button>
            ))}
          </nav>

          <div ref={stageRef} className="material-theatre-stage" tabIndex={-1}>
            <div className="material-theatre-visual" aria-live="polite" aria-atomic="true">
              <span className="material-theatre-watermark" aria-hidden="true">{activeMachine.number}</span>
              {layers.map((layer) => {
                const machine = materialHandlingMachines[layer.machineIndex];
                return <MachineMedia key={layer.key} machine={machine} layer={layer} shouldPlay={motionAllowed && sectionVisible && layer.state === "active"} />;
              })}
              <span className="material-theatre-visual-label">MATERIAL TRANSFER / SYSTEM VIEW</span>
            </div>

            <div key={activeMachine.id} className="material-theatre-active-title" aria-live="polite">
              <p><span>{activeNumber}</span> / {totalMachines}</p>
              <div>
                <h3>{activeMachine.name}</h3>
                <Link className="material-theatre-detail-link" href={activeMachine.detailHref}>
                  EXPLORE 3D MODEL <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>

            <div className="material-theatre-mobile-controls" aria-label="Browse machines">
              <button type="button" onClick={() => moveMachine(-1)}>&larr; PREVIOUS</button>
              <button type="button" onClick={() => moveMachine(1)}>NEXT &rarr;</button>
            </div>

            <div className="material-theatre-flow" aria-hidden="true">
              <span>{String(1).padStart(2, "0")}</span>
              <i><b style={{ transform: `scaleX(${progress})` }} /></i>
              <span>{totalMachines}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
