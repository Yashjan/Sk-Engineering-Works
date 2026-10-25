"use client";

import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { BufferGeometry, Color, Float32BufferAttribute, InstancedMesh, MathUtils, Object3D } from "three";
import type { ScrewConveyorWorking } from "./ScrewConveyorCanvas";
import type { ScrewConveyorLandmarks } from "./screw-conveyor-landmarks";

const DESKTOP_PARTICLES = 280;
const MOBILE_PARTICLES = 100;

const random = (index: number, salt: number) => {
  const value = Math.sin(index * 91.713 + salt * 37.119) * 43758.5453;
  return value - Math.floor(value);
};

type GrainKind = "feed" | "bed" | "discharge";

type Grain = {
  kind: GrainKind;
  longitudinal: number;
  speed: number;
  radius: number;
  phase: number;
  scale: number;
  stretch: [number, number, number];
  rotation: [number, number, number];
  lifted: boolean;
};

const createCrystalGeometry = () => {
  const geometry = new BufferGeometry();
  const vertices = new Float32Array([
    0, 0.82, 0,  -0.66, 0.03, -0.42,  0.51, -0.04, -0.56,
    0, 0.82, 0,   0.51, -0.04, -0.56,  0.7, 0.02, 0.42,
    0, 0.82, 0,   0.7, 0.02, 0.42,  -0.48, -0.03, 0.62,
    0, 0.82, 0,  -0.48, -0.03, 0.62,  -0.66, 0.03, -0.42,
    0, -0.7, 0,   0.51, -0.04, -0.56,  -0.66, 0.03, -0.42,
    0, -0.7, 0,   0.7, 0.02, 0.42,   0.51, -0.04, -0.56,
    0, -0.7, 0,  -0.48, -0.03, 0.62,   0.7, 0.02, 0.42,
    0, -0.7, 0,  -0.66, 0.03, -0.42,  -0.48, -0.03, 0.62,
  ]);
  geometry.setAttribute("position", new Float32BufferAttribute(vertices, 3));
  geometry.computeVertexNormals();
  return geometry;
};

