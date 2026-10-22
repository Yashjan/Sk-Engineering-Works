"use client";

import dynamic from "next/dynamic";
import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ScrewConveyorInspection, ScrewConveyorMotion } from "./ScrewConveyorCanvas";
import "./screw-conveyor-experience.css";
import { assetPath } from "@/lib/asset-path";

const ScrewConveyorCanvas = dynamic(() => import("./ScrewConveyorCanvas"), {
  ssr: false,
  loading: () => null,
});

type SceneMetrics = {
  panelX: number;
  panelY: number;
  panelScaleX: number;
  panelScaleY: number;
  modelX: number;
  modelY: number;
  modelWidth: number;
};

const degrees = (value: number) => value * Math.PI / 180;
const clamp = (value: number, minimum: number, maximum: number) => Math.min(maximum, Math.max(minimum, value));
const HERO_YAW = degrees(11);
const HERO_PITCH = degrees(-4);

export default function ScrewConveyorExperience() {
  const root = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const whiteStage = useRef<HTMLDivElement>(null);
  const sceneTwoTarget = useRef<HTMLDivElement>(null);
  const sceneTwoCopy = useRef<HTMLDivElement>(null);
  const sceneThree = useRef<HTMLDivElement>(null);
  const scrollCue = useRef<HTMLParagraphElement>(null);
  const inspectionHint = useRef<HTMLParagraphElement>(null);
  const canvasShell = useRef<HTMLDivElement>(null);
  const motion = useRef<ScrewConveyorMotion>({
    x: 0,
    y: 0,
    z: 0,
    width: 0.84,
    yaw: HERO_YAW,
    pitch: HERO_PITCH,
    roll: 0,
    cameraZ: 6,
    floatStrength: 0,
    shadowStrength: 1,
    scrollVelocity: 0,
    inertiaStrength: 1,
  });
  const inspection = useRef<ScrewConveyorInspection>({
    enabled: true,
    dragging: false,
    intent: "pending",
    pointerId: null,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    lastTime: 0,
    targetYaw: 0,
    targetPitch: 0,
    velocityYaw: 0,
    velocityPitch: 0,
    keyHorizontal: 0,
    keyVertical: 0,
    resetVersion: 0,
    zoomTarget: 1,
    panTarget: 0,
  });
  const lastTapTime = useRef(0);
  const touchPoints = useRef(new Map<number, { x: number; y: number }>());
  const pinchStartDistance = useRef<number | null>(null);
  const pinchStartZoom = useRef(1);
  const pinchStartPan = useRef(0);
  const pinchMidpoint = useRef({ x: 0, y: 0 });
  const [modelReady, setModelReady] = useState(false);

  const handleModelReady = useCallback(() => {
    setModelReady(true);
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, []);

  const dismissInspectionHint = useCallback(() => {
    inspectionHint.current?.classList.add("is-dismissed");
  }, []);

  const resetInspection = useCallback(() => {
    const controls = inspection.current;
    controls.targetYaw = 0;
    controls.targetPitch = 0;
    controls.velocityYaw = 0;
    controls.velocityPitch = 0;
    controls.zoomTarget = 1;
    controls.panTarget = 0;
    controls.resetVersion += 1;
    inspectionHint.current?.classList.add("is-dismissed");
  }, []);

  const endPointerInspection = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const controls = inspection.current;
    if (event.pointerType === "touch") touchPoints.current.delete(event.pointerId);
    if (controls.pointerId !== event.pointerId && touchPoints.current.size > 0) return;
    const wasTap = event.pointerType === "touch" && controls.intent === "pending";
    if (wasTap && event.timeStamp - lastTapTime.current < 360) resetInspection();
    if (wasTap) lastTapTime.current = event.timeStamp;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    controls.dragging = false;
    controls.pointerId = null;
    controls.intent = "pending";
    if (touchPoints.current.size < 2) {
      pinchStartDistance.current = null;
        pinchStartPan.current = 0;
      pinchMidpoint.current = { x: 0, y: 0 };
    }
    event.currentTarget.dataset.inspection = controls.enabled ? "enabled" : "disabled";
  }, [resetInspection]);

  const handlePointerDown = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const controls = inspection.current;
    if (!controls.enabled || (event.pointerType === "mouse" && event.button !== 0)) return;
    if (event.pointerType === "touch") {
      touchPoints.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (touchPoints.current.size === 2) {
        const points = [...touchPoints.current.values()];
        pinchStartDistance.current = Math.hypot(points[1].x - points[0].x, points[1].y - points[0].y);
        pinchMidpoint.current = { x: (points[0].x + points[1].x) / 2, y: (points[0].y + points[1].y) / 2 };
        pinchStartZoom.current = controls.zoomTarget;
        pinchStartPan.current = controls.panTarget;
        controls.intent = "rotate";
        controls.dragging = false;
        dismissInspectionHint();
      }
    }
    controls.pointerId = event.pointerId;
    controls.startX = event.clientX;
    controls.startY = event.clientY;
    controls.lastX = event.clientX;
    controls.lastY = event.clientY;
    controls.lastTime = event.timeStamp;
    controls.intent = event.pointerType === "mouse" ? "rotate" : "pending";
    controls.dragging = event.pointerType === "mouse";
    controls.velocityYaw = 0;
    controls.velocityPitch = 0;
    event.currentTarget.focus({ preventScroll: true });
    if (controls.dragging) {
      event.currentTarget.setPointerCapture(event.pointerId);
      event.currentTarget.dataset.inspection = "dragging";
      dismissInspectionHint();
    }
  }, [dismissInspectionHint]);

  const handlePointerMove = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const controls = inspection.current;
    if (!controls.enabled || (controls.pointerId !== event.pointerId && !touchPoints.current.has(event.pointerId)) || controls.intent === "scroll") return;
    if (event.pointerType === "touch" && touchPoints.current.has(event.pointerId)) {
      touchPoints.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (touchPoints.current.size === 2 && pinchStartDistance.current) {
        const points = [...touchPoints.current.values()];
        const distance = Math.hypot(points[1].x - points[0].x, points[1].y - points[0].y);
        const midpoint = { x: (points[0].x + points[1].x) / 2, y: (points[0].y + points[1].y) / 2 };
        const nextZoom = clamp(pinchStartZoom.current * distance / pinchStartDistance.current, 1, 3.2);
        const rect = event.currentTarget.getBoundingClientRect();
        const localMidpointX = pinchMidpoint.current.x - rect.left;
        const focalOffset = (localMidpointX / Math.max(rect.width, 1)) * 2 - 1;
        controls.zoomTarget = nextZoom;
        // Keep the content beneath the pinch midpoint stationary as scale changes.
        // Pan is expressed in the model's normalized viewport space.
        const panLimit = Math.max(0.08, (nextZoom - 1) * 1.35);
        controls.panTarget = clamp(pinchStartPan.current + focalOffset * (1 - nextZoom / pinchStartZoom.current) * 1.35, -panLimit, panLimit);
        controls.panTarget = clamp(controls.panTarget + (midpoint.x - pinchMidpoint.current.x) * 0.012, -panLimit, panLimit);
        pinchMidpoint.current = midpoint;
        event.preventDefault();
        return;
      }
    }
    if (event.pointerType === "touch" && touchPoints.current.size === 1 && controls.zoomTarget > 1.15) {
      const panLimit = Math.max(0.08, (controls.zoomTarget - 1) * 1.35);
      controls.panTarget = clamp(controls.panTarget + (event.clientX - controls.lastX) * 0.012, -panLimit, panLimit);
      controls.lastX = event.clientX;
      controls.lastY = event.clientY;
      event.preventDefault();
      return;
    }

    if (controls.intent === "pending") {
      const totalX = event.clientX - controls.startX;
      const totalY = event.clientY - controls.startY;
      if (Math.hypot(totalX, totalY) < 8) return;
      if (Math.abs(totalX) <= Math.abs(totalY) * 1.25) {
        controls.intent = "scroll";
        controls.pointerId = null;
        return;
      }
      controls.intent = "rotate";
      controls.dragging = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      event.currentTarget.dataset.inspection = "dragging";
      dismissInspectionHint();
    }

    if (!controls.dragging) return;
    const deltaX = event.clientX - controls.lastX;
    const deltaY = event.clientY - controls.lastY;
    const elapsed = Math.max(8, event.timeStamp - controls.lastTime) / 1000;
    const yawDelta = deltaX * (event.pointerType === "touch" ? 0.0035 : 0.004);
    controls.targetYaw += yawDelta;
    controls.targetPitch += deltaY * 0.0022;
    controls.velocityYaw = clamp(yawDelta / elapsed, -0.65, 0.65);
    controls.velocityPitch = clamp((deltaY * 0.0022) / elapsed, -0.55, 0.55);
    controls.lastX = event.clientX;
    controls.lastY = event.clientY;
    controls.lastTime = event.timeStamp;
    event.preventDefault();
  }, [dismissInspectionHint]);

  const handleKeyDown = useCallback((event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!inspection.current.enabled || !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
    const target = event.target as HTMLElement;
    if (target.matches("input, textarea, select, [contenteditable='true']")) return;
    event.preventDefault();
    inspection.current.keyHorizontal = event.key === "ArrowLeft" ? -1 : event.key === "ArrowRight" ? 1 : 0;
    inspection.current.keyVertical = event.key === "ArrowUp" ? -1 : event.key === "ArrowDown" ? 1 : 0;
    dismissInspectionHint();
  }, [dismissInspectionHint]);

  const handleKeyUp = useCallback((event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") inspection.current.keyHorizontal = 0;
    if (event.key === "ArrowUp" || event.key === "ArrowDown") inspection.current.keyVertical = 0;
  }, []);

  useLayoutEffect(() => {
    const section = root.current;
    const stickyViewport = viewport.current;
    const panel = whiteStage.current;
    const target = sceneTwoTarget.current;
    const copy = sceneTwoCopy.current;
    const finalScene = sceneThree.current;
    const cue = scrollCue.current;
    const hint = inspectionHint.current;
    const interactionSurface = canvasShell.current;
    if (!section || !stickyViewport || !panel || !target || !copy || !finalScene || !cue || !hint || !interactionSurface) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add({
      motionAllowed: "(prefers-reduced-motion: no-preference)",
      mobile: "(max-width: 767px)",
    }, (context) => {
      if (!context.conditions?.motionAllowed) {
        Object.assign(motion.current, {
          x: 0,
          y: 0,
          z: 0,
          width: context.conditions?.mobile ? 0.9 : 0.84,
          yaw: HERO_YAW,
          pitch: HERO_PITCH,
          roll: 0,
          cameraZ: 6,
          floatStrength: 0,
          shadowStrength: 1,
          scrollVelocity: 0,
          inertiaStrength: 0,
        });
        inspection.current.enabled = false;
        inspection.current.keyHorizontal = 0;
        inspection.current.keyVertical = 0;
        interactionSurface.dataset.inspection = "disabled";
        interactionSurface.tabIndex = -1;
        return;
      }
      const mobile = Boolean(context.conditions.mobile);
      if (mobile) ScrollTrigger.config({ ignoreMobileResize: true });
      const navbar = document.querySelector<HTMLElement>("[data-navbar]");
      const metrics: SceneMetrics = {
        panelX: 0,
        panelY: 0,
        panelScaleX: 1,
        panelScaleY: 1,
        modelX: mobile ? 0 : 0.25,
        modelY: mobile ? -0.16 : 0,
        modelWidth: mobile ? 0.76 : 0.43,
      };

      const setInspectionEnabled = (enabled: boolean) => {
        const controls = inspection.current;
        if (controls.enabled === enabled) return;
        controls.enabled = enabled;
        controls.keyHorizontal = 0;
        controls.keyVertical = 0;
        controls.velocityYaw = 0;
        controls.velocityPitch = 0;
        controls.zoomTarget = 1;
        controls.panTarget = 0;
        touchPoints.current.clear();
        pinchStartDistance.current = null;
      pinchStartPan.current = 0;
        pinchMidpoint.current = { x: 0, y: 0 };
        if (enabled) {
          controls.targetYaw = 0;
          controls.targetPitch = 0;
          controls.resetVersion += 1;
        }
        if (controls.pointerId !== null && interactionSurface.hasPointerCapture(controls.pointerId)) {
          interactionSurface.releasePointerCapture(controls.pointerId);
        }
        controls.pointerId = null;
        controls.dragging = false;
        controls.intent = "pending";
        interactionSurface.dataset.inspection = enabled ? "enabled" : "disabled";
        interactionSurface.tabIndex = enabled ? 0 : -1;
        if (!enabled && document.activeElement === interactionSurface) interactionSurface.blur();
      };

      const measureTargets = () => {
        const viewportBounds = stickyViewport.getBoundingClientRect();
        const targetBounds = target.getBoundingClientRect();
        const centerX = targetBounds.left + targetBounds.width / 2;
        const centerY = targetBounds.top + targetBounds.height / 2;
        metrics.panelX = centerX - (viewportBounds.left + viewportBounds.width / 2);
        metrics.panelY = centerY - (viewportBounds.top + viewportBounds.height / 2);
        metrics.panelScaleX = targetBounds.width / panel.offsetWidth;
        metrics.panelScaleY = targetBounds.height / panel.offsetHeight;
        metrics.modelX = metrics.panelX / viewportBounds.width + (mobile ? 0 : 0.02);
        metrics.modelY = -metrics.panelY / viewportBounds.height;
        metrics.modelWidth = targetBounds.width / viewportBounds.width * (mobile ? 0.88 : 0.86);
      };
      measureTargets();

      const animation = gsap.context(() => {
        const kicker = copy.querySelector<HTMLElement>(".screw-conveyor-kicker");
        const headingLines = copy.querySelectorAll<HTMLElement>(".screw-conveyor-heading-line > span");
        const supportingCopy = copy.querySelectorAll<HTMLElement>(".screw-conveyor-function, .screw-conveyor-summary");
        const heroWidth = mobile ? 0.9 : 0.84;
        gsap.set(panel, { x: 0, y: 0, scaleX: 1, scaleY: 1, borderRadius: 0 });
        gsap.set(copy, { autoAlpha: 0 });
        gsap.set(kicker, { autoAlpha: 0, y: 12 });
        gsap.set(headingLines, { yPercent: 108 });
        gsap.set(supportingCopy, { autoAlpha: 0, y: 14 });
        gsap.set(finalScene, { yPercent: 100 });
        gsap.set(cue, { autoAlpha: 1 });
        gsap.set(hint, { autoAlpha: 1 });
        gsap.set(motion.current, {
          x: 0,
          y: mobile ? -0.015 : -0.025,
          z: 0,
          width: heroWidth,
          yaw: HERO_YAW,
          pitch: HERO_PITCH,
          roll: 0,
          cameraZ: 6,
          floatStrength: 1,
          shadowStrength: 1,
          scrollVelocity: 0,
          inertiaStrength: mobile ? 0.5 : 1,
        });
        setInspectionEnabled(true);
        if (navbar) gsap.set(navbar, { autoAlpha: 0, y: -8, pointerEvents: "none" });

        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            id: "screw-conveyor-scenes-01-03",
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: mobile ? 0.36 : 0.48,
            invalidateOnRefresh: true,
            onRefreshInit: measureTargets,
            onUpdate: (self) => {
              motion.current.scrollVelocity = clamp(self.getVelocity() / 1400, -1, 1);
              const inInspectionScene = self.progress <= 0.012;
              // Mobile inspection remains available anywhere the pinned machine is visible.
              setInspectionEnabled(mobile || inInspectionScene);
              if (!inInspectionScene) hint.classList.add("is-dismissed");
            },
          },
        });

        timeline
          .to(cue, { autoAlpha: 0, y: -10, duration: 0.18 }, 0)
          .to(hint, { autoAlpha: 0, y: -8, duration: 0.16 }, 0)
          .to(panel, {
            x: () => metrics.panelX,
            y: () => metrics.panelY,
            scaleX: () => metrics.panelScaleX,
            scaleY: () => metrics.panelScaleY,
            borderRadius: mobile ? 18 : 24,
            duration: 1,
            ease: "power3.inOut",
          }, 0)
          .to(motion.current, {
            x: () => metrics.modelX * (mobile ? 0.82 : 0.72),
            y: () => metrics.modelY * 0.64,
            z: -0.12,
            width: () => metrics.modelWidth + (heroWidth - metrics.modelWidth) * 0.3,
            yaw: degrees(15),
            pitch: degrees(-3),
            roll: degrees(0.3),
            cameraZ: 6.08,
            floatStrength: 0.3,
            duration: 0.62,
            ease: "power2.inOut",
          }, 0)
          .to(motion.current, {
            x: () => metrics.modelX,
            y: () => metrics.modelY,
            z: -0.25,
            width: () => metrics.modelWidth,
            yaw: degrees(mobile ? 15 : 18),
            pitch: degrees(-1.5),
            roll: degrees(0.4),
            cameraZ: 6.2,
            floatStrength: 0.1,
            duration: 0.38,
            ease: "power2.out",
          }, 0.62)
          .set(copy, { autoAlpha: 1 }, 0.29)
          .to(kicker, { autoAlpha: 1, y: 0, duration: 0.24, ease: "power2.out" }, 0.31)
          .to(headingLines[0], { yPercent: 0, duration: 0.34, ease: "power3.out" }, 0.34)
          .to(headingLines[1], { yPercent: 0, duration: 0.36, ease: "power3.out" }, 0.41)
          .to(supportingCopy, { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.07, ease: "power2.out" }, 0.51)
          .to(navbar, { autoAlpha: 1, y: 0, pointerEvents: "auto", duration: 0.3 }, 0.3)
          .to(copy, { autoAlpha: 0, yPercent: -115, duration: 0.46, ease: "power2.in" }, 1.14)
          .to(panel, {
            y: () => metrics.panelY - window.innerHeight * 1.12,
            duration: 1.04,
            ease: "power2.inOut",
          }, 1.18)
          .to(finalScene, { yPercent: 0, duration: 1.18, ease: "power2.inOut" }, 1.12)
          .to(motion.current, {
            x: () => mobile ? metrics.modelX * 0.68 : metrics.modelX * 0.78,
            y: () => metrics.modelY - (mobile ? 0.025 : 0.045),
            z: 0.12,
            width: () => metrics.modelWidth * (mobile ? 1.08 : 1.16),
            yaw: degrees(mobile ? 19 : 23),
            pitch: 0,
            roll: degrees(1),
            cameraZ: 6.05,
            floatStrength: 0,
            shadowStrength: 0.65,
            duration: 0.28,
            ease: "power2.in",
          }, 1.16)
          .to(motion.current, {
            x: mobile ? 0 : 0.07,
            y: mobile ? -0.08 : -0.12,
            z: 0.32,
            width: mobile ? 0.84 : 0.72,
            yaw: degrees(mobile ? 23 : 29),
            pitch: degrees(2),
            roll: degrees(mobile ? 0.7 : 1.4),
            cameraZ: 5.78,
            shadowStrength: 0.28,
            duration: 0.42,
            ease: "power2.inOut",
          }, 1.44)
          .to(motion.current, {
            x: 0,
            y: 0,
            z: 0,
            width: heroWidth,
            yaw: HERO_YAW,
            pitch: HERO_PITCH,
            roll: 0,
            cameraZ: 6,
            floatStrength: 0.08,
            shadowStrength: 1,
            duration: 0.72,
            ease: "power3.out",
          }, 1.86);
      }, section);

      const refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => {
        cancelAnimationFrame(refreshFrame);
        setInspectionEnabled(false);
        animation.revert();
      };
    }, section);

    return () => media.revert();
  }, []);

  return (
    <section ref={root} className={`screw-conveyor-experience${modelReady ? " is-model-ready" : ""}`} aria-labelledby="screw-conveyor-title">
      <div ref={viewport} className="screw-conveyor-viewport">
        <div ref={whiteStage} className="screw-conveyor-white-stage" aria-hidden="true" />
        <div ref={sceneTwoTarget} className="screw-conveyor-scene-two-target" aria-hidden="true" />
        <div ref={sceneThree} className="screw-conveyor-scene-three" aria-hidden="true" />

        <div className={`screw-conveyor-model-loader${modelReady ? " is-ready" : ""}`} aria-hidden={modelReady}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={assetPath("/images/sk-logo.png")} alt="" />
          <strong>3D MODEL IS LOADING</strong>
          <span>Please wait…</span>
        </div>

        <div
          ref={canvasShell}
          className={`screw-conveyor-canvas-shell${modelReady ? " is-model-ready" : ""}`}
          data-inspection="enabled"
          role="group"
          tabIndex={0}
          aria-label="Interactive 3D screw conveyor. Drag or use the left and right arrow keys to inspect."
          aria-describedby="screw-conveyor-inspection-hint"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endPointerInspection}
          onPointerCancel={endPointerInspection}
          onDoubleClick={resetInspection}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onBlur={() => { inspection.current.keyHorizontal = 0; inspection.current.keyVertical = 0; }}
        >
          <ScrewConveyorCanvas motion={motion} inspection={inspection} onReady={handleModelReady} />
        </div>

        <div ref={sceneTwoCopy} className="screw-conveyor-identity">
          <p className="screw-conveyor-kicker">MACHINE <span>/</span> 01</p>
          <h1 id="screw-conveyor-title">
            <span className="screw-conveyor-heading-line"><span>SCREW</span></span>
            <span className="screw-conveyor-heading-line"><span>CONVEYOR</span></span>
          </h1>
          <p className="screw-conveyor-function">CONTINUOUS MATERIAL TRANSFER</p>
          <p className="screw-conveyor-summary">Engineered for controlled material movement across industrial process systems.</p>
        </div>

        <p ref={scrollCue} className="screw-conveyor-scroll-cue" aria-hidden="true">
          <span>SCROLL TO EXPLORE</span><b>↓</b>
        </p>
        <p ref={inspectionHint} id="screw-conveyor-inspection-hint" className="screw-conveyor-inspection-hint">
          DRAG TO INSPECT <span aria-hidden="true">↔</span>
        </p>
        <p className={`screw-conveyor-loading${modelReady ? " is-ready" : ""}`} aria-live="polite">
          {modelReady ? "OBJECT READY" : "LOADING OBJECT / 3D"}
        </p>
      </div>
    </section>
  );
}
