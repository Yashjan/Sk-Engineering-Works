/** @jsxImportSource @/i18n/react */
import type { ReactNode } from "react";
import type { MachineryConfig } from "@/data/machinery-details";
// Full-page adapters preserve established cinematics. New visual-only adapters
// replace the Coming Soon slot while retaining every shared commercial section.
export const interactiveExperiences: Record<string, {
  layout: "full-page" | "visual";
  render: (machine: MachineryConfig) => Promise<ReactNode>;
}> = {
  "screw-conveyor": {
    layout: "full-page",
    render: async (machine) => {
      const [{ default: Experience }, { default: Closing }] = await Promise.all([
        import("../screw-conveyor/ScrewConveyorExperience"), import("../screw-conveyor/ScrewConveyorClosing"),
      ]);
      return <><Experience tagline={machine.tagline} /><Closing config={machine} /></>;
    },
  },
};
