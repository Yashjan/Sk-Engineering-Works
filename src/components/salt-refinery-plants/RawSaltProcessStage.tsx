"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./raw-salt-process-stage.css";

type ProcessStage = {
  id: string;
  number: string;
  name: string;
  stageLabel: string;
  heading: [string, string];
  equipment: string;
  description: string;
  relatedEquipment: string;
  mediaType: "video" | "placeholder";
  mediaSrc?: string;
};

const processStages: ProcessStage[] = [
  {
    id: "raw-salt",
    number: "01",
    name: "RAW SALT",
    stageLabel: "01 / RAW SALT INTAKE",
    heading: ["RAW SALT", "ENTERS THE LINE."],
    equipment: "HOPPER + BELT CONVEYOR",
    description: "Raw salt is received through the hopper and transferred by belt conveyor toward the crushing stage.",
    relatedEquipment: "HOPPER / BELT CONVEYOR",
    mediaType: "video",
    mediaSrc: "/videos/salt-refinery/raw-salt-hover.mp4",
  },
  {
    id: "crushing",
    number: "02",
    name: "CRUSHING",
    stageLabel: "02 / CRUSHING",
    heading: ["SALT IS BROKEN", "DOWN FIRST."],
    equipment: "WET MILL",
    description: "The incoming salt is reduced and conditioned in the Wet Mill to prepare it for the washing process.",
    relatedEquipment: "WET MILL",
    mediaType: "placeholder",
  },
  {
    id: "washing",
    number: "03",
    name: "WASHING",
    stageLabel: "03 / WASHING",
    heading: ["IMPURITIES ARE", "WASHED AWAY."],
    equipment: "ELUTRIATION + WASHING SYSTEM",
    description: "Salt moves through the washing system where unwanted impurities are separated before further processing.",
    relatedEquipment: "ELUTRIATION TANK / WASHING TANK / SCREW WASHERY",
    mediaType: "placeholder",
  },
  {
    id: "centrifuging",
    number: "04",
    name: "CENTRIFUGING",
    stageLabel: "04 / CENTRIFUGING",
    heading: ["MOISTURE IS", "REMOVED."],
    equipment: "CENTRIFUGE",
    description: "Washed salt enters the centrifuge where excess moisture and brine are separated from the salt.",
    relatedEquipment: "CENTRIFUGE",
    mediaType: "placeholder",
  },
  {
    id: "drying",
    number: "05",
    name: "DRYING",
    stageLabel: "05 / DRYING",
    heading: ["SALT IS DRIED", "FOR PROCESSING."],
    equipment: "DRYER + CYCLONE",
    description: "The salt is dried using controlled hot-air processing to reduce moisture before screening and grinding.",
    relatedEquipment: "DRYER / CYCLONE",
    mediaType: "placeholder",
  },
  {
    id: "screening",
    number: "06",
    name: "SCREENING",
    stageLabel: "06 / SCREENING",
    heading: ["SALT IS", "CLASSIFIED."],
    equipment: "VIBRO SCREEN",
    description: "Dried salt is screened to separate particles by size and maintain a consistent product specification.",
    relatedEquipment: "VIBRO SCREEN",
    mediaType: "placeholder",
  },
  {
    id: "grinding",
    number: "07",
    name: "GRINDING",
    stageLabel: "07 / GRINDING",
    heading: ["FINAL SIZE IS", "CONTROLLED."],
    equipment: "PIN MILL",
    description: "Salt is ground to the required fineness depending on the final product specification.",
    relatedEquipment: "PIN MILL",
    mediaType: "placeholder",
  },
  {
    id: "storage",
    number: "08",
    name: "STORAGE",
    stageLabel: "08 / STORAGE",
    heading: ["FINISHED SALT", "MOVES TO STORAGE."],
    equipment: "BUCKET ELEVATOR + SILOS",
    description: "Processed salt is transferred through material-handling equipment into storage before packing.",
    relatedEquipment: "BUCKET ELEVATOR / SCREW CONVEYOR / STORAGE SILOS",
    mediaType: "placeholder",
  },
  {
    id: "packing",
    number: "09",
    name: "PACKING",
    stageLabel: "09 / PACKING",
    heading: ["READY FOR", "FINAL PACKING."],
    equipment: "PACKING SYSTEM",
    description: "Finished salt is prepared for packing according to the required product and packaging format.",
    relatedEquipment: "PACKING SYSTEM",
    mediaType: "placeholder",
  },
];

function StageMedia({
  stage,
  videoRef,
  shouldPlay,
}: {
  stage: ProcessStage;
  videoRef?: RefObject<HTMLVideoElement | null>;
  shouldPlay: boolean;
}) {
  if (stage.mediaType === "video" && stage.mediaSrc) {
    return (
      <>
        <video
          ref={videoRef}
          src={stage.mediaSrc}
          autoPlay={shouldPlay}
          muted
          loop
          playsInline
          preload="metadata"
          tabIndex={-1}
        />
        <span className="raw-process-preview-label">{stage.equipment}</span>
      </>
    );
  }

  return (
    <div className="raw-process-placeholder" aria-label={`${stage.name} visual in preparation`}>
      <span className="raw-process-placeholder-number" aria-hidden="true">{stage.number}</span>
      <div>
        <small>VISUAL IN PREPARATION</small>
        <strong>{stage.name}</strong>
        <p>{stage.equipment}</p>
      </div>
    </div>
  );
}

