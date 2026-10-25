"use client";

import { Suspense, useEffect, useMemo, useRef, useSyncExternalStore, type MutableRefObject, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, useGLTF } from "@react-three/drei";
import { Box3, Matrix4, Group, Material, MathUtils, Mesh, PerspectiveCamera, Quaternion, Vector3 } from "three";
import { componentChapters, type ComponentDetail } from "./component-inspection";
import { applyComponentVisibility, captureComponentMaterial } from "./component-materials";
import SaltMaterialFlow from "./SaltMaterialFlow";
import { deriveScrewConveyorLandmarks } from "./screw-conveyor-landmarks";
import { screwConveyorModelUrl } from "./screw-conveyor-assets";

const PRESENTATION_FOV = 32;
const PRESENTATION_DISTANCE = 6;
const MOBILE_RENDER_QUERY = "(max-width: 767px), (pointer: coarse)";

const subscribeToMobileProfile = (onChange: () => void) => {
  const query = window.matchMedia(MOBILE_RENDER_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

const getMobileProfile = () => window.matchMedia(MOBILE_RENDER_QUERY).matches;
const getServerMobileProfile = () => false;

function useMobileRenderingProfile() {
  return useSyncExternalStore(subscribeToMobileProfile, getMobileProfile, getServerMobileProfile);
}
const explodePartNames = ["DRIVE_ASSEMBLY", "COUPLING", "BODY", "SCREW", "BEARING_SHAFT_INLET", "BEARING_BLOCK_INLET", "BEARING_SHAFT_OUTLET", "BEARING_BLOCK_OUTLET"] as const;
type ExplodePartName = (typeof explodePartNames)[number];
type ExplodeOffset = readonly [number, number, number];
const explodeOffsets: Record<ExplodePartName, { desktop: ExplodeOffset; mobile: ExplodeOffset }> = {
  DRIVE_ASSEMBLY: { desktop: [0.02, -0.08, 0.27], mobile: [0.02, -0.08, 0.18] },
  COUPLING: { desktop: [0.02, -0.08, 0.12], mobile: [0.02, -0.08, 0.12] },
  BODY: { desktop: [0, 0.32, 0], mobile: [0, 0.25, 0] },
  SCREW: { desktop: [0.05, -0.32, 0], mobile: [0.05, -0.25, 0] },
  BEARING_SHAFT_INLET: { desktop: [0.02, -0.09, 0.09], mobile: [0.02, -0.09, 0.09] },
  BEARING_BLOCK_INLET: { desktop: [0.02, -0.1, -0.13], mobile: [0.02, -0.1, -0.13] },
  BEARING_SHAFT_OUTLET: { desktop: [0.02, -0.09, -0.11], mobile: [0.02, -0.09, -0.11] },
  BEARING_BLOCK_OUTLET: { desktop: [0.02, -0.1, -0.22], mobile: [0.02, -0.1, -0.22] },
};
const verifiedGroups = [
  "ScrewConveyor_ROOT",
  "BODY",
  "SCREW",
  "COUPLING",
  "DRIVE_ASSEMBLY",
  "BEARING_SHAFT_INLET",
  "BEARING_BLOCK_INLET",
  "BEARING_SHAFT_OUTLET",
  "BEARING_BLOCK_OUTLET",
  "BRANDING",
] as const;
const ghostShellMeshes = new Set([
  "BODY_SECTION_08_00",
  "BODY_SECTION_08_01",
  "BODY_SECTION_09_00",
  "BODY_SECTION_10_00",
  "BODY_SECTION_11_00",
  "BODY_SECTION_12_00",
  "BODY_SECTION_12_01",
]);

export type ScrewConveyorMotion = {
  x: number;
  y: number;
  z: number;
  width: number;
  portraitExplode: number;
  yaw: number;
  pitch: number;
  roll: number;
  cameraZ: number;
  floatStrength: number;
  shadowStrength: number;
  scrollVelocity: number;
  inertiaStrength: number;
  explode: number;
  travelTurn: number;
};

export type ScrewConveyorInspection = {
  enabled: boolean;
  dragging: boolean;
  intent: "pending" | "rotate" | "scroll";
  pointerId: number | null;
  startX: number;
  startY: number;
  lastX: number;
  lastY: number;
  lastTime: number;
  targetYaw: number;
  targetPitch: number;
  velocityYaw: number;
  velocityPitch: number;
  keyHorizontal: -1 | 0 | 1;
  keyVertical: -1 | 0 | 1;
  resetVersion: number;
  zoomTarget: number;
  panTarget: number;
};

export type ScrewConveyorWorking = {
  active: number;
  progress: number;
  cutaway: number;
  drive: number;
  couplingRotation: number;
  screwRotation: number;
  saltVisibility: number;
  saltProgress: number;
};

export type ModelReport = {
  size: [number, number, number];
  meshCount: number;
  materialCount: number;
  groups: Record<(typeof verifiedGroups)[number], boolean>;
};

type MachineModelProps = {
  motion: MutableRefObject<ScrewConveyorMotion>;
  inspection: MutableRefObject<ScrewConveyorInspection>;
  onReady: (report: ModelReport) => void;
  calloutsRef: RefObject<HTMLDivElement | null>;
  materialCalloutRef: RefObject<HTMLDivElement | null>;
  detail: MutableRefObject<ComponentDetail>;
  working: MutableRefObject<ScrewConveyorWorking>;
  mobileRendering?: boolean;
};

function MachineModel({ motion, inspection, onReady, calloutsRef, materialCalloutRef, detail, working, mobileRendering = false }: MachineModelProps) {
  const positionGroup = useRef<Group>(null);
  const scrollInertiaGroup = useRef<Group>(null);
  const cinematicGroup = useRef<Group>(null);
  const interactionGroup = useRef<Group>(null);
  const floatGroup = useRef<Group>(null);
  const zoomGroup = useRef<Group>(null);
  const panGroup = useRef<Group>(null);
  const guidedGroup = useRef<Group>(null);
  const modelRootGroup = useRef<Group>(null);
  const shadowGroup = useRef<Group>(null);
  const interactionRuntime = useRef({
    targetQuaternion: new Quaternion(),
    neutralQuaternion: new Quaternion(),
    velocityYaw: 0,
    velocityPitch: 0,
    lastYawInput: 0,
    lastPitchInput: 0,
    lastResetVersion: 0,
    scrollVelocity: 0,
  });
  const worldYAxis = useMemo(() => new Vector3(0, 1, 0), []);
  const localXAxis = useMemo(() => new Vector3(1, 0, 0), []);
  const deltaQuaternion = useMemo(() => new Quaternion(), []);
  const { scene } = useGLTF(screwConveyorModelUrl);
  const model = useMemo(() => {
    // Build the model and its owned materials together. Later memos only read
    // this clone, so Strict Mode cannot leave snapshots pointing at old clones.
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if (!(child as Mesh).isMesh) return;
      const mesh = child as Mesh;
      mesh.material = Array.isArray(mesh.material)
        ? mesh.material.map((material) => material.clone())
        : mesh.material.clone();
    });
    return clone;
  }, [scene]);
  const presentation = useMemo(() => {
    model.updateWorldMatrix(true, true);
    const bounds = new Box3().setFromObject(model);
    const size = bounds.getSize(new Vector3());
    const center = bounds.getCenter(new Vector3());
    let meshCount = 0;
    const geometryBounds: Array<{ object: Mesh; bounds: Box3 }> = [];
    const materials = new Set<Material>();
    const groups = Object.fromEntries(verifiedGroups.map((name) => [name, Boolean(model.getObjectByName(name))])) as ModelReport["groups"];

    model.traverse((object) => {
      if (!(object as Mesh).isMesh) return;
      const mesh = object as Mesh;
      meshCount += 1;
      mesh.geometry.computeBoundingBox();
      geometryBounds.push({ object: mesh, bounds: mesh.geometry.boundingBox!.clone() });
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      const meshMaterials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      meshMaterials.forEach((material) => materials.add(material));
    });

    return {
      center,
      geometryBounds,
      size,
      length: size.z,
      report: {
        size: size.toArray() as [number, number, number],
        meshCount,
        materialCount: materials.size,
        groups,
      },
    };
  }, [model]);
  const landmarks = useMemo(() => deriveScrewConveyorLandmarks(model), [model]);
  const explodeParts = useMemo(() => {
    return explodePartNames.map((name) => {
      const object = model.getObjectByName(name);
      return object ? { object, origin: object.position.clone(), quaternion: object.quaternion.clone(), scale: object.scale.clone(), name } : null;
    }).filter(Boolean) as Array<{ object: Group; origin: Vector3; quaternion: Quaternion; scale: Vector3; name: ExplodePartName }>;
  }, [model]);

  const calloutAnchors = useMemo(() => {
    const names: ExplodePartName[] = ["DRIVE_ASSEMBLY", "COUPLING", "BEARING_SHAFT_INLET", "BEARING_BLOCK_INLET", "BODY", "SCREW", "BEARING_SHAFT_OUTLET", "BEARING_BLOCK_OUTLET"];
    model.updateWorldMatrix(true, true);
    return names.map((name) => {
      const object = model.getObjectByName(name);
      if (!object) throw new Error(`Missing screw conveyor callout component: ${name}`);
      const center = new Box3().setFromObject(object).getCenter(new Vector3());
      return { object, local: object.worldToLocal(center), point: new Vector3() };
    });
  }, [model]);
  const detailComponents = useMemo(() => {
    model.updateWorldMatrix(true, true);
    return componentChapters.map((chapter) => {
      const objects = chapter.nodes.map((name) => {
        const object = model.getObjectByName(name);
        if (!object) throw new Error(`Missing component inspection node: ${name}`);
        return object;
      });
      const bounds = new Box3();
      objects.forEach((object) => bounds.union(new Box3().setFromObject(object)));
      const center = bounds.getCenter(new Vector3());
      const anchor = objects[0].worldToLocal(center.clone());
      const pivots = new Map(objects.map((object) => [object.name, object.parent!.worldToLocal(center.clone())]));
      const materials: ReturnType<typeof captureComponentMaterial>[] = [];
      objects.forEach((object) => object.traverse((child) => {
        if (!(child as Mesh).isMesh) return;
        const mesh = child as Mesh;
        const owned = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        owned.forEach((material) => materials.push(captureComponentMaterial(material)));
      }));
      return { chapter, objects, anchor, pivots, materials, point: new Vector3() };
    });
  }, [model]);
  const passiveDetailMaterials = useMemo(() => {
    const chapterNodes = new Set<string>(componentChapters.flatMap((chapter) => [...chapter.nodes]));
    const materials: ReturnType<typeof captureComponentMaterial>[] = [];
    explodePartNames.filter((name) => !chapterNodes.has(name)).forEach((name) => {
      model.getObjectByName(name)?.traverse((child) => {
        if (!(child as Mesh).isMesh) return;
        const mesh = child as Mesh;
        const owned = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        owned.forEach((material) => materials.push(captureComponentMaterial(material)));
      });
    });
    return materials;
  }, [model]);
  const ghostShellVisuals = useMemo(() => {
    const body = model.getObjectByName("BODY");
    const branding = model.getObjectByName("BRANDING");
    const visuals: Array<{ mesh: Mesh; visible: boolean }> = [];
    body?.traverse((child) => {
      if (!(child as Mesh).isMesh || branding?.getObjectById(child.id) || !ghostShellMeshes.has(child.name)) return;
      visuals.push({ mesh: child as Mesh, visible: child.visible });
    });
    return visuals;
  }, [model]);
  const bodyCasingMaterials = useMemo(() => {
    const materials = new Set<Material>();
    ghostShellVisuals.forEach(({ mesh }) => {
      const meshMaterial = mesh.material;
      const meshMaterials: Material[] = Array.isArray(meshMaterial) ? meshMaterial : [meshMaterial];
      meshMaterials.forEach((material) => materials.add(material));
    });
    return [...materials].map(captureComponentMaterial);
  }, [ghostShellVisuals]);
  const workingShellMaterials = useMemo(() => new Set(bodyCasingMaterials.map(({ material }) => material)), [bodyCasingMaterials]);
  const brandingVisuals = useMemo(() => {
    const visuals: Array<{
      mesh: Mesh;
      renderOrder: number;
      materials: Array<{ material: Material; opacity: number; transparent: boolean; depthTest: boolean; depthWrite: boolean }>;
    }> = [];
    model.getObjectByName("BRANDING")?.traverse((child) => {
      if (!(child as Mesh).isMesh) return;
      const mesh = child as Mesh;
      const meshMaterials: Material[] = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      visuals.push({
        mesh,
        renderOrder: mesh.renderOrder,
        materials: meshMaterials.map((material) => ({
          material,
          opacity: material.opacity,
          transparent: material.transparent,
          depthTest: material.depthTest,
          depthWrite: material.depthWrite,
        })),
      });
    });
    return visuals;
  }, [model]);
  const guidedCenter = useMemo(() => new Vector3(), []);
  const detailTurn = useMemo(() => new Quaternion(), []);
  const longAxis = useMemo(() => new Vector3(...landmarks.shaftAxis), [landmarks]);
  const pivotDelta = useMemo(() => new Vector3(), []);
  // Shares the centrally calibrated inlet with the camera and particle stream.
  const inletCalloutAnchor = useMemo(() => new Vector3(
    landmarks.inlet.x,
    MathUtils.lerp(landmarks.inlet.openingY, landmarks.inlet.emitterY, 0.62),
    landmarks.inlet.z,
  ), [landmarks]);
  const inletCalloutPoint = useMemo(() => new Vector3(), []);
  const sceneCameraVectors = useRef({
    target: new Vector3(),
    position: new Vector3(),
    overviewPosition: new Vector3(),
    inlet: new Vector3(),
    transferStart: new Vector3(),
    transferEnd: new Vector3(),
    discharge: new Vector3(),
  });

  useEffect(() => () => {
    explodeParts.forEach(({ object }) => { object.visible = true; });
    ghostShellVisuals.forEach(({ mesh, visible }) => { mesh.visible = visible; });
    [...detailComponents.flatMap(({ materials }) => materials), ...passiveDetailMaterials].forEach((snapshot) => {
      applyComponentVisibility(snapshot, 1);
      snapshot.material.dispose();
    });
  }, [detailComponents, explodeParts, ghostShellVisuals, passiveDetailMaterials]);

  const calloutElements = useRef<Array<{ label: HTMLElement; line: SVGLineElement; dot: SVGCircleElement; svg: SVGSVGElement }>>([]);
  const calloutMeasurements = useRef<Array<{ key: string; height: number }>>([]);
  const calloutSafeTop = useRef(24);

  const readyFrame = useRef<number | null>(null);
  useEffect(() => () => {
    if (readyFrame.current !== null && readyFrame.current >= 0) cancelAnimationFrame(readyFrame.current);
  }, []);

  useEffect(() => {
    const navbar = document.querySelector<HTMLElement>("[data-navbar]");
    const updateSafeTop = () => {
      calloutSafeTop.current = Math.max(24, (navbar?.offsetHeight ?? 0) + 18);
    };
    updateSafeTop();
    const observer = navbar && typeof ResizeObserver !== "undefined" ? new ResizeObserver(updateSafeTop) : null;
    if (navbar) observer?.observe(navbar);
    window.addEventListener("resize", updateSafeTop);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", updateSafeTop);
    };
  }, []);

  const canvasSize = useThree((state) => state.size);
  // Use the initial presentation camera for all model fitting. A resize during
  // a Scene 07 close-up must not shrink this scene or earlier scenes on reversal.
  const viewport = useMemo(() => {
    const height = 2 * PRESENTATION_DISTANCE * Math.tan(MathUtils.degToRad(PRESENTATION_FOV / 2));
    return { height, width: height * canvasSize.width / canvasSize.height };
  }, [canvasSize.width, canvasSize.height]);
  useFrame(({ camera, clock }, delta) => {
    const position = positionGroup.current;
    const scrollInertia = scrollInertiaGroup.current;
    const cinematic = cinematicGroup.current;
    const interaction = interactionGroup.current;
    const floating = floatGroup.current;
    const zoom = zoomGroup.current;
    const pan = panGroup.current;
    const guided = guidedGroup.current;
    const shadow = shadowGroup.current;
    if (!position || !scrollInertia || !cinematic || !interaction || !floating || !zoom || !pan || !guided || !shadow) return;
    if (readyFrame.current === null) {
      readyFrame.current = requestAnimationFrame(() => {
        readyFrame.current = -1;
        onReady(presentation.report);
        if (process.env.NODE_ENV === "development") {
          console.info("[ScrewConveyor3D] first frame ready", presentation.report);
        }
      });
    }

    const state = motion.current;
    const workingState = working.current;
    const controls = inspection.current;
    const runtime = interactionRuntime.current;
    const frameDelta = Math.min(delta, 0.05);
    const portrait = canvasSize.width < 768 && canvasSize.height > canvasSize.width;
    const explode = MathUtils.clamp(state.explode, 0, 1);
    explodeParts.forEach(({ object, origin, name }) => {
      // GLB long axis is Z; the presentation wrapper turns +Z toward screen-left.
      const mobile = canvasSize.width < 768 && canvasSize.height > canvasSize.width;
      const offset = explodeOffsets[name][mobile ? "mobile" : "desktop"];
      object.position.set(origin.x + offset[0] * explode, origin.y + offset[1] * explode, origin.z + offset[2] * explode);
    });

    const focusWeight = Math.min(1, componentChapters.reduce((sum, { id }) => sum + detail.current[id].weight, 0));
    // At a chapter hold, remove every unrelated GLB group from rendering entirely.
    // During entry, exit, and chapter crossfades, material opacity handles the transition.
    explodeParts.forEach(({ object, name }) => {
      const partWeight = componentChapters.reduce(
        (highest, chapter) => chapter.nodes.some((node: string) => node === name)
          ? Math.max(highest, detail.current[chapter.id].weight)
          : highest,
        0,
      );
      object.visible = focusWeight < 0.999 || partWeight > 0.001;
    });
    detailComponents.forEach(({ chapter, objects, pivots, materials }, index) => {
      const { weight, progress } = detail.current[chapter.id];
      objects.forEach((object) => {
        const baseline = explodeParts.find((part) => part.name === object.name)!;
        const axial = index < 2 || chapter.id === "shaft";
        const angle = (index < 2 ? Math.PI : MathUtils.degToRad(chapter.id === "shaft" ? 75 : 42)) * progress * weight;
        detailTurn.setFromAxisAngle(axial ? longAxis : worldYAxis, angle);
        object.quaternion.copy(baseline.quaternion).premultiply(detailTurn);
        const pivot = pivots.get(object.name)!;
        pivotDelta.copy(baseline.origin).sub(pivot).applyQuaternion(detailTurn).add(pivot).sub(baseline.origin);
        object.position.add(pivotDelta);
        object.position.x += weight * 0.12 - (focusWeight - weight) * 0.035;
      });
      materials.forEach((snapshot) => {
        // One material owner per scene; avoid toggling transparent twice on
        // every frame while the working cutaway is active.
        if (workingState.active > 0.001 && workingShellMaterials.has(snapshot.material)) return;
        applyComponentVisibility(snapshot, 1 - focusWeight + weight);
      });
    });
    passiveDetailMaterials.forEach((snapshot) => applyComponentVisibility(snapshot, 1 - focusWeight));
    ghostShellVisuals.forEach(({ mesh, visible }) => {
      mesh.visible = visible;
    });
    if (workingState.active > 0.001) {
      bodyCasingMaterials.forEach(({ material, opacity, transparent, depthWrite }) => {
        const cutawayOpacity = opacity * MathUtils.lerp(1, portrait ? 0.1 : 0.075, workingState.cutaway);
        material.opacity = cutawayOpacity;
        const transparentCutaway = workingState.cutaway > 0.001;
        if (material.transparent !== (transparent || transparentCutaway)) {
          material.transparent = transparent || transparentCutaway;
          material.needsUpdate = true;
        }
        material.depthWrite = transparentCutaway ? false : depthWrite;
      });
    }
    const prioritizeBranding = workingState.active > 0.001 && workingState.cutaway > 0.02;
    brandingVisuals.forEach(({ mesh, renderOrder, materials }) => {
      mesh.renderOrder = prioritizeBranding ? 20 : renderOrder;
      materials.forEach(({ material, opacity, transparent, depthTest, depthWrite }) => {
        const fading = material.opacity < opacity * 0.999;
        const nextTransparent = prioritizeBranding || fading || transparent;
        if (material.transparent !== nextTransparent) {
          material.transparent = nextTransparent;
          material.needsUpdate = true;
        }
        material.depthTest = prioritizeBranding ? false : depthTest;
        material.depthWrite = prioritizeBranding || fading ? false : depthWrite;
      });
    });

    const screwPart = explodeParts.find(({ name }) => name === "SCREW");
    const couplingPart = explodeParts.find(({ name }) => name === "COUPLING");
    const drivePart = explodeParts.find(({ name }) => name === "DRIVE_ASSEMBLY");
    if (screwPart && workingState.active > 0.001) {
      detailTurn.setFromAxisAngle(longAxis, workingState.screwRotation);
      screwPart.object.quaternion.copy(screwPart.quaternion).premultiply(detailTurn);
    }
    if (couplingPart && workingState.active > 0.001) {
      detailTurn.setFromAxisAngle(longAxis, workingState.couplingRotation);
      // The coupling's authored local axis differs from the screw's. Both
      // turn around the measured shaft axis in their common parent's space.
      couplingPart.object.quaternion.copy(couplingPart.quaternion).premultiply(detailTurn);
    }
    if (drivePart && workingState.drive > 0.001) {
      drivePart.object.position.x += Math.sin(workingState.drive * Math.PI * 18) * 0.0025 * workingState.drive;
    }

    if (controls.resetVersion !== runtime.lastResetVersion) {
      runtime.lastResetVersion = controls.resetVersion;
      runtime.targetQuaternion.identity();
      runtime.velocityYaw = 0;
      runtime.velocityPitch = 0;
      runtime.lastYawInput = controls.targetYaw;
      runtime.lastPitchInput = controls.targetPitch;
    }

    if (controls.enabled) {
      const yawInput = controls.targetYaw - runtime.lastYawInput;
      const pitchInput = controls.targetPitch - runtime.lastPitchInput;
      runtime.lastYawInput = controls.targetYaw;
      runtime.lastPitchInput = controls.targetPitch;
      deltaQuaternion.setFromAxisAngle(worldYAxis, yawInput);
      runtime.targetQuaternion.premultiply(deltaQuaternion);
      deltaQuaternion.setFromAxisAngle(localXAxis, pitchInput);
      runtime.targetQuaternion.multiply(deltaQuaternion);

      if (controls.dragging) {
        runtime.velocityYaw = controls.velocityYaw;
        runtime.velocityPitch = controls.velocityPitch;
      } else if (controls.keyHorizontal !== 0 || controls.keyVertical !== 0) {
        const keyYaw = controls.keyHorizontal * frameDelta * 0.62;
        const keyPitch = controls.keyVertical * frameDelta * 0.52;
        deltaQuaternion.setFromAxisAngle(worldYAxis, keyYaw);
        runtime.targetQuaternion.premultiply(deltaQuaternion);
        deltaQuaternion.setFromAxisAngle(localXAxis, keyPitch);
        runtime.targetQuaternion.multiply(deltaQuaternion);
        runtime.velocityYaw = controls.keyHorizontal * 0.2;
        runtime.velocityPitch = controls.keyVertical * 0.16;
      } else if (Math.abs(runtime.velocityYaw) > 0.0001 || Math.abs(runtime.velocityPitch) > 0.0001) {
        deltaQuaternion.setFromAxisAngle(worldYAxis, runtime.velocityYaw * frameDelta);
        runtime.targetQuaternion.premultiply(deltaQuaternion);
        deltaQuaternion.setFromAxisAngle(localXAxis, runtime.velocityPitch * frameDelta);
        runtime.targetQuaternion.multiply(deltaQuaternion);
        runtime.velocityYaw = MathUtils.damp(runtime.velocityYaw, 0, 7.5, frameDelta);
        runtime.velocityPitch = MathUtils.damp(runtime.velocityPitch, 0, 7.5, frameDelta);
      }
    } else {
      runtime.lastYawInput = controls.targetYaw;
      runtime.lastPitchInput = controls.targetPitch;
      runtime.targetQuaternion.slerp(runtime.neutralQuaternion, 1 - Math.exp(-7 * frameDelta));
      runtime.velocityYaw = 0;
      runtime.velocityPitch = 0;
    }

    // Fit the physical exploded bounds, including both bearing/shaft pairs.
    const explodedBounds = new Box3();
    if (portrait && explode > 0) {
      model.updateWorldMatrix(true, true);
      const inverse = new Matrix4().copy(model.matrixWorld).invert();
      const relative = new Matrix4();
      const box = new Box3();
      presentation.geometryBounds.forEach(({ object, bounds }) => {
        relative.multiplyMatrices(inverse, object.matrixWorld);
        explodedBounds.union(box.copy(bounds).applyMatrix4(relative));
      });
    } else {
      explodedBounds.setFromCenterAndSize(presentation.center, presentation.size);
    }
    const explodedSize = explodedBounds.getSize(new Vector3());
    const portraitWidth = state.width + state.portraitExplode * 0.19;
    const fittedLength = portrait ? Math.max(presentation.length, explodedSize.z) : presentation.length;
    const scale = viewport.width * (portrait ? Math.min(portraitWidth, 0.86 + (1 - state.portraitExplode) * 0.14) : state.width) / fittedLength;
    const mobileInspection = typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;
    zoom.scale.setScalar(MathUtils.damp(zoom.scale.x, mobileInspection ? MathUtils.clamp(controls.zoomTarget, 1, 3.2) : 1, 10, frameDelta));
    const panLimit = Math.max(0.08, (MathUtils.clamp(controls.zoomTarget, 1, 3.2) - 1) * viewport.width * 1.35);
    pan.position.x = MathUtils.damp(pan.position.x, mobileInspection ? MathUtils.clamp(controls.panTarget, -panLimit, panLimit) : 0, 9, frameDelta);
    // Mobile landing uses a shorter 1.5-second full cycle; desktop keeps 3 seconds.
    const mobileFloat = typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;
    const floatPeriod = mobileFloat ? 2 : 3;
    const float = Math.sin(clock.elapsedTime * (Math.PI * 2 / floatPeriod)) * viewport.height * 0.005 * state.floatStrength;
    const depthFloat = Math.cos(clock.elapsedTime * (Math.PI * 2 / 12)) * 0.018 * state.floatStrength;
    const explodedCenter = explodedBounds.getCenter(new Vector3());
    const fitOffsetX = portrait ? (explodedCenter.z - presentation.center.z) * scale * explode : 0;
    position.position.set(viewport.width * state.x + fitOffsetX, viewport.height * state.y, state.z);
    position.scale.setScalar(scale);
    runtime.scrollVelocity = MathUtils.damp(runtime.scrollVelocity, MathUtils.clamp(state.scrollVelocity, -1, 1), 10, frameDelta);
    const velocity = runtime.scrollVelocity * state.inertiaStrength;
    const inertiaY = MathUtils.damp(scrollInertia.position.y, -velocity * viewport.height * 0.012, 8, frameDelta);
    const inertiaZ = MathUtils.damp(scrollInertia.position.z, velocity * 0.035, 8, frameDelta);
    scrollInertia.position.set(0, inertiaY, inertiaZ);
    scrollInertia.rotation.x = MathUtils.damp(scrollInertia.rotation.x, velocity * MathUtils.degToRad(1.15), 8, frameDelta);
    scrollInertia.rotation.z = MathUtils.damp(scrollInertia.rotation.z, -velocity * MathUtils.degToRad(0.38), 8, frameDelta);
    cinematic.rotation.set(state.pitch, state.yaw + state.travelTurn, state.roll);
    interaction.quaternion.slerp(runtime.targetQuaternion, 1 - Math.exp(-12 * frameDelta));
    if (workingState.active > 0.001) {
      // Inspection and inertial transforms belong to the earlier scenes. A
      // direct scroll seek must not leave a decaying gesture in the camera path.
      interaction.quaternion.identity();
      pan.position.set(0, 0, 0);
      zoom.scale.setScalar(1);
      scrollInertia.position.set(0, 0, 0);
      scrollInertia.rotation.set(0, 0, 0);
    }
    floating.position.set(0, float, depthFloat);
    // A slower six-second-per-direction rotational drift keeps the machine feeling heavy.
    floating.rotation.z = Math.sin(clock.elapsedTime * (Math.PI * 2 / 12)) * 0.006 * state.floatStrength;
    shadow.scale.setScalar(Math.max(0.08, state.shadowStrength));
    shadow.visible = state.shadowStrength > 0.03;
    position.updateWorldMatrix(true, true);
    guidedCenter.set(0, 0, 0);
    let guidedScale = 1;
    detailComponents.forEach(({ chapter, objects, anchor, point }, index) => {
      const { weight, progress } = detail.current[chapter.id];
      if (weight === 0) return;
      guided.worldToLocal(objects[0].localToWorld(point.copy(anchor)));
      if (index < 2) point.x += (progress - 0.5) * presentation.length * (portrait ? 0.65 : 0.4);
      guidedCenter.addScaledVector(point, weight);
      const magnification = index < 2 ? (portrait ? 2.1 : 1.55)
        : index === 2 ? (portrait ? 5.2 : 2.8)
        : index === 3 ? (portrait ? 12 : 7)
        : chapter.id === "shaft" ? (portrait ? 11 : 7.5) : (portrait ? 12 : 8);
      guidedScale += (magnification - 1) * weight;
    });
    guided.scale.setScalar(guidedScale);
    guided.position.copy(guidedCenter).multiplyScalar(-guidedScale);
    guided.rotation.set(0, 0, 0);
    guided.position.y += focusWeight * viewport.height * (portrait ? 0.04 : 0.07) / scale;
    const sceneCamera = camera as PerspectiveCamera;
    sceneCamera.position.set(0, 0, state.cameraZ);
    sceneCamera.lookAt(0, 0, 0);

    if (workingState.active > 0.001 && modelRootGroup.current) {
      // Camera choreography is solved from the approved GLB's geometry. The
      // conveyor stays in its established scene transform while the camera
      // follows the material path in world space.
      modelRootGroup.current.updateWorldMatrix(true, false);
      const {
        target: sceneCameraTarget,
        position: sceneCameraPosition,
        overviewPosition: overviewCameraPosition,
        inlet: inletTarget,
        transferStart: transferStartTarget,
        transferEnd: transferEndTarget,
        discharge: dischargeTarget,
      } = sceneCameraVectors.current;
      const screwStartZ = Math.max(landmarks.inlet.z - presentation.length * 0.075, presentation.center.z);
      const screwEndZ = Math.min(landmarks.discharge.z + presentation.length * 0.095, presentation.center.z);
      modelRootGroup.current.localToWorld(inletTarget.set(
        landmarks.inlet.x,
        MathUtils.lerp(landmarks.inlet.openingY, landmarks.inlet.emitterY, 0.25),
        landmarks.inlet.z,
      ));
      modelRootGroup.current.localToWorld(transferStartTarget.set(
        landmarks.inlet.x,
        landmarks.bedY,
        screwStartZ,
      ));
      modelRootGroup.current.localToWorld(transferEndTarget.set(
        landmarks.discharge.x,
        landmarks.bedY,
        screwEndZ,
      ));
      modelRootGroup.current.localToWorld(dischargeTarget.set(
        landmarks.discharge.x,
        landmarks.discharge.y - presentation.size.y * 0.12,
        landmarks.discharge.z,
      ));

      const progress = MathUtils.clamp(workingState.progress, 0, 1);
      const intro = MathUtils.smootherstep(progress, 0.12, 0.25);
      const enterBed = MathUtils.smootherstep(progress, 0.24, 0.32);
      const transfer = MathUtils.smootherstep(progress, 0.32, 0.75);
      const discharge = MathUtils.smootherstep(progress, 0.75, 0.9);
      const returnToOverview = MathUtils.smootherstep(progress, 0.9, 1);

      // Blend both sides of every phase boundary, including the descent from
      // the feed opening into the bed. A reverse seek follows this same path.
      sceneCameraTarget.set(0, 0, 0).lerp(inletTarget, intro).lerp(transferStartTarget, enterBed);
      if (progress >= 0.32) sceneCameraTarget.copy(transferStartTarget).lerp(transferEndTarget, transfer);
      if (progress >= 0.75) sceneCameraTarget.lerp(dischargeTarget, discharge);
      sceneCameraTarget.multiplyScalar(1 - returnToOverview);

      const closeDistance = portrait ? MathUtils.lerp(1.35, 1.05, enterBed) : 2.92;
      const overviewDistance = Math.max(state.cameraZ, portrait ? 4.25 : 4.6);
      const cameraDistance = MathUtils.lerp(
        MathUtils.lerp(overviewDistance, closeDistance, intro),
        overviewDistance,
        returnToOverview,
      );
      const travelArc = Math.sin(transfer * Math.PI) * (portrait ? 0.035 : 0.1);
      sceneCameraPosition.copy(sceneCameraTarget);
      sceneCameraPosition.y += ((portrait ? 0.065 : 0.2) + travelArc) * intro * (1 - returnToOverview);
      sceneCameraPosition.z += cameraDistance;
      sceneCameraPosition.x += Math.sin(transfer * Math.PI) * (portrait ? 0.035 : 0.07);
      sceneCameraPosition.lerp(overviewCameraPosition.set(0, 0, overviewDistance), returnToOverview);
      sceneCamera.position.copy(sceneCameraPosition);
      sceneCamera.lookAt(sceneCameraTarget);
      sceneCamera.updateMatrixWorld();
    }

    if (materialCalloutRef.current && modelRootGroup.current) {
      modelRootGroup.current.updateWorldMatrix(true, false);
      modelRootGroup.current.localToWorld(inletCalloutPoint.copy(inletCalloutAnchor)).project(camera);
      const x = (inletCalloutPoint.x + 1) * canvasSize.width / 2;
      const y = (1 - inletCalloutPoint.y) * canvasSize.height / 2;
      materialCalloutRef.current.style.left = `${x}px`;
      materialCalloutRef.current.style.top = `${y}px`;
      materialCalloutRef.current.style.visibility = inletCalloutPoint.z > -1 && inletCalloutPoint.z < 1 ? "visible" : "hidden";
    }

    // Update after every owner has written its transform, so callouts never lag a frame.
    if (calloutsRef.current && !calloutElements.current.length) {
      calloutElements.current = Array.from(calloutsRef.current.querySelectorAll<HTMLElement>("[data-component-callout]")).map((element) => ({
        label: element.querySelector("span")!, line: element.querySelector("line")!,
        dot: element.querySelector("circle")!, svg: element.querySelector("svg")!,
      }));
    }
    if (explode > 0.01 && focusWeight < 0.01) {
      position.updateWorldMatrix(true, true);
      const { width, height } = canvasSize;
      const compact = width < 1024 || height < 620;
      const safeTop = Math.min(calloutSafeTop.current, height - 96);
      const safeBottom = compact ? 88 : 42;
      const occupied: Array<{ x: number; y: number; width: number; height: number }> = [];
      const compactNames = ["MOTOR & GEARBOX", "FLEXIBLE COUPLING", "INLET SHAFT", "INLET BEARING", "BODY / CASING", "SCREW & SHAFT", "OUTLET SHAFT", "OUTLET BEARING"];
      const partRects = calloutAnchors.map(({ object }) => {
        const bounds = new Box3().setFromObject(object);
        let left = Infinity, right = -Infinity, top = Infinity, bottom = -Infinity;
        for (const bx of [bounds.min.x, bounds.max.x]) for (const by of [bounds.min.y, bounds.max.y]) for (const bz of [bounds.min.z, bounds.max.z]) {
          const corner = new Vector3(bx, by, bz).project(camera);
          const px = (corner.x + 1) * width / 2, py = (1 - corner.y) * height / 2;
          left = Math.min(left, px); right = Math.max(right, px); top = Math.min(top, py); bottom = Math.max(bottom, py);
        }
        return { left, right, top, bottom };
      });
      // Place the small shaft/bearing labels first; resolve collisions locally on every screen size.
      [2, 3, 6, 7, 0, 1, 4, 5].forEach((index) => {
        const { object, local, point } = calloutAnchors[index];
        const elements = calloutElements.current[index];
        if (!elements) return;
        object.localToWorld(point.copy(local)).project(camera);
        const x = (point.x + 1) * width / 2;
        const y = (1 - point.y) * height / 2;
        const name = compact ? compactNames[index] : elements.label.dataset.desktopName!;
        const textWidth = name.length * (compact ? 6.2 : 7.8);
        const labelWidth = Math.min(compact ? 126 : 168, textWidth + 4);
        const measurementKey = `${width}:${name}:${labelWidth}`;
        if (calloutMeasurements.current[index]?.key !== measurementKey) {
          elements.label.textContent = name;
          elements.label.style.width = `${labelWidth}px`;
          // Measure wrapping only when text/viewport changes, never on every animation frame.
          calloutMeasurements.current[index] = { key: measurementKey, height: elements.label.offsetHeight };
        }
        const labelHeight = calloutMeasurements.current[index].height;
        const part = partRects[index];
        const preferAbove = [0, 2, 4, 6].includes(index);
        const inset = compact ? 14 : 24;
        let labelX = MathUtils.clamp(x - labelWidth / 2, inset, width - labelWidth - inset);
        let labelY = MathUtils.clamp(y - labelHeight - 12, safeTop, height - safeBottom - labelHeight);
        let bestScore = Infinity;
        const overlapArea = (cx: number, cy: number, left: number, top: number, right: number, bottom: number) =>
          Math.max(0, Math.min(cx + labelWidth, right) - Math.max(cx, left)) *
          Math.max(0, Math.min(cy + labelHeight, bottom) - Math.max(cy, top));
        for (const distance of [10, 28, 46, 64, 82, 100]) {
          for (const above of [preferAbove, !preferAbove]) {
            for (const shift of [0, -32, 32, -64, 64]) {
              const cx = MathUtils.clamp(x - labelWidth / 2 + shift, inset, width - labelWidth - inset);
              const cy = MathUtils.clamp(above ? part.top - distance - labelHeight : part.bottom + distance, safeTop, height - safeBottom - labelHeight);
              const labelOverlap = occupied.reduce((sum, box) => sum + overlapArea(cx, cy, box.x - 6, box.y - 6, box.x + box.width + 6, box.y + box.height + 6), 0);
              const partOverlap = partRects.reduce((sum, box) => sum + overlapArea(cx, cy, box.left - 4, box.top - 4, box.right + 4, box.bottom + 4), 0);
              const leaderLength = Math.hypot(x - MathUtils.clamp(x, cx, cx + labelWidth), y - MathUtils.clamp(y, cy, cy + labelHeight));
              const score = labelOverlap * 100 + partOverlap * 10 + leaderLength + (above === preferAbove ? 0 : 8);
              if (score < bestScore) { bestScore = score; labelX = cx; labelY = cy; }
            }
          }
        }
        occupied.push({ x: labelX, y: labelY, width: labelWidth, height: labelHeight });
        const displayName = compact ? compactNames[index] : elements.label.dataset.desktopName!;
        if (elements.label.textContent !== displayName) elements.label.textContent = displayName;
        elements.label.style.cssText = `left:${labelX}px;top:${labelY}px;width:${labelWidth}px`;
        elements.svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
        elements.line.setAttribute("x1", String(MathUtils.clamp(x, labelX, labelX + labelWidth)));
        elements.line.setAttribute("y1", String(MathUtils.clamp(y, labelY - 3, labelY + labelHeight + 3)));
        elements.line.setAttribute("x2", String(x)); elements.line.setAttribute("y2", String(y));
        elements.dot.setAttribute("cx", String(x)); elements.dot.setAttribute("cy", String(y));
        elements.svg.style.visibility = point.z < 1 && point.z > -1 && x >= 0 && x <= width && y >= 0 && y <= height ? "visible" : "hidden";
      });
    }

  });

  return (
    <group ref={positionGroup}>
      <group ref={scrollInertiaGroup}>
        <group ref={cinematicGroup}>
        <group ref={guidedGroup}>
        <group ref={panGroup}>
        <group ref={zoomGroup}>
        <group ref={interactionGroup}>
          <group ref={floatGroup}>
            <group rotation={[0, -Math.PI / 2, 0]}>
              <group ref={modelRootGroup} position={[-presentation.center.x, -presentation.center.y, -presentation.center.z]}>
                <primitive object={model} />
                <SaltMaterialFlow working={working} landmarks={landmarks} />
              </group>
            </group>
          </group>
        </group>
        </group>
        </group>
        </group>
      </group>
      </group>
      <group ref={shadowGroup}>
        {!mobileRendering ? (
          <ContactShadows
            position={[0, -presentation.size.y / 2 - 0.018, 0]}
            scale={presentation.length * 1.08}
            opacity={0.13}
            blur={2.8}
            far={0.8}
            resolution={256}
            frames={1}
          />
        ) : null}
      </group>
    </group>
  );
}

