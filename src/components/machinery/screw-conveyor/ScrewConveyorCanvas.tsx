"use client";

import { Suspense, useEffect, useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, useGLTF } from "@react-three/drei";
import { Box3, Group, Material, MathUtils, Mesh, PerspectiveCamera, Quaternion, Vector3 } from "three";
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
  yaw: number;
  pitch: number;
  roll: number;
  cameraZ: number;
  floatStrength: number;
  shadowStrength: number;
  scrollVelocity: number;
  inertiaStrength: number;
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
};

function MachineModel({ motion, inspection, onReady }: MachineModelProps) {
  const positionGroup = useRef<Group>(null);
  const scrollInertiaGroup = useRef<Group>(null);
  const cinematicGroup = useRef<Group>(null);
  const interactionGroup = useRef<Group>(null);
  const floatGroup = useRef<Group>(null);
  const zoomGroup = useRef<Group>(null);
  const panGroup = useRef<Group>(null);
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
    const scrollInertia = scrollInertiaGroup.current;
    const cinematic = cinematicGroup.current;
    const interaction = interactionGroup.current;
    const floating = floatGroup.current;
    const zoom = zoomGroup.current;
    const pan = panGroup.current;
    const shadow = shadowGroup.current;
    if (!position || !scrollInertia || !cinematic || !interaction || !floating || !zoom || !pan || !shadow) return;

    const state = motion.current;
    const controls = inspection.current;
    const runtime = interactionRuntime.current;
    const frameDelta = Math.min(delta, 0.05);

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

    const scale = viewport.width * state.width / presentation.length;
    zoom.scale.setScalar(MathUtils.damp(zoom.scale.x, MathUtils.clamp(controls.zoomTarget, 1, 3.2), 10, frameDelta));
    const panLimit = Math.max(0.08, (MathUtils.clamp(controls.zoomTarget, 1, 3.2) - 1) * viewport.width * 1.35);
    pan.position.x = MathUtils.damp(pan.position.x, MathUtils.clamp(controls.panTarget, -panLimit, panLimit), 9, frameDelta);
    // Sine-based drift with a three-second full cycle.
    const float = Math.sin(clock.elapsedTime * (Math.PI * 2 / 3)) * viewport.height * 0.005 * state.floatStrength;
    const depthFloat = Math.cos(clock.elapsedTime * (Math.PI * 2 / 12)) * 0.018 * state.floatStrength;
    position.position.set(viewport.width * state.x, viewport.height * state.y, state.z);
    position.scale.setScalar(scale);
    runtime.scrollVelocity = MathUtils.damp(runtime.scrollVelocity, MathUtils.clamp(state.scrollVelocity, -1, 1), 10, frameDelta);
    const velocity = runtime.scrollVelocity * state.inertiaStrength;
    const inertiaY = MathUtils.damp(scrollInertia.position.y, -velocity * viewport.height * 0.012, 8, frameDelta);
    const inertiaZ = MathUtils.damp(scrollInertia.position.z, velocity * 0.035, 8, frameDelta);
    scrollInertia.position.set(0, inertiaY, inertiaZ);
    scrollInertia.rotation.x = MathUtils.damp(scrollInertia.rotation.x, velocity * MathUtils.degToRad(1.15), 8, frameDelta);
    scrollInertia.rotation.z = MathUtils.damp(scrollInertia.rotation.z, -velocity * MathUtils.degToRad(0.38), 8, frameDelta);
    cinematic.rotation.set(state.pitch, state.yaw, state.roll);
    interaction.quaternion.slerp(runtime.targetQuaternion, 1 - Math.exp(-12 * frameDelta));
    floating.position.set(0, float, depthFloat);
    // A slower six-second-per-direction rotational drift keeps the machine feeling heavy.
    floating.rotation.z = Math.sin(clock.elapsedTime * (Math.PI * 2 / 12)) * 0.006 * state.floatStrength;
    shadow.scale.setScalar(Math.max(0.08, state.shadowStrength));
    shadow.visible = state.shadowStrength > 0.03;
    (camera as PerspectiveCamera).position.z = state.cameraZ;
  });

  return (
    <group ref={positionGroup}>
      <group ref={scrollInertiaGroup}>
        <group ref={cinematicGroup}>
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
