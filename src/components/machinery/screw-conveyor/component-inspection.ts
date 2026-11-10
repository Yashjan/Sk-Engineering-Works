export const componentChapters = [
  { id: "body", title: "BODY / CASING", copy: "The fabricated enclosure contains the material path and supports the screw assembly.", nodes: ["BODY"], duration: 1.9 },
  { id: "screw", title: "SCREW FLIGHT & SHAFT", copy: "Helical flights fixed to the rotating shaft advance material through the casing.", nodes: ["SCREW"], duration: 1.7 },
  { id: "drive", title: "MOTOR & GEARBOX", copy: "The drive supplies torque and controlled rotational speed for the conveying duty.", nodes: ["DRIVE_ASSEMBLY"], duration: 1.25 },
  { id: "coupling", title: "FLEXIBLE COUPLING", copy: "The coupling transfers rotation from the drive assembly to the conveyor shaft.", nodes: ["COUPLING"], duration: 1.1 },
  { id: "shaft", title: "INLET SHAFT", copy: "The drive-side shaft carries rotation into the screw assembly.", nodes: ["BEARING_SHAFT_INLET"], duration: 1.1 },
  { id: "bearing", title: "INLET BEARING", copy: "The bearing supports the rotating shaft at the inlet end and helps maintain alignment.", nodes: ["BEARING_BLOCK_INLET"], duration: 1.1 },
] as const;
export type ComponentDetail = Record<string, { weight: number; progress: number }>;
export function createComponentDetail(): ComponentDetail {
  return Object.fromEntries(componentChapters.map(({ id }) => [id, { weight: 0, progress: 0 }]));
}
export const inspectionStart = 8.3;
export const inspectionExitDuration = 0.55;
// Keep the existing scroll distance per unit, including a reversible return to the overview.
export const storyDuration = inspectionStart + componentChapters.reduce((sum, chapter) => sum + chapter.duration, 0) + inspectionExitDuration;
