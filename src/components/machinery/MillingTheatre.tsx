"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { millingMachines, type MachineryItem } from "@/data/machinery";
import { assetPath } from "@/lib/asset-path";
import { useMachineryDirectory } from "./MachineryDirectory";
import { AUTO_ADVANCE_MS } from "./MaterialHandlingTheatre";
import "./milling-theatre.css";

const TRANSITION_MS = 560;
type MediaLayer = { key: number; machineIndex: number; state: "active" | "outgoing" };

function MillingMedia({ machine, layer, shouldPlay }: { machine: MachineryItem; layer: MediaLayer; shouldPlay: boolean }) {
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
          scale: layer.state === "active" ? 1 : 0.94,
          duration: TRANSITION_MS / 1000,
          ease: "power3.out",
        });
      }, root);
      return () => context.revert();
    });
    return () => media.revert();
  }, [layer.state]);

  return <div ref={root} className="milling-media-layer" data-state={layer.state} data-fit={machine.mediaFit ?? "contain"} aria-hidden={layer.state === "outgoing"}>
    {machine.mediaType === "image" && machine.mediaSrc ?
      <Image src={assetPath(machine.mediaSrc)} alt={machine.mediaAlt ?? machine.name} fill sizes="(max-width: 767px) 88vw, (max-width: 1199px) 64vw, 62vw" /> : null}
    {machine.mediaType === "video" && machine.mediaSrc ?
      <video ref={videoRef} src={assetPath(machine.mediaSrc)} poster={machine.poster ? assetPath(machine.poster) : undefined} muted loop playsInline preload="metadata" aria-label={machine.mediaAlt ?? machine.name} /> : null}
    {!machine.mediaSrc ? <div className="milling-placeholder" role="img" aria-label={`${machine.name} media coming next`}>
      <span>MILLING / {machine.number}</span><strong>MACHINE MEDIA<br />COMING NEXT</strong>
    </div> : null}
  </div>;
}

