export const componentChapters = [
  { id: "body", title: "BODY / CASING", copy: "Main fabricated housing that contains and supports the screw conveyor mechanism.", nodes: ["BODY"], duration: 1.9 },
  { id: "screw", title: "SCREW FLIGHT & SHAFT", copy: "The rotating internal element that carries material through the conveyor.", nodes: ["SCREW"], duration: 1.7 },
  { id: "drive", title: "MOTOR & GEARBOX", copy: "Provides the power and controlled rotation required to drive the screw.", nodes: ["DRIVE_ASSEMBLY"], duration: 1.25 },
  { id: "coupling", title: "FLEXIBLE COUPLING", copy: "Connects the drive assembly to the screw shaft and transfers rotation.", nodes: ["COUPLING"], duration: 1.1 },
  { id: "inlet", title: "INLET BEARING SUPPORT", copy: "Supports the shaft and maintains stable alignment during rotation.", nodes: ["BEARING_SHAFT_INLET", "BEARING_BLOCK_INLET"], duration: 1.1 },
  { id: "outlet", title: "OUTLET BEARING SUPPORT", copy: "Supports and aligns the shaft at the opposite end of the conveyor.", nodes: ["BEARING_SHAFT_OUTLET", "BEARING_BLOCK_OUTLET"], duration: 1.1 },
] as const;
export type ComponentDetail = Record<string, { weight: number; progress: number }>;
export function createComponentDetail(): ComponentDetail {
  return Object.fromEntries(componentChapters.map(({ id }) => [id, { weight: 0, progress: 0 }]));
}
// Preserve the scroll distance per timeline unit used by the existing chapters.
export const storyDuration = 16.8;
