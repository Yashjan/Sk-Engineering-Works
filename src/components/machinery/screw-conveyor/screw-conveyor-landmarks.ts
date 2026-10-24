import { Box3, MathUtils, Matrix4, Mesh, Object3D, Vector3 } from "three";

export type ScrewConveyorLandmarks = {
  inlet: { x: number; z: number; openingY: number; emitterY: number };
  discharge: { x: number; y: number; z: number };
  bedY: number;
  shaftAxis: readonly [number, number, number];
};

// Inlet center is inferred: this GLB has no named inlet/bore mesh. The other
// anchors below use measured shell, screw, and outlet-flange bounds directly.
const calibration = {
  inletAlongScrew: 0.943,
  feedHeightInBodyHeights: 0.66,
  bedAboveScrewBottom: 0.055,
} as const;

const boundsInModelSpace = (object: Object3D, model: Object3D) => {
  model.updateWorldMatrix(true, true);
  const inverseModel = new Matrix4().copy(model.matrixWorld).invert();
  const relative = new Matrix4();
  const bounds = new Box3();

  object.traverse((child) => {
    if (!(child as Mesh).isMesh) return;
    const mesh = child as Mesh;
    mesh.geometry.computeBoundingBox();
    if (!mesh.geometry.boundingBox) return;
    relative.multiplyMatrices(inverseModel, mesh.matrixWorld);
    bounds.union(mesh.geometry.boundingBox.clone().applyMatrix4(relative));
  });
  return bounds;
};

export function deriveScrewConveyorLandmarks(model: Object3D): ScrewConveyorLandmarks {
  const body = model.getObjectByName("BODY");
  const screw = model.getObjectByName("SCREW");
  const coupling = model.getObjectByName("COUPLING");
  const dischargePlate = model.getObjectByName("BODY_SECTION_07_00");
  if (!body || !screw || !coupling || !dischargePlate) {
    throw new Error("Approved screw conveyor GLB is missing BODY, SCREW, COUPLING, or BODY_SECTION_07_00.");
  }

  const bodyBounds = boundsInModelSpace(body, model);
  const screwBounds = boundsInModelSpace(screw, model);
  const couplingBounds = boundsInModelSpace(coupling, model);
  const dischargeBounds = boundsInModelSpace(dischargePlate, model);
  const bodySize = bodyBounds.getSize(new Vector3());
  const screwSize = screwBounds.getSize(new Vector3());
  const screwCenter = screwBounds.getCenter(new Vector3());
  const dischargeCenter = dischargeBounds.getCenter(new Vector3());
  const dimensions = [screwSize.x, screwSize.y, screwSize.z];
  const longestAxis = dimensions.indexOf(Math.max(...dimensions));
  if (longestAxis !== 2) throw new Error("Approved screw conveyor shaft is no longer aligned to local Z.");
  // The coupling is wider than it is long, so its largest bound is NOT its
  // rotation axis. Its measured center lies on the screw's Z axis. Rotate in
  // their shared parent space, preserving the coupling's authored quaternion.
  const couplingCenter = couplingBounds.getCenter(new Vector3());
  if (Math.hypot(couplingCenter.x - screwCenter.x, couplingCenter.y - screwCenter.y) > screwSize.x * 0.05) {
    throw new Error("Approved screw conveyor coupling is no longer centered on the shaft axis.");
  }

  // The GLB has no separately named inlet opening mesh. Its center is calibrated
  // from the measured screw span (94.3% toward the drive end) and the shell top.
  const inletZ = MathUtils.lerp(screwBounds.min.z, screwBounds.max.z, calibration.inletAlongScrew);

  return {
    inlet: {
      x: screwCenter.x,
      z: inletZ,
      openingY: bodyBounds.max.y,
      emitterY: bodyBounds.max.y + bodySize.y * calibration.feedHeightInBodyHeights,
    },
    // BODY_SECTION_07_00 is the actual underside discharge plate in the approved GLB.
    discharge: { x: dischargeCenter.x, y: dischargeBounds.min.y, z: dischargeCenter.z },
    bedY: screwBounds.min.y + screwSize.y * calibration.bedAboveScrewBottom,
    shaftAxis: [0, 0, 1],
  };
}
