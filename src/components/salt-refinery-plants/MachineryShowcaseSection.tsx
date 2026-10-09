"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./machinery-showcase-section.css";

type MachineryItem = {
  id: string;
  number: string;
  name: string;
  mediaType?: "image" | "video";
  mediaSrc?: string;
  mediaPoster?: string;
  mediaAlt?: string;
  mediaFit?: "contain" | "cover";
};

type MediaLayer = {
  key: number;
  machineIndex: number;
  state: "active" | "outgoing";
};

const machinery: MachineryItem[] = [
  {
    id: "hopper",
    number: "01",
    name: "HOPPER",
    mediaType: "image",
    mediaSrc: "/images/process/hopper.png",
    mediaAlt: "Hopper machinery",
    mediaFit: "contain",
  },
  {
    id: "belt-conveyor",
    number: "02",
    name: "BELT CONVEYOR",
    mediaType: "image",
    mediaSrc: "/images/process/belt-conveyor.png",
    mediaAlt: "Belt conveyor machinery",
    mediaFit: "contain",
  },
  {
    id: "wet-mill",
    number: "03",
    name: "WET MILL",
    mediaType: "image",
    mediaSrc: "/images/process/wet-mill.png",
    mediaAlt: "Wet mill machinery",
    mediaFit: "contain",
  },
  { id: "screw-washer", number: "04", name: "SCREW WASHER" },
  { id: "centrifuge", number: "05", name: "CENTRIFUGE" },
  { id: "dryer", number: "06", name: "DRYER" },
  { id: "bucket-elevator", number: "07", name: "BUCKET ELEVATOR" },
  { id: "vibro-screen", number: "08", name: "VIBRO SCREEN" },
  { id: "pin-mill", number: "09", name: "PIN MILL" },
  { id: "screw-conveyor", number: "10", name: "SCREW CONVEYOR" },
  { id: "storage-silos", number: "11", name: "STORAGE SILOS" },
  { id: "packing-system", number: "12", name: "PACKING SYSTEM" },
];

const transitionDuration = 520;

function MachineVisual({
  machine,
  machineIndex,
  state,
  shouldPlay,
}: {
  machine: MachineryItem;
  machineIndex: number;
  state: MediaLayer["state"];
  shouldPlay: boolean;
}) {
  return (
    <div
      className="machinery-showcase-media"
      data-machine-index={machineIndex}
      data-media-state={state}
      data-media-fit={machine.mediaFit ?? "contain"}
      aria-hidden={state === "outgoing"}
    >
      {machine.mediaType === "video" && machine.mediaSrc ? (
        <video
          src={machine.mediaSrc}
          poster={machine.mediaPoster}
          autoPlay={shouldPlay}
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={machine.mediaAlt}
        />
      ) : null}

      {machine.mediaType === "image" && machine.mediaSrc ? (
        <Image
          src={machine.mediaSrc}
          alt={machine.mediaAlt ?? machine.name}
          fill
          sizes="(max-width: 767px) 88vw, (max-width: 1199px) 76vw, min(55vw, 980px)"
        />
      ) : null}

      {!machine.mediaType ? (
        <div className="machinery-showcase-placeholder" role="img" aria-label={`${machine.name} visual coming next`}>
          <span>MACHINE VISUAL</span>
          <strong>COMING NEXT</strong>
        </div>
      ) : null}
    </div>
  );
}

