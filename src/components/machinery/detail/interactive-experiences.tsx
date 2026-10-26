import type { ReactNode } from "react";
// Full-page adapters preserve established cinematics. New visual-only adapters
// replace the Coming Soon slot while retaining every shared commercial section.
export const interactiveExperiences: Record<string, {
  layout: "full-page" | "visual";
  render: () => Promise<ReactNode>;
}> = {
  "screw-conveyor": {
    layout: "full-page",
    render: async () => {
      const [{ default: Experience }, { default: Closing }] = await Promise.all([
        import("../screw-conveyor/ScrewConveyorExperience"), import("../screw-conveyor/ScrewConveyorClosing"),
      ]);
      return <><Experience /><Closing /></>;
    },
  },
};
