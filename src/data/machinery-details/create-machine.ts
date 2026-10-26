import { processStages } from "@/data/process";
import type { MachineMedia, MachineryConfig } from "./types";
export type MachineContent = {
  slug: string; name: string; stageId?: string; image?: string;
  tagline: string; identity: string; description: string;
  components: readonly (readonly [string, string])[];
  steps: readonly (readonly [string, string])[];
  realMedia?: MachineMedia[];
  customization?: readonly (readonly [string, string])[];
};
// Shared editorial structure, with function/operation content supplied per machine.
export function createMachine(content: MachineContent): MachineryConfig {
  const stage = processStages.find((item) => item.id === content.stageId);
  const image = content.image ?? stage?.image;
  return {
    slug: content.slug, name: content.name, has3D: false,
    tagline: content.tagline, description: content.description,
    seo: { title: `${content.name} for Salt & Industrial Processing`, description: `${content.name} by S.K. Engineering Works. ${content.tagline} Discuss equipment configuration and integration with your process line.` },
    ...(image ? { hero: { type: "image" as const, src: image.startsWith("/") ? image : `/${image}`, alt: `S.K. Engineering Works ${content.name.toLowerCase()}` } } : {}),
    identity: { title: content.identity, copy: content.description },
    components: content.components.map(([title, description]) => ({ title, description })),
    howItWorks: content.steps.map(([title, description]) => ({ title, description })),
    customization: (content.customization ?? [
      ["MACHINE DIMENSIONS", "Planned around the equipment arrangement and available space."],
      ["PROCESS CAPACITY", `Discuss the required material flow and duty for the ${content.name.toLowerCase()}.`],
      ["MATERIAL OF CONSTRUCTION", "Selected according to the material and application."],
      ["FEED & DISCHARGE CONNECTIONS", "Arranged to connect with upstream and downstream equipment."],
      ["SUPPORT & INSTALLATION", "Planned around installation height, access and site conditions."],
      ["PLANT INTEGRATION", "Coordinated with the wider process line and equipment layout."],
    ]).map(([title, description]) => ({ title, description })),
    realMedia: content.realMedia ?? [],
    process: { stageId: content.stageId ?? content.slug, description: stage?.purpose ?? content.description, sectionNumber: "09" },
    engineering: { sectionNumber: "10", description: "Equipment is planned around the complete process, available space and site conditions.", capabilities: ["2D PLANT LAYOUTS", "EQUIPMENT ARRANGEMENT", "MACHINE INTEGRATION", "SITE-SPECIFIC PLANNING"] },
    enquiry: { machineName: content.name, heading: { firstLine: "DISCUSS YOUR", secondLine: `${content.name.toUpperCase()} REQUIREMENT` } },
  };
}
