"use client";

import { useEffect, useId, useRef, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import Image from "@/components/media/ProgressiveImage";
import { assetPath } from "@/lib/asset-path";

const previewSrc = assetPath("/images/salt-refinery/complete-execution/SK_Plant_Elevation_Preview.webp");
const detailSrc = assetPath("/images/salt-refinery/complete-execution/SK_Plant_Elevation_Detail.png");
const drawingWidth = 3580;
const drawingHeight = 2080;

type PlantElevationDrawingProps = {
  className: string;
  anchorId: string;
};

export default function PlantElevationDrawing({ className, anchorId }: PlantElevationDrawingProps) {
  const titleId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (!open) return;

    const bodyOverflow = document.body.style.overflow;
    const htmlOverflow = document.documentElement.style.overflow;
    const trigger = triggerRef.current;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const focusFrame = requestAnimationFrame(() => closeRef.current?.focus());
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        setZoom(1);
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;
      const controls = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          "button:not([disabled]), [href], [tabindex]:not([tabindex='-1'])",
        ),
      );
      const first = controls[0];
      const last = controls.at(-1);
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = bodyOverflow;
      document.documentElement.style.overflow = htmlOverflow;
      requestAnimationFrame(() => trigger?.focus());
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    setZoom(1);
  };

  const closeFromBackdrop = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) close();
  };

  return (
    <>
      <article id={anchorId} className={`execution-drawing-card ${className}`} aria-labelledby={`${titleId}-card`}>
        <div className="execution-drawing-copy">
          <p>STAGE 01 / ENGINEERING DOCUMENTATION</p>
          <h3 id={`${titleId}-card`}>Plant Side Elevation &amp; Equipment Arrangement</h3>
          <span>Actual 2D plant elevation prepared by S.K. Engineering Works for equipment positioning and structural coordination.</span>
        </div>

        <figure className="execution-drawing-document">
          <button
            ref={triggerRef}
            className="execution-drawing-trigger"
            type="button"
            aria-haspopup="dialog"
            aria-label="Inspect the high-resolution plant side elevation and equipment arrangement"
            onClick={() => setOpen(true)}
          >
            <span className="execution-drawing-preview">
              <Image
                src={previewSrc}
                alt="Technical side elevation and equipment arrangement drawing for a salt refinery plant"
                fill
                sizes="(max-width: 767px) 78vw, (max-width: 1099px) 76vw, 58vw"
              />
            </span>
            <span className="execution-drawing-action">VIEW HIGH-RES DRAWING <b aria-hidden="true">↗</b></span>
          </button>
          <figcaption>PLANT SIDE ELEVATION / EQUIPMENT ARRANGEMENT</figcaption>
        </figure>
      </article>

      {open && typeof document !== "undefined" && createPortal(
        <div className="execution-drawing-lightbox" role="presentation" onMouseDown={closeFromBackdrop}>
          <div
            ref={dialogRef}
            className="execution-drawing-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${titleId}-dialog`}
          >
            <header className="execution-drawing-dialog-header">
              <div>
                <p>ENGINEERING DOCUMENT / STAGE 01</p>
                <h2 id={`${titleId}-dialog`}>Plant Side Elevation &amp; Equipment Arrangement</h2>
              </div>
              <div className="execution-drawing-controls" aria-label="Drawing zoom controls">
                <button type="button" onClick={() => setZoom((value) => Math.max(1, value - 0.5))} disabled={zoom === 1} aria-label="Zoom out">−</button>
                <output aria-live="polite">{Math.round(zoom * 100)}%</output>
                <button type="button" onClick={() => setZoom((value) => Math.min(3, value + 0.5))} disabled={zoom === 3} aria-label="Zoom in">+</button>
                <button type="button" onClick={() => setZoom(1)}>RESET</button>
                <button ref={closeRef} className="execution-drawing-close" type="button" onClick={close} aria-label="Close drawing inspection">CLOSE <span aria-hidden="true">×</span></button>
              </div>
            </header>

            <div className="execution-drawing-scroller" tabIndex={0} aria-label="Scrollable high-resolution engineering drawing">
              <div
                className="execution-drawing-full"
                style={{ width: `${zoom * 100}%` }}
              >
                <Image
                  src={detailSrc}
                  alt="High-resolution S.K. Engineering Works salt refinery plant side elevation showing equipment arrangement and dimensions"
                  width={drawingWidth}
                  height={drawingHeight}
                  sizes="100vw"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
