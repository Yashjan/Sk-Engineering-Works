"use client";

import { Suspense, useEffect, useMemo, useRef, type MutableRefObject, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, useGLTF } from "@react-three/drei";
import { Box3, Matrix4, Group, Material, MathUtils, Mesh, PerspectiveCamera, Quaternion, Vector3 } from "three";
import { componentChapters, type ComponentDetail } from "./component-inspection";
import { assetPath } from "@/lib/asset-path";

const modelUrl = assetPath("/models/screw-conveyor/SK_Screw_Conveyor_Web_Final_Branding_Approved.glb");
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
  detail: MutableRefObject<ComponentDetail>;
};

function MachineModel({ motion, inspection, onReady, calloutsRef, detail }: MachineModelProps) {
  const positionGroup = useRef<Group>(null);
  const scrollInertiaGroup = useRef<Group>(null);
  const cinematicGroup = useRef<Group>(null);
  const interactionGroup = useRef<Group>(null);
  const floatGroup = useRef<Group>(null);
  const zoomGroup = useRef<Group>(null);
  const panGroup = useRef<Group>(null);
  const guidedGroup = useRef<Group>(null);
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
  const { scene } = useGLTF(modelUrl);
  const model = useMemo(() => scene.clone(true), [scene]);
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
  const explodeParts = useMemo(() => {
    const names = [ "DRIVE_ASSEMBLY", "COUPLING", "BODY", "SCREW", "BEARING_SHAFT_INLET", "BEARING_BLOCK_INLET", "BEARING_SHAFT_OUTLET", "BEARING_BLOCK_OUTLET"];
    return names.map((name) => {
      const object = model.getObjectByName(name);
      return object ? { object, origin: object.position.clone(), quaternion: object.quaternion.clone(), scale: object.scale.clone(), name } : null;
    }).filter(Boolean) as Array<{ object: Group; origin: Vector3; quaternion: Quaternion; scale: Vector3; name: string }>;
  }, [model]);

  const calloutAnchors = useMemo(() => {
    const names = ["DRIVE_ASSEMBLY", "COUPLING", "BEARING_BLOCK_INLET", "BODY", "SCREW", "BEARING_BLOCK_OUTLET"];
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
      const materials: Array<{ material: Material; opacity: number; transparent: boolean; depthWrite: boolean }> = [];
      objects.forEach((object) => object.traverse((child) => {
        if (!(child as Mesh).isMesh) return;
        const mesh = child as Mesh;
        const clone = (original: Material) => {
          const material = original.clone();
          materials.push({ material, opacity: original.opacity, transparent: original.transparent, depthWrite: original.depthWrite });
          return material;
        };
        mesh.material = Array.isArray(mesh.material) ? mesh.material.map(clone) : clone(mesh.material);
      }));
      return { chapter, objects, anchor, pivots, materials, point: new Vector3() };
    });
  }, [model]);
  const guidedCenter = useMemo(() => new Vector3(), []);
  const detailTurn = useMemo(() => new Quaternion(), []);
  const longAxis = useMemo(() => new Vector3(0, 0, 1), []);
  const pivotDelta = useMemo(() => new Vector3(), []);

  const calloutElements = useRef<Array<{ label: HTMLElement; line: SVGLineElement; dot: SVGCircleElement; svg: SVGSVGElement }>>([]);

  useEffect(() => {
    onReady(presentation.report);
    if (process.env.NODE_ENV === "development") {
      console.info("[ScrewConveyor3D] model ready", presentation.report);
    }
  }, [onReady, presentation]);

  const viewport = useThree((state) => state.viewport);
  const canvasSize = useThree((state) => state.size);
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

    const state = motion.current;
    const controls = inspection.current;
    const runtime = interactionRuntime.current;
    const frameDelta = Math.min(delta, 0.05);
    const explode = MathUtils.clamp(state.explode, 0, 1);
    explodeParts.forEach(({ object, origin, name }) => {
      // GLB long axis is Z; the presentation wrapper turns +Z toward screen-left.
      const mobile = canvasSize.width < 768 && canvasSize.height > canvasSize.width;
      const offset = name === "BODY" ? [0, mobile ? 0.25 : 0.32, 0]
        : name === "SCREW" ? [0.05, mobile ? -0.25 : -0.32, 0]
        : name === "DRIVE_ASSEMBLY" ? [0.02, -0.08, mobile ? 0.18 : 0.27]
        : name === "COUPLING" ? [0.02, -0.08, 0.12]
        : name.includes("INLET") ? [0.02, mobile ? -0.29 : -0.25, mobile ? 0.26 : 0.34] : [0.02, mobile ? -0.29 : -0.25, mobile ? -0.26 : -0.34];
      object.position.set(origin.x + offset[0] * explode, origin.y + offset[1] * explode, origin.z + offset[2] * explode);
    });

    const focusWeight = Math.min(1, componentChapters.reduce((sum, { id }) => sum + detail.current[id].weight, 0));
    detailComponents.forEach(({ chapter, objects, pivots, materials }, index) => {
      const { weight, progress } = detail.current[chapter.id];
      objects.forEach((object) => {
        const baseline = explodeParts.find((part) => part.name === object.name)!;
        const angle = (index < 2 ? Math.PI : MathUtils.degToRad(42)) * progress * weight;
        detailTurn.setFromAxisAngle(index < 2 ? longAxis : worldYAxis, angle);
        object.quaternion.copy(baseline.quaternion).premultiply(detailTurn);
        const pivot = pivots.get(object.name)!;
        pivotDelta.copy(baseline.origin).sub(pivot).applyQuaternion(detailTurn).add(pivot).sub(baseline.origin);
        object.position.add(pivotDelta);
        object.position.x += weight * 0.12 - (focusWeight - weight) * 0.035;
      });
      materials.forEach(({ material, opacity, transparent, depthWrite }) => {
        // Only the described component remains visible at each chapter hold.
        // Weight crossfades preserve smooth forward/reverse transitions.
        const emphasis = MathUtils.clamp(1 - focusWeight + weight, 0, 1);
        material.opacity = opacity * emphasis;
        const fading = emphasis < 0.999;
        if (material.transparent !== (transparent || fading)) {
          material.transparent = transparent || fading;
          material.needsUpdate = true;
        }
        material.depthWrite = fading ? false : depthWrite;
      });
    });

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

    const portrait = canvasSize.width < 768 && canvasSize.height > canvasSize.width;
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
    floating.position.set(0, float, depthFloat);
    // A slower six-second-per-direction rotational drift keeps the machine feeling heavy.
    floating.rotation.z = Math.sin(clock.elapsedTime * (Math.PI * 2 / 12)) * 0.006 * state.floatStrength;
    shadow.scale.setScalar(Math.max(0.08, state.shadowStrength));
    shadow.visible = state.shadowStrength > 0.03;
    (camera as PerspectiveCamera).position.z = state.cameraZ;
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
        : index === 3 ? (portrait ? 12 : 7) : (portrait ? 8.5 : 5.5);
      guidedScale += (magnification - 1) * weight;
    });
    guided.scale.setScalar(guidedScale);
    guided.position.copy(guidedCenter).multiplyScalar(-guidedScale);
    guided.position.y += focusWeight * viewport.height * (portrait ? 0.04 : 0.07) / scale;

    // Update after every owner has written its transform, so callouts never lag a frame.
    if (calloutsRef.current && !calloutElements.current.length) {
      calloutElements.current = Array.from(calloutsRef.current.querySelectorAll<HTMLElement>("[data-component-callout]")).map((element) => ({
        label: element.querySelector("span")!, line: element.querySelector("line")!,
        dot: element.querySelector("circle")!, svg: element.querySelector("svg")!,
      }));
    }
    if (explode > 0.01) {
      position.updateWorldMatrix(true, true);
      const { width, height } = canvasSize;
      const mobile = width < 768 && height > width;
      const compact = width < 768;
      const occupied: Array<{ x: number; y: number; width: number; height: number }> = [];
      const mobileNames = ["MOTOR & GEARBOX", "COUPLING", "INLET BEARING", "BODY / CASING", "SCREW & SHAFT", "OUTLET BEARING"];
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
      calloutAnchors.forEach(({ object, local, point }, index) => {
        const elements = calloutElements.current[index];
        if (!elements) return;
        object.localToWorld(point.copy(local)).project(camera);
        const x = (point.x + 1) * width / 2;
        const y = (1 - point.y) * height / 2;
        const labelWidth = mobile ? Math.min(126, mobileNames[index].length * 5.8 + 2) : 210;
        const lanes = [0.28, 0.16, 0.76, 0.12, 0.86, 0.68];
        const leftSide = [0, 1, 2].includes(index);
        let labelX = MathUtils.clamp(x + (leftSide ? -labelWidth - 32 : 32), 24, width - labelWidth - 24);
        let labelY = height * lanes[index];
        if (mobile) {
          // Nearby component zones, then local collision resolution instead of distant viewport rows.
          const part = partRects[index];
          const preferAbove = index === 0 || index === 3;
          labelX = MathUtils.clamp(x - labelWidth / 2, 14, width - labelWidth - 14);
          labelY = preferAbove ? part.top - 30 : part.bottom + 18;
          const collides = (cx: number, cy: number) =>
            partRects.some((box) => cx < box.right + 6 && cx + labelWidth > box.left - 6 && cy < box.bottom + 6 && cy + 24 > box.top - 6) ||
            occupied.some((box) => cx < box.x + box.width + 8 && cx + labelWidth + 8 > box.x && cy < box.y + box.height + 8 && cy + 24 + 8 > box.y);
          let found = false;
          for (const distance of [18, 42, 66, 90, 114, 138]) {
            if (found) break;
            for (const above of [preferAbove, !preferAbove]) {
              if (found) break;
              for (const shift of [0, -48, 48, -96, 96]) {
                const cx = MathUtils.clamp(x - labelWidth / 2 + shift, 14, width - labelWidth - 14);
                const cy = MathUtils.clamp(above ? part.top - distance - 24 : part.bottom + distance, 104, height - 118);
                if (!collides(cx, cy)) { labelX = cx; labelY = cy; found = true; break; }
              }
            }
          }
          occupied.push({ x: labelX, y: labelY, width: labelWidth, height: 24 });
        }
        const displayName = compact ? mobileNames[index] : elements.label.dataset.desktopName!;
        if (elements.label.textContent !== displayName) elements.label.textContent = displayName;
        elements.label.style.cssText = `left:${labelX}px;top:${labelY}px;width:${labelWidth}px`;
        elements.svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
        elements.line.setAttribute("x1", String(mobile ? MathUtils.clamp(x, labelX, labelX + labelWidth) : labelX + (leftSide ? labelWidth : 0)));
        elements.line.setAttribute("y1", String(mobile ? (labelY > y ? labelY - 3 : labelY + 17) : labelY + 12));
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
              <primitive object={model} position={[-presentation.center.x, -presentation.center.y, -presentation.center.z]} />
            </group>
          </group>
        </group>
        </group>
        </group>
        </group>
      </group>
      </group>
      <group ref={shadowGroup}>
        <ContactShadows
          position={[0, -presentation.size.y / 2 - 0.018, 0]}
          scale={presentation.length * 1.08}
          opacity={0.13}
          blur={2.8}
          far={0.8}
          resolution={256}
          frames={1}
        />
      </group>
    </group>
  );
}

export default function ScrewConveyorCanvas({ motion, inspection, onReady, calloutsRef, detail }: MachineModelProps) {
  return (
    <Canvas
      className="screw-conveyor-canvas"
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 6], fov: 32, near: 0.1, far: 100 }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      shadows={false}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
    >
      <ambientLight intensity={0.72} />
      <directionalLight position={[4, 6, 7]} intensity={2.1} />
      <directionalLight position={[-5, 1, 4]} intensity={0.8} />
      <Environment resolution={64}>
        <Lightformer form="rect" intensity={2.2} position={[0, 5, 5]} scale={[8, 3, 1]} />
        <Lightformer form="rect" intensity={1.2} position={[-5, 1, 2]} rotation={[0, Math.PI / 2, 0]} scale={[4, 5, 1]} />
        <Lightformer form="ring" intensity={0.7} position={[4, -1, -4]} scale={3} />
      </Environment>
      <Suspense fallback={null}>
        <MachineModel motion={motion} inspection={inspection} onReady={onReady} calloutsRef={calloutsRef} detail={detail} />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload(modelUrl);
