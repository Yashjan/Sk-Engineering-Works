"use client";

import { Suspense, useEffect, useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, useGLTF } from "@react-three/drei";
import { Box3, Group, Material, MathUtils, Mesh, PerspectiveCamera, Vector3 } from "three";
import { assetPath } from "@/lib/asset-path";

const modelUrl = assetPath("/models/screw-conveyor/SK_Screw_Conveyor_Web_Final.glb");
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
  yaw: number;
  pitch: number;
  roll: number;
  cameraZ: number;
  floatStrength: number;
  shadowStrength: number;
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
  keyDirection: -1 | 0 | 1;
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
};

function MachineModel({ motion, inspection, onReady }: MachineModelProps) {
  const positionGroup = useRef<Group>(null);
  const cinematicGroup = useRef<Group>(null);
  const interactionGroup = useRef<Group>(null);
  const floatGroup = useRef<Group>(null);
  const shadowGroup = useRef<Group>(null);
  const interactionRuntime = useRef({
    targetYaw: 0,
    targetPitch: 0,
    currentYaw: 0,
    currentPitch: 0,
    velocityYaw: 0,
    lastYawInput: 0,
    lastPitchInput: 0,
  });
  const { scene } = useGLTF(modelUrl);
  const model = useMemo(() => scene.clone(true), [scene]);
  const presentation = useMemo(() => {
    model.updateWorldMatrix(true, true);
    const bounds = new Box3().setFromObject(model);
    const size = bounds.getSize(new Vector3());
    const center = bounds.getCenter(new Vector3());
    let meshCount = 0;
    const materials = new Set<Material>();
    const groups = Object.fromEntries(verifiedGroups.map((name) => [name, Boolean(model.getObjectByName(name))])) as ModelReport["groups"];

    model.traverse((object) => {
      if (!(object as Mesh).isMesh) return;
      const mesh = object as Mesh;
      meshCount += 1;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      const meshMaterials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      meshMaterials.forEach((material) => materials.add(material));
    });

    return {
      center,
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

  useEffect(() => {
    onReady(presentation.report);
    if (process.env.NODE_ENV === "development") {
      console.info("[ScrewConveyor3D] model ready", presentation.report);
    }
  }, [onReady, presentation]);

  const viewport = useThree((state) => state.viewport);
  useFrame(({ camera, clock }, delta) => {
    const position = positionGroup.current;
    const cinematic = cinematicGroup.current;
    const interaction = interactionGroup.current;
    const floating = floatGroup.current;
    const shadow = shadowGroup.current;
    if (!position || !cinematic || !interaction || !floating || !shadow) return;

    const state = motion.current;
    const controls = inspection.current;
    const runtime = interactionRuntime.current;
    const frameDelta = Math.min(delta, 0.05);

    if (controls.enabled) {
      const yawInput = controls.targetYaw - runtime.lastYawInput;
      const pitchInput = controls.targetPitch - runtime.lastPitchInput;
      runtime.lastYawInput = controls.targetYaw;
      runtime.lastPitchInput = controls.targetPitch;
      runtime.targetYaw = MathUtils.clamp(
        runtime.targetYaw + yawInput,
        -MathUtils.degToRad(22),
        MathUtils.degToRad(22),
      );
      runtime.targetPitch = MathUtils.clamp(
        runtime.targetPitch + pitchInput,
        -MathUtils.degToRad(5),
        MathUtils.degToRad(7),
      );

      if (controls.dragging) {
        runtime.velocityYaw = controls.velocityYaw;
      } else if (controls.keyDirection !== 0) {
        runtime.targetYaw = MathUtils.clamp(
          runtime.targetYaw + controls.keyDirection * frameDelta * 0.62,
          -MathUtils.degToRad(22),
          MathUtils.degToRad(22),
        );
        runtime.velocityYaw = controls.keyDirection * 0.2;
      } else if (Math.abs(runtime.velocityYaw) > 0.0001) {
        runtime.targetYaw = MathUtils.clamp(
          runtime.targetYaw + runtime.velocityYaw * frameDelta,
          -MathUtils.degToRad(22),
          MathUtils.degToRad(22),
        );
        runtime.velocityYaw = MathUtils.damp(runtime.velocityYaw, 0, 7.5, frameDelta);
      }
    } else {
      runtime.lastYawInput = controls.targetYaw;
      runtime.lastPitchInput = controls.targetPitch;
      runtime.targetYaw = MathUtils.damp(runtime.targetYaw, 0, 7, frameDelta);
      runtime.targetPitch = MathUtils.damp(runtime.targetPitch, 0, 7, frameDelta);
      runtime.velocityYaw = 0;
    }

    runtime.currentYaw = MathUtils.damp(runtime.currentYaw, runtime.targetYaw, 11, frameDelta);
    runtime.currentPitch = MathUtils.damp(runtime.currentPitch, runtime.targetPitch, 11, frameDelta);

    const scale = viewport.width * state.width / presentation.length;
    const float = Math.sin(clock.elapsedTime * 0.72) * viewport.height * 0.005 * state.floatStrength;
    const depthFloat = Math.cos(clock.elapsedTime * 0.56) * 0.018 * state.floatStrength;
    position.position.set(viewport.width * state.x, viewport.height * state.y, state.z);
    position.scale.setScalar(scale);
    cinematic.rotation.set(state.pitch, state.yaw, state.roll);
    interaction.rotation.set(runtime.currentPitch, runtime.currentYaw, 0);
    floating.position.set(0, float, depthFloat);
    floating.rotation.z = Math.sin(clock.elapsedTime * 0.48) * 0.006 * state.floatStrength;
    shadow.scale.setScalar(Math.max(0.08, state.shadowStrength));
    shadow.visible = state.shadowStrength > 0.03;
    (camera as PerspectiveCamera).position.z = state.cameraZ;
  });

  return (
    <group ref={positionGroup}>
      <group ref={cinematicGroup}>
        <group ref={interactionGroup}>
          <group ref={floatGroup}>
            <group rotation={[0, -Math.PI / 2, 0]}>
              <primitive object={model} position={[-presentation.center.x, -presentation.center.y, -presentation.center.z]} />
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

export default function ScrewConveyorCanvas({ motion, inspection, onReady }: MachineModelProps) {
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
        <MachineModel motion={motion} inspection={inspection} onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload(modelUrl);
