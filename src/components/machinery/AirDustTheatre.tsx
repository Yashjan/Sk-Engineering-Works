"use client";

import ProgressiveVideo from "@/components/media/ProgressiveVideo";

import Image from "@/components/media/ProgressiveImage";
import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { airDustMachines, type MachineryItem } from "@/data/machinery";
import { assetPath } from "@/lib/asset-path";
import { useMachineryDirectory } from "./MachineryDirectory";
import { AUTO_ADVANCE_MS } from "./machinery-timing";
import { useTheatreEnvironment } from "./useTheatreEnvironment";
import { useAdjacentImagePreload } from "@/components/media/useAdjacentImagePreload";
import "./air-dust-theatre.css";

const TRANSITION_MS = 620;
type MediaLayer = { key: number; machineIndex: number; state: "active" | "outgoing" };

function AirDustMedia({ machine, layer, shouldPlay }: { machine: MachineryItem; layer: MediaLayer; shouldPlay: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (shouldPlay) void video.play().catch(() => {});
    else video.pause();
    return () => video.pause();
  }, [shouldPlay]);

  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        gsap.to(root.current, {
          opacity: layer.state === "active" ? 1 : 0,
          x: layer.state === "active" ? 0 : -18,
          clipPath: layer.state === "active" ? "inset(0% 0% 0% 0%)" : "inset(0% 18% 0% 0%)",
          duration: TRANSITION_MS / 1000,
          ease: "power3.out",
        });
      }, root);
      return () => context.revert();
    });
    return () => media.revert();
  }, [layer.state]);

  return <div ref={root} className="air-dust-media-layer" data-state={layer.state} data-fit={machine.mediaFit ?? "contain"} aria-hidden={layer.state === "outgoing"}>
    {machine.mediaType === "image" && machine.mediaSrc ?
      <Image src={assetPath(machine.mediaSrc)} alt={machine.mediaAlt ?? machine.name} fill sizes="(max-width: 767px) 88vw, (max-width: 1199px) 64vw, 62vw" /> : null}
    {machine.mediaType === "video" && machine.mediaSrc ?
      <ProgressiveVideo ref={videoRef} src={assetPath(machine.mediaSrc)} poster={machine.poster ? assetPath(machine.poster) : undefined} muted loop playsInline preload="metadata" aria-label={machine.mediaAlt ?? machine.name} /> : null}
    {!machine.mediaSrc ? <div className="air-dust-placeholder" role="img" aria-label={`${machine.name} media coming next`}>
      <span>AIR + DUST / {machine.number}</span><strong>MACHINE MEDIA<br />COMING NEXT</strong>
    </div> : null}
  </div>;
}