export default function ScrewConveyorCanvas({ motion, inspection, onReady, calloutsRef, materialCalloutRef, detail, working }: MachineModelProps) {
  const mobileRendering = useMobileRenderingProfile();
  return (
    <Canvas
      className="screw-conveyor-canvas"
      dpr={mobileRendering ? 1 : [1, 1.5]}
      camera={{ position: [0, 0, PRESENTATION_DISTANCE], fov: PRESENTATION_FOV, near: 0.1, far: 100 }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      shadows={false}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
    >
      <ambientLight intensity={0.72} />
      <directionalLight position={[4, 6, 7]} intensity={2.1} />
      <directionalLight position={[-5, 1, 4]} intensity={0.8} />
      <Environment resolution={mobileRendering ? 32 : 64}>
        <Lightformer form="rect" intensity={2.2} position={[0, 5, 5]} scale={[8, 3, 1]} />
        <Lightformer form="rect" intensity={1.2} position={[-5, 1, 2]} rotation={[0, Math.PI / 2, 0]} scale={[4, 5, 1]} />
        {!mobileRendering ? <Lightformer form="ring" intensity={0.7} position={[4, -1, -4]} scale={3} /> : null}
      </Environment>
      <Suspense fallback={null}>
        <MachineModel motion={motion} inspection={inspection} onReady={onReady} calloutsRef={calloutsRef} materialCalloutRef={materialCalloutRef} detail={detail} working={working} mobileRendering={mobileRendering} />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload(screwConveyorModelUrl);