export default function SaltMaterialFlow({ working, landmarks }: {
  working: MutableRefObject<ScrewConveyorWorking>;
  landmarks: ScrewConveyorLandmarks;
}) {
  const mesh = useRef<InstancedMesh>(null);
  const size = useThree((state) => state.size);
  const mobile = size.width < 768;
  const count = mobile ? MOBILE_PARTICLES : DESKTOP_PARTICLES;
  const dummy = useMemo(() => new Object3D(), []);
  const crystalGeometry = useMemo(() => createCrystalGeometry(), []);
  const grains = useMemo<Grain[]>(() => Array.from({ length: count }, (_, index) => {
    const kindSeed = index % 10;
    const sizeSeed = random(index, 5);
    // Deliberate 60 / 30 / 10 size distribution.
    const scale = sizeSeed < 0.6
      ? MathUtils.lerp(0.56, 0.82, sizeSeed / 0.6)
      : sizeSeed < 0.9
        ? MathUtils.lerp(0.86, 1.12, (sizeSeed - 0.6) / 0.3)
        : MathUtils.lerp(1.18, 1.42, (sizeSeed - 0.9) / 0.1);
    const cluster = Math.floor(random(index, 12) * 12) / 12;
    return {
      kind: kindSeed < 2 ? "feed" : kindSeed < 9 ? "bed" : "discharge",
      longitudinal: MathUtils.clamp(cluster + (random(index, 13) - 0.5) * 0.055, 0, 1),
      speed: MathUtils.lerp(0.82, 1.12, random(index, 2)),
      radius: MathUtils.lerp(0.012, 0.068, random(index, 3)),
      phase: random(index, 4) * Math.PI * 2,
      scale,
      stretch: [
        MathUtils.lerp(0.68, 1.32, random(index, 6)),
        MathUtils.lerp(0.62, 1.24, random(index, 7)),
        MathUtils.lerp(0.7, 1.38, random(index, 8)),
      ],
      rotation: [random(index, 9) * Math.PI, random(index, 10) * Math.PI, random(index, 11) * Math.PI],
      lifted: random(index, 14) > 0.86,
    };
  }), [count]);

  useEffect(() => () => crystalGeometry.dispose(), [crystalGeometry]);
  useEffect(() => {
    const target = mesh.current;
    if (!target) return;
    const shades = ["#f5f1e8", "#e6e1d5", "#d6d2c8", "#eee9df"].map((shade) => new Color(shade));
    grains.forEach((_, index) => target.setColorAt(index, shades[Math.floor(random(index, 17) * shades.length)]));
    if (target.instanceColor) target.instanceColor.needsUpdate = true;
  }, [grains]);

  useFrame(() => {
    const target = mesh.current;
    if (!target) return;
    const state = working.current;
    const visible = state.active > 0.001 && state.saltVisibility > 0.001;
    target.visible = visible;
    if (!visible) return;
    target.count = count;
    const progress = MathUtils.clamp(state.saltProgress, 0, 1);
    const bedFront = MathUtils.smoothstep(progress, 0.08, 0.84);
    const dischargeProgress = MathUtils.smoothstep(progress, 0.82, 1);
    const cycle = progress + Math.max(0, state.progress - 0.9) * 1.8;
    const visibilityScale = MathUtils.clamp(state.saltVisibility * 1.5, 0, 1) * 0.015;

    for (let index = 0; index < count; index += 1) {
      const grain = grains[index];
      let x = 0;
      let y = 0;
      let z = 0;
      let grainVisible = true;

      if (grain.kind === "feed") {
        grainVisible = progress > 0.015;
        const fall = (cycle * 7.4 * grain.speed + grain.phase / (Math.PI * 2)) % 1;
        x = landmarks.inlet.x + Math.cos(grain.phase * 1.7) * grain.radius * 0.62;
        z = landmarks.inlet.z + Math.sin(grain.phase * 1.3) * grain.radius * 0.42;
        const feedBottom = MathUtils.lerp(landmarks.inlet.openingY, landmarks.bedY, state.cutaway);
        y = landmarks.inlet.emitterY - (landmarks.inlet.emitterY - feedBottom) * fall * fall;
      } else if (grain.kind === "bed") {
        const advance = (grain.longitudinal + cycle * 0.105 * grain.speed) % 1;
        grainVisible = advance <= bedFront + 0.025;
        const angle = grain.phase + state.screwRotation * 0.62 + advance * Math.PI * 13;
        const flightLift = Math.pow(Math.max(0, Math.sin(angle)), 4) * grain.radius * (grain.lifted ? 1.8 : 0.42);
        z = MathUtils.lerp(landmarks.inlet.z, landmarks.discharge.z, advance);
        x = landmarks.inlet.x + Math.cos(angle) * grain.radius;
        // More than 85% of grains stay below the shaft center as a heavy material bed.
        y = landmarks.bedY + grain.radius * (0.18 + random(index, 16) * 0.42) + flightLift;
        if (grain.lifted) y += Math.max(0, Math.sin(angle * 0.5)) * 0.035;
      } else {
        grainVisible = dischargeProgress > 0.001;
        const fall = ((dischargeProgress + Math.max(0, state.progress - 0.9) * 1.8) * 3.15 * grain.speed + grain.phase / (Math.PI * 2)) % 1;
        x = landmarks.discharge.x + Math.cos(grain.phase) * grain.radius * (0.65 + fall * 0.45);
        z = landmarks.discharge.z + Math.sin(grain.phase * 1.6) * grain.radius * 0.46;
        // Small initial velocity followed by gravity-like acceleration.
        y = landmarks.discharge.y - 0.035 * fall - 0.78 * fall * fall;
      }

      dummy.position.set(x, y, z);
      dummy.rotation.set(
        grain.rotation[0] + progress * grain.speed * 3.1,
        grain.rotation[1] + state.screwRotation * 0.18,
        grain.rotation[2] + progress * grain.speed * 4.3,
      );
      const scale = grainVisible ? grain.scale * visibilityScale : 0;
      dummy.scale.set(grain.stretch[0] * scale, grain.stretch[1] * scale, grain.stretch[2] * scale);
      dummy.updateMatrix();
      target.setMatrixAt(index, dummy.matrix);
    }
    target.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[crystalGeometry, undefined, count]} frustumCulled={false}>
      <meshStandardMaterial color="#ffffff" roughness={0.82} metalness={0} emissive="#6a675e" emissiveIntensity={0.08} />
    </instancedMesh>
  );
}