export default function AirDustTheatre() {
  const { registerCategory, searchInteracting } = useMachineryDirectory();
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLElement>(null);
  const railItems = useRef(new Map<string, HTMLButtonElement>());
  const activeIndexRef = useRef(0);
  const layerKey = useRef(1);
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pauseUntil = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [layers, setLayers] = useState<MediaLayer[]>([{ key: 0, machineIndex: 0, state: "active" }]);
  const { sectionVisible, autoplayVisible, desktopInput, motionAllowed, tabVisible } = useTheatreEnvironment(sectionRef);
  useAdjacentImagePreload(airDustMachines, activeIndex, sectionVisible);
  const [pointerPaused, setPointerPaused] = useState(false);
  const [focusPaused, setFocusPaused] = useState(false);
  const [autoplayRevision, setAutoplayRevision] = useState(0);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        gsap.timeline({ defaults: { ease: "power3.out" }, scrollTrigger: { trigger: sectionRef.current, start: "top 78%", once: true } })
          .fromTo(".air-dust-eyebrow", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.4 })
          .fromTo(".air-dust-heading-line > span", { yPercent: 105 }, { yPercent: 0, duration: 0.7, stagger: 0.08 }, "-=0.12")
          .fromTo(".air-dust-index", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.5 }, "-=0.3")
          .fromTo(".air-dust-visual", { autoAlpha: 0, x: 18 }, { autoAlpha: 1, x: 0, duration: 0.65 }, "-=0.25");
      }, sectionRef);
      return () => context.revert();
    });
    return () => media.revert();
  }, []);

  useEffect(() => () => {
    if (transitionTimer.current) clearTimeout(transitionTimer.current);
  }, []);

  const holdAutoplay = useCallback((duration: number) => {
    pauseUntil.current = Date.now() + duration;
    setAutoplayRevision((revision) => revision + 1);
  }, []);

  const activateMachine = useCallback((index: number) => {
    if (index === activeIndexRef.current) return;
    const outgoingIndex = activeIndexRef.current;
    activeIndexRef.current = index;
    setActiveIndex(index);
    if (transitionTimer.current) clearTimeout(transitionTimer.current);
    const nextKey = layerKey.current++;
    setLayers([{ key: nextKey, machineIndex: index, state: "active" }, { key: nextKey + 1000, machineIndex: outgoingIndex, state: "outgoing" }]);
    transitionTimer.current = setTimeout(() => {
      setLayers([{ key: nextKey, machineIndex: index, state: "active" }]);
      transitionTimer.current = null;
    }, TRANSITION_MS);
  }, []);

  const selectMachine = useCallback((index: number) => {
    holdAutoplay(AUTO_ADVANCE_MS);
    activateMachine(index);
  }, [activateMachine, holdAutoplay]);

  const activateMachineById = useCallback((id: string, holdMs: number) => {
    const index = airDustMachines.findIndex((machine) => machine.id === id);
    if (index < 0) return;
    holdAutoplay(holdMs);
    activateMachine(index);
  }, [activateMachine, holdAutoplay]);

  useEffect(() => {
    if (!sectionRef.current) return;
    return registerCategory({ categorySlug: "air-dust-handling", section: sectionRef.current, focusTarget: stageRef.current, activateMachine: activateMachineById });
  }, [activateMachineById, registerCategory]);

  useEffect(() => {
    if (airDustMachines.length < 2 || !desktopInput || !autoplayVisible || !motionAllowed || !tabVisible || pointerPaused || focusPaused || searchInteracting) return;
    const timer = setTimeout(() => {
      activateMachine((activeIndexRef.current + 1) % airDustMachines.length);
    }, Math.max(AUTO_ADVANCE_MS, pauseUntil.current - Date.now()));
    return () => clearTimeout(timer);
  }, [activeIndex, activateMachine, autoplayRevision, autoplayVisible, desktopInput, focusPaused, motionAllowed, pointerPaused, searchInteracting, tabVisible]);

  useEffect(() => {
    const centerRail = () => {
      if (!window.matchMedia("(max-width: 767px)").matches) return;
      const rail = railRef.current;
      const item = railItems.current.get(airDustMachines[activeIndex].id);
      if (!rail || !item) return;
      const left = rail.scrollLeft + item.getBoundingClientRect().left - rail.getBoundingClientRect().left - (rail.clientWidth - item.offsetWidth) / 2;
      // Scroll only the rail; scrollIntoView can also move the page.
      rail.scrollTo({ left, behavior: motionAllowed ? "smooth" : "auto" });
    };
    centerRail();
    window.addEventListener("resize", centerRail);
    return () => window.removeEventListener("resize", centerRail);
  }, [activeIndex, motionAllowed]);

  const moveMachine = (direction: -1 | 1) => selectMachine((activeIndexRef.current + direction + airDustMachines.length) % airDustMachines.length);
  const activeMachine = airDustMachines[activeIndex];
  const total = String(airDustMachines.length).padStart(2, "0");
  const progress = airDustMachines.length === 1 ? 1 : activeIndex / (airDustMachines.length - 1);

  return <section ref={sectionRef} id="air-dust-handling" className="air-dust-theatre" aria-labelledby="air-dust-heading">
    <div className="air-dust-shell">
      <header className="air-dust-header">
        <p className="air-dust-eyebrow">04 / AIR + DUST HANDLING</p>
        <h2 id="air-dust-heading" className="air-dust-heading">
          <span className="air-dust-heading-line"><span>ENGINEERED</span></span>
          <span className="air-dust-heading-line"><span>TO MOVE AIR.</span></span>
          <span className="air-dust-heading-line air-dust-heading-final"><span>BUILT TO CONTROL DUST.</span></span>
        </h2>
      </header>
      <div className="air-dust-system" onFocusCapture={(event) => {
        // Search focuses the stage for context; it must still resume after its idle hold.
        if (event.target !== stageRef.current) setFocusPaused(true);
      }} onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) { setFocusPaused(false); holdAutoplay(AUTO_ADVANCE_MS); }
      }}>
        <nav ref={railRef} className="air-dust-index" aria-label="Air and dust handling machines" onPointerEnter={(event) => {
          if (event.pointerType === "mouse") setPointerPaused(true);
        }} onPointerLeave={(event) => {
          if (event.pointerType === "mouse") { setPointerPaused(false); holdAutoplay(AUTO_ADVANCE_MS); }
        }}>
          {airDustMachines.map((machine, index) => <button key={machine.id} ref={(element) => {
            if (element) railItems.current.set(machine.id, element); else railItems.current.delete(machine.id);
          }} type="button" className="air-dust-index-item" aria-pressed={activeIndex === index}
            onPointerEnter={(event) => { if (event.pointerType === "mouse" && desktopInput) selectMachine(index); }}
            onFocus={() => selectMachine(index)} onClick={() => selectMachine(index)}>
            <span>{machine.number}</span><strong>{machine.shortName ?? machine.name}</strong>
          </button>)}
        </nav>
        <div ref={stageRef} className="air-dust-stage" tabIndex={-1}>
          <div className="air-dust-visual" aria-live="polite" aria-atomic="true">
            <span className="air-dust-watermark" aria-hidden="true">{activeMachine.number}</span>
            {layers.map((layer) => <AirDustMedia key={layer.key} machine={airDustMachines[layer.machineIndex]} layer={layer} shouldPlay={motionAllowed && sectionVisible && tabVisible && layer.state === "active"} />)}
            <span className="air-dust-visual-label">AIR + DUST / SYSTEM VIEW</span>
          </div>
          <div key={activeMachine.id} className="air-dust-active-title" aria-live="polite">
            <p><span>{activeMachine.number}</span> / {total}</p>
            <div><h3><span>{activeMachine.name}</span></h3>
              <Link className="air-dust-detail-link" href={activeMachine.detailHref}
                onPointerEnter={(event) => { if (event.pointerType === "mouse") setPointerPaused(true); }}
                onPointerLeave={(event) => { if (event.pointerType === "mouse") { setPointerPaused(false); holdAutoplay(AUTO_ADVANCE_MS); } }}>
                EXPLORE 3D MODEL <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
          <div className="air-dust-mobile-controls" aria-label="Browse air and dust handling machines">
            <button type="button" onClick={() => moveMachine(-1)}>&larr; PREVIOUS</button>
            <button type="button" onClick={() => moveMachine(1)}>NEXT &rarr;</button>
          </div>
          <div className="air-dust-flow" aria-hidden="true"><span>01</span><i><b style={{ transform: `scaleX(${progress})` }} /></i><span>{total}</span></div>
        </div>
      </div>
    </div>
  </section>;
}
