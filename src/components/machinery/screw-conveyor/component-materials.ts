import { Material, MathUtils } from "three";

export function captureComponentMaterial(material: Material) {
  return {
    material,
    opacity: material.opacity,
    transparent: material.transparent,
    depthWrite: material.depthWrite,
  };
}

export function applyComponentVisibility(snapshot: ReturnType<typeof captureComponentMaterial>, visibility: number) {
  const { material, opacity, transparent, depthWrite } = snapshot;
  const amount = MathUtils.clamp(visibility, 0, 1);
  // Scene 06 isolates the active chapter. GSAP weights still provide a reversible crossfade.
  material.opacity = opacity * amount;
  const fading = amount < 0.999;
  if (material.transparent !== (transparent || fading)) {
    material.transparent = transparent || fading;
    material.needsUpdate = true;
  }
  material.depthWrite = fading ? false : depthWrite;
}
