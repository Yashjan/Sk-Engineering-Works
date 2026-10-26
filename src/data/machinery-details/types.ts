export type MachineMedia = { src: string; alt: string; type: "image" | "video"; poster?: string; caption?: string };
export type MachineryConfig = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  seo: { title: string; description: string };
  // Use an existing, matching project-owned image. Missing media is intentional.
  hero?: MachineMedia & { type: "image" };
  identity: { title: string; copy: string };
  components: { title: string; description: string }[];
  howItWorks: { title: string; description: string }[];
  customization: { title: string; description: string }[];
  realMedia: MachineMedia[];
  process: { stageId: string; description: string; sectionNumber: string };
  engineering: { sectionNumber: string; description: string; capabilities: string[] };
  enquiry: {
    machineName: string;
    sectionNumber?: string;
    heading?: { firstLine: string; secondLine: string };
    description?: string;
  };
} & ({ has3D: true; interactiveExperience: string } | { has3D: false; interactiveExperience?: never });