export default function MillingTheatre() {
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
  const [sectionVisible, setSectionVisible] = useState(false);
  const [autoplayVisible, setAutoplayVisible] = useState(false);
  const [desktopInput, setDesktopInput] = useState(false);
  const [motionAllowed, setMotionAllowed] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const [pointerPaused, setPointerPaused] = useState(false);
  const [focusPaused, setFocusPaused] = useState(false);
  const [autoplayRevision, setAutoplayRevision] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      setSectionVisible(entry.isIntersecting);
      setAutoplayVisible(entry.isIntersecting && entry.intersectionRatio >= 0.4);
    }, { threshold: [0, 0.4] });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 768px)");
    const update = () => { setMotionAllowed(!motion.matches); setDesktopInput(desktop.matches); };
    const visibility = () => setTabVisible(document.visibilityState === "visible");
    update();
    visibility();
    motion.addEventListener("change", update);
    desktop.addEventListener("change", update);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      motion.removeEventListener("change", update);
      desktop.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        gsap.timeline({ defaults: { ease: "power3.out" }, scrollTrigger: { trigger: sectionRef.current, start: "top 78%", once: true } })
          .fromTo(".milling-eyebrow", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.4 })
          .fromTo(".milling-heading-line > span", { yPercent: 105 }, { yPercent: 0, duration: 0.7, stagger: 0.08 }, "-=0.12")
          .fromTo(".milling-index", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.5 }, "-=0.3")
          .fromTo(".milling-visual", { autoAlpha: 0, scale: 1.04 }, { autoAlpha: 1, scale: 1, duration: 0.65 }, "-=0.25");
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
    const index = millingMachines.findIndex((machine) => machine.id === id);
    if (index < 0) return;
    holdAutoplay(holdMs);
    activateMachine(index);
  }, [activateMachine, holdAutoplay]);

  useEffect(() => {
    if (!sectionRef.current) return;
    return registerCategory({ categorySlug: "milling-size-reduction", section: sectionRef.current, focusTarget: stageRef.current, activateMachine: activateMachineById });
  }, [activateMachineById, registerCategory]);

  useEffect(() => {
    if (!desktopInput || !autoplayVisible || !motionAllowed || !tabVisible || pointerPaused || focusPaused || searchInteracting) return;
    const timer = setTimeout(() => {
      activateMachine((activeIndexRef.current + 1) % millingMachines.length);
    }, Math.max(AUTO_ADVANCE_MS, pauseUntil.current - Date.now()));
    return () => clearTimeout(timer);
  }, [activeIndex, activateMachine, autoplayRevision, autoplayVisible, desktopInput, focusPaused, motionAllowed, pointerPaused, searchInteracting, tabVisible]);

  useEffect(() => {
    const centerRail = () => {
      if (!window.matchMedia("(max-width: 767px)").matches) return;
      const rail = railRef.current;
      const item = railItems.current.get(millingMachines[activeIndex].id);
      if (!rail || !item) return;
      const left = rail.scrollLeft + item.getBoundingClientRect().left - rail.getBoundingClientRect().left - (rail.clientWidth - item.offsetWidth) / 2;
      // Scroll only the rail; scrollIntoView can also move the page.
      rail.scrollTo({ left, behavior: motionAllowed ? "smooth" : "auto" });
    };
    centerRail();
    window.addEventListener("resize", centerRail);
    return () => window.removeEventListener("resize", centerRail);
  }, [activeIndex, motionAllowed]);

  const moveMachine = (direction: -1 | 1) => selectMachine((activeIndexRef.current + direction + millingMachines.length) % millingMachines.length);
  const activeMachine = millingMachines[activeIndex];
  const total = String(millingMachines.length).padStart(2, "0");
  const progress = millingMachines.length === 1 ? 1 : activeIndex / (millingMachines.length - 1);

  return <section ref={sectionRef} id="milling-size-reduction" className="milling-theatre" aria-labelledby="milling-heading">
    <div className="milling-shell">
      <header className="milling-header">
        <p className="milling-eyebrow">03 / MILLING &amp; SIZE REDUCTION</p>
        <h2 id="milling-heading" className="milling-heading">
          <span className="milling-heading-line"><span>ENGINEERED</span></span>
          <span className="milling-heading-line"><span>TO REDUCE.</span></span>
          <span className="milling-heading-line milling-heading-final"><span>BUILT TO PERFORM.</span></span>
        </h2>
      </header>
      <div className="milling-system" onFocusCapture={(event) => {
        // Search focuses the stage for context; it must still resume after its idle hold.
        if (event.target !== stageRef.current) setFocusPaused(true);
      }} onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) { setFocusPaused(false); holdAutoplay(AUTO_ADVANCE_MS); }
      }}>
        <nav ref={railRef} className="milling-index" aria-label="Milling and size reduction machines" onPointerEnter={(event) => {
          if (event.pointerType === "mouse") setPointerPaused(true);
        }} onPointerLeave={(event) => {
          if (event.pointerType === "mouse") { setPointerPaused(false); holdAutoplay(AUTO_ADVANCE_MS); }
        }}>
          {millingMachines.map((machine, index) => <button key={machine.id} ref={(element) => {
            if (element) railItems.current.set(machine.id, element); else railItems.current.delete(machine.id);
          }} type="button" className="milling-index-item" aria-pressed={activeIndex === index}
            onPointerEnter={(event) => { if (event.pointerType === "mouse" && desktopInput) selectMachine(index); }}
            onFocus={() => selectMachine(index)} onClick={() => selectMachine(index)}>
            <span>{machine.number}</span><strong>{machine.shortName ?? machine.name}</strong>
          </button>)}
        </nav>
        <div ref={stageRef} className="milling-stage" tabIndex={-1}>
          <div className="milling-visual" aria-live="polite" aria-atomic="true">
            <span className="milling-watermark" aria-hidden="true">{activeMachine.number}</span>
            {layers.map((layer) => <MillingMedia key={layer.key} machine={millingMachines[layer.machineIndex]} layer={layer} shouldPlay={motionAllowed && sectionVisible && tabVisible && layer.state === "active"} />)}
            <span className="milling-visual-label">SIZE REDUCTION / SYSTEM VIEW</span>
          </div>
          <div key={activeMachine.id} className="milling-active-title" aria-live="polite">
            <p><span>{activeMachine.number}</span> / {total}</p>
            <div><h3><span>{activeMachine.name}</span></h3>
              <Link className="milling-detail-link" href={activeMachine.detailHref}>EXPLORE 3D MODEL <span aria-hidden="true">&rarr;</span></Link>
            </div>
          </div>
          <div className="milling-mobile-controls" aria-label="Browse milling machines">
            <button type="button" onClick={() => moveMachine(-1)}>&larr; PREVIOUS</button>
            <button type="button" onClick={() => moveMachine(1)}>NEXT &rarr;</button>
          </div>
          <div className="milling-flow" aria-hidden="true"><span>01</span><i><b style={{ transform: `scaleX(${progress})` }} /></i><span>{total}</span></div>
        </div>
      </div>
    </div>
  </section>;
}
