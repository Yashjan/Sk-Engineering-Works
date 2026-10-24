export const componentChapters = [
  { id: "body", title: "BODY / CASING", copy: "Main fabricated housing that contains and supports the screw conveyor mechanism.", nodes: ["BODY"], duration: 1.9 },
  { id: "screw", title: "SCREW FLIGHT & SHAFT", copy: "The rotating internal element that carries material through the conveyor.", nodes: ["SCREW"], duration: 1.7 },
  { id: "drive", title: "MOTOR & GEARBOX", copy: "Provides the power and controlled rotation required to drive the screw.", nodes: ["DRIVE_ASSEMBLY"], duration: 1.25 },
  { id: "coupling", title: "FLEXIBLE COUPLING", copy: "Connects the drive assembly to the screw shaft and transfers rotation.", nodes: ["COUPLING"], duration: 1.1 },
  { id: "shaft", title: "INLET SHAFT", copy: "Transfers rotation from the drive side toward the conveyor screw assembly.", nodes: ["BEARING_SHAFT_INLET"], duration: 1.1 },
  { id: "bearing", title: "INLET BEARING", copy: "Supports the rotating shaft and helps maintain stable alignment.", nodes: ["BEARING_BLOCK_INLET"], duration: 1.1 },
] as const;
export type ComponentDetail = Record<string, { weight: number; progress: number }>;
export function createComponentDetail(): ComponentDetail {
  return Object.fromEntries(componentChapters.map(({ id }) => [id, { weight: 0, progress: 0 }]));
}
export const inspectionStart = 8.3;
export const inspectionExitDuration = 0.55;
// Keep the existing scroll distance per unit, including a reversible return to the overview.
export const storyDuration = inspectionStart + componentChapters.reduce((sum, chapter) => sum + chapter.duration, 0) + inspectionExitDuration;