export default function MachineryShowcaseSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nextLayerKeyRef = useRef(1);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [mediaLayers, setMediaLayers] = useState<MediaLayer[]>([
    { key: 0, machineIndex: 0, state: "active" },
  ]);
  const [sectionVisible, setSectionVisible] = useState(false);
  const [motionAllowed, setMotionAllowed] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => setSectionVisible(entry.isIntersecting),
      { threshold: 0.08 },
    );
    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setMotionAllowed(!motion.matches);

    update();
    motion.addEventListener("change", update);
    return () => motion.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    section.querySelectorAll<HTMLVideoElement>(".machinery-showcase-media video").forEach((video) => {
      const layer = video.closest<HTMLElement>(".machinery-showcase-media");
      const shouldPlay = motionAllowed && sectionVisible && layer?.dataset.mediaState === "active";

      if (shouldPlay) {
        void video.play().catch(() => {});
        return;
      }

      video.pause();
      if (layer?.dataset.mediaState === "outgoing") {
        try {
          video.currentTime = 0;
        } catch {
          // The metadata may not be ready yet; pausing still prevents hidden playback.
        }
      }
    });
  }, [mediaLayers, motionAllowed, sectionVisible]);

  useEffect(() => () => {
    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    sectionRef.current?.querySelectorAll("video").forEach((video) => video.pause());
  }, []);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        gsap
          .timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: { trigger: section, start: "top 76%", once: true },
          })
          .fromTo(
            ".machinery-showcase-eyebrow",
            { autoAlpha: 0, y: 10 },
            { autoAlpha: 1, y: 0, duration: 0.4 },
          )
          .fromTo(
            ".machinery-showcase-heading-line > span",
            { yPercent: 105 },
            { yPercent: 0, duration: 0.68, stagger: 0.08 },
            "-=0.12",
          );
      }, section);

      return () => context.revert();
    });

    return () => media.revert();
  }, []);

  const activateMachine = useCallback((index: number) => {
    if (index === activeIndexRef.current) return;

    activeIndexRef.current = index;
    setActiveIndex(index);
    setMediaLayers((currentLayers) => {
      const currentLayer = currentLayers.find((layer) => layer.state === "active");
      const nextLayer: MediaLayer = {
        key: nextLayerKeyRef.current,
        machineIndex: index,
        state: "active",
      };
      nextLayerKeyRef.current += 1;

      return currentLayer
        ? [{ ...currentLayer, state: "outgoing" }, nextLayer]
        : [nextLayer];
    });

    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    transitionTimerRef.current = setTimeout(() => {
      setMediaLayers((currentLayers) => currentLayers.filter((layer) => layer.state === "active"));
    }, transitionDuration);
  }, []);

  const activateFromHover = (index: number) => {
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      activateMachine(index);
    }
  };

  const activeMachine = machinery[activeIndex];

  return (
    <section ref={sectionRef} className="machinery-showcase" aria-labelledby="machinery-showcase-title">
      <div className="machinery-showcase-shell">
        <header className="machinery-showcase-header">
          <p className="machinery-showcase-eyebrow">MACHINERY / 05</p>
          <h2 id="machinery-showcase-title" className="machinery-showcase-heading">
            <span className="machinery-showcase-heading-line"><span>ENGINEERED</span></span>
            <span className="machinery-showcase-heading-line"><span>FOR THE LINE.</span></span>
          </h2>
        </header>

        <div className="machinery-showcase-stage">
          <span className="machinery-showcase-watermark" aria-hidden="true">{activeMachine.number}</span>
          <p className="machinery-showcase-count" aria-live="polite">
            {activeMachine.number} <span>/ {String(machinery.length).padStart(2, "0")}</span>
          </p>

          <div className="machinery-showcase-visual" aria-live="polite" aria-atomic="true">
            {mediaLayers.map((layer) => {
              const machine = machinery[layer.machineIndex];
              return (
                <MachineVisual
                  key={layer.key}
                  machine={machine}
                  machineIndex={layer.machineIndex}
                  state={layer.state}
                  shouldPlay={motionAllowed && sectionVisible && layer.state === "active"}
                />
              );
            })}
          </div>

          <h3 className="machinery-showcase-current-name" aria-live="polite">{activeMachine.name}</h3>
        </div>

        <footer className="machinery-showcase-footer">
          <nav className="machinery-showcase-nav" aria-label="Select machinery">
            {machinery.map((machine, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  type="button"
                  key={machine.id}
                  className="machinery-showcase-nav-item"
                  data-active={isActive ? "true" : "false"}
                  aria-pressed={isActive}
                  aria-current={isActive ? "true" : undefined}
                  onMouseEnter={() => activateFromHover(index)}
                  onFocus={() => activateMachine(index)}
                  onClick={() => activateMachine(index)}
                >
                  {machine.name}
                </button>
              );
            })}
          </nav>

          <Link className="machinery-showcase-link" href="/machinery">
            VIEW ALL MACHINERY <span aria-hidden="true">→</span>
          </Link>
        </footer>
      </div>
    </section>
  );
}