function StageCopy({ stage }: { stage: ProcessStage }) {
  return (
    <>
      <p className="raw-process-copy-eyebrow">{stage.stageLabel}</p>
      <h3>
        <span>{stage.heading[0]}</span>
        <span>{stage.heading[1]}</span>
      </h3>
      <p className="raw-process-equipment">{stage.equipment}</p>
      <p className="raw-process-description">{stage.description}</p>
      <div className="raw-process-related">
        <span>RELATED EQUIPMENT</span>
        <p>{stage.relatedEquipment}</p>
      </div>
    </>
  );
}

function syncVideoPlayback(video: HTMLVideoElement | null, shouldPlay: boolean) {
  if (!video) return;

  if (shouldPlay) {
    void video.play().catch(() => {});
    return;
  }

  video.pause();
  try {
    video.currentTime = 0;
  } catch {
    // Metadata may not be ready when a mobile accordion closes.
  }
}

export default function RawSaltProcessStage() {
  const root = useRef<HTMLElement>(null);
  const [hoveredStage, setHoveredStage] = useState<string | null>(null);
  const [selectedMobileStage, setSelectedMobileStage] = useState<string | null>("raw-salt");
  const [renderedStage, setRenderedStage] = useState("raw-salt");
  const [isMobile, setIsMobile] = useState(false);
  const preview = useRef<HTMLDivElement>(null);
  const previewContent = useRef<HTMLDivElement>(null);
  const copyContent = useRef<HTMLElement>(null);
  const desktopVideo = useRef<HTMLVideoElement>(null);
  const mobileVideo = useRef<HTMLVideoElement>(null);
  const displayedDesktopStage = hoveredStage ?? "raw-salt";
  const activeIndex = processStages.findIndex((stage) => stage.id === displayedDesktopStage);
  const renderedProcess = processStages.find((stage) => stage.id === renderedStage) ?? processStages[0];
  const desktopMediaVisible = hoveredStage !== null;

  useLayoutEffect(() => {
    const section = root.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: section,
            start: "top 78%",
            once: true,
          },
        })
          .fromTo(
            ".raw-process-eyebrow",
            { autoAlpha: 0, y: 12 },
            { autoAlpha: 1, y: 0, duration: 0.45 },
          )
          .fromTo(
            ".raw-process-heading > span",
            { autoAlpha: 0, y: 30 },
            { autoAlpha: 1, y: 0, duration: 0.68, stagger: 0.08 },
            "-=0.18",
          )
          .fromTo(
            ".raw-process-support",
            { autoAlpha: 0, y: 14 },
            { autoAlpha: 1, y: 0, duration: 0.5 },
            "-=0.34",
          )
          .fromTo(
            ".raw-process-desktop-row, .raw-process-mobile-list > .raw-process-stage-item > button",
            { autoAlpha: 0, y: 10 },
            { autoAlpha: 1, y: 0, duration: 0.38, stagger: 0.035 },
            "-=0.18",
          )
          .fromTo(
            ".raw-process-copy > *",
            { autoAlpha: 0, y: 10 },
            { autoAlpha: 1, y: 0, duration: 0.42, stagger: 0.045 },
            "-=0.48",
          );
      }, section);

      return () => context.revert();
    });

    return () => media.revert();
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(query.matches);

    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useLayoutEffect(() => {
    const targets = [previewContent.current, copyContent.current].filter(Boolean);
    if (!targets.length) {
      setRenderedStage(displayedDesktopStage);
      return;
    }

    gsap.killTweensOf(targets);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (displayedDesktopStage === renderedStage) {
      gsap.to(targets, {
        autoAlpha: 1,
        y: 0,
        duration: reduceMotion ? 0 : 0.2,
        overwrite: true,
      });
      return;
    }

    gsap.to(targets, {
      autoAlpha: 0,
      y: reduceMotion ? 0 : -8,
      duration: reduceMotion ? 0 : 0.16,
      ease: "power2.in",
      overwrite: true,
      onComplete: () => setRenderedStage(displayedDesktopStage),
    });

    return () => gsap.killTweensOf(targets);
  }, [displayedDesktopStage, renderedStage]);

  useLayoutEffect(() => {
    const targets = [previewContent.current, copyContent.current].filter(Boolean);
    if (!targets.length) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.fromTo(
      targets,
      { autoAlpha: 0, y: reduceMotion ? 0 : 10 },
      { autoAlpha: 1, y: 0, duration: reduceMotion ? 0 : 0.28, ease: "power3.out", stagger: 0.025 },
    );

    return () => gsap.killTweensOf(targets);
  }, [renderedStage]);

  useLayoutEffect(() => {
    const previewElement = preview.current;
    if (!previewElement) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.killTweensOf(previewElement);

    if (desktopMediaVisible && !isMobile) {
      gsap.fromTo(
        previewElement,
        { autoAlpha: 0, scale: reduceMotion ? 1 : 0.96, y: reduceMotion ? 0 : 8 },
        { autoAlpha: 1, scale: 1, y: 0, duration: reduceMotion ? 0 : 0.32, ease: "power3.out" },
      );
    } else {
      gsap.to(previewElement, {
        autoAlpha: 0,
        scale: reduceMotion ? 1 : 0.97,
        duration: reduceMotion ? 0 : 0.22,
        ease: "power2.out",
      });
    }

    return () => gsap.killTweensOf(previewElement);
  }, [desktopMediaVisible, isMobile]);

  useEffect(() => {
    const desktopRawSaltActive = !isMobile && hoveredStage === "raw-salt" && renderedStage === "raw-salt";
    const mobileRawSaltActive = isMobile && selectedMobileStage === "raw-salt";
    const desktopVideoElement = desktopVideo.current;
    const mobileVideoElement = mobileVideo.current;

    syncVideoPlayback(desktopVideoElement, desktopRawSaltActive);
    syncVideoPlayback(mobileVideoElement, mobileRawSaltActive);

    return () => {
      desktopVideoElement?.pause();
      mobileVideoElement?.pause();
    };
  }, [hoveredStage, isMobile, renderedStage, selectedMobileStage]);

  const previewPosition = {
    "--active-stage": activeIndex,
  } as CSSProperties;

  return (
    <section ref={root} id="process-map" className="raw-process" aria-labelledby="raw-process-heading">
      <div className="raw-process-shell">
        <header className="raw-process-intro">
          <p className="raw-process-eyebrow">PROCESS / 02</p>
          <h2 id="raw-process-heading" className="raw-process-heading">
            <span>HOW A SALT</span>
            <span>REFINERY WORKS.</span>
          </h2>
          <p className="raw-process-support">
            From raw salt intake to final packing,<br />
            each stage is connected to the next.
          </p>
        </header>

        <div className="raw-process-layout">
          <div
            className="raw-process-interaction"
            data-hovering={hoveredStage ? "true" : undefined}
            style={previewPosition}
            onPointerLeave={(event) => {
              if (event.pointerType === "mouse") setHoveredStage(null);
            }}
          >
            <ol className="raw-process-list raw-process-desktop-list" aria-label="Salt refinery process stages">
              {processStages.map((process) => {
                const active = displayedDesktopStage === process.id;

                return (
                  <li
                    className="raw-process-stage-item"
                    data-active={active ? "true" : undefined}
                    key={process.id}
                    onPointerEnter={(event) => {
                      if (event.pointerType === "mouse") setHoveredStage(process.id);
                    }}
                  >
                    <div className="raw-process-desktop-row">
                      <span className="raw-process-stage-number">{process.number}</span>
                      <strong>{process.name}</strong>
                      <span className="raw-process-stage-marker" aria-hidden="true" />
                    </div>
                  </li>
                );
              })}
            </ol>

            <ol className="raw-process-list raw-process-mobile-list" aria-label="Salt refinery process stages">
              {processStages.map((process) => {
                const selected = selectedMobileStage === process.id;
                const mobileDetailId = `process-mobile-detail-${process.id}`;

                return (
                  <li
                    className="raw-process-stage-item"
                    data-active={selected ? "true" : undefined}
                    data-selected={selected ? "true" : undefined}
                    key={process.id}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedMobileStage((current) => current === process.id ? null : process.id);
                      }}
                      aria-expanded={selected}
                      aria-controls={mobileDetailId}
                    >
                      <span className="raw-process-stage-number">{process.number}</span>
                      <strong>{process.name}</strong>
                      <span className="raw-process-stage-marker" aria-hidden="true" />
                    </button>

                    {selected && (
                      <div id={mobileDetailId} className="raw-process-mobile-detail">
                        <div className="raw-process-mobile-media">
                          <StageMedia
                            stage={process}
                            videoRef={process.id === "raw-salt" ? mobileVideo : undefined}
                            shouldPlay={isMobile && process.id === "raw-salt"}
                          />
                        </div>
                        <div className="raw-process-mobile-copy">
                          <StageCopy stage={process} />
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>

            <div ref={preview} id="process-stage-preview" className="raw-process-preview" aria-live="polite">
              <div ref={previewContent} className="raw-process-preview-content">
                <StageMedia
                  stage={renderedProcess}
                  videoRef={renderedProcess.id === "raw-salt" ? desktopVideo : undefined}
                  shouldPlay={!isMobile && hoveredStage === "raw-salt"}
                />
              </div>
            </div>
          </div>

          <article ref={copyContent} id="process-stage-copy" className="raw-process-copy" aria-live="polite">
            <StageCopy stage={renderedProcess} />
          </article>
        </div>
      </div>
    </section>
  );
}
