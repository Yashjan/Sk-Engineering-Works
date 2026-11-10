// Long copy for the Complete Salt Refinery Plants page, resolved on the server for one language.
// Text may hold inline links written as [[/path|label]]; see RichCopy.
export type PlantCopy = {
  hero: { eyebrow: string; support: string };
  process: { support: string; stages: Record<string, string> };
  execution: { heading: string; support: string; stages: Record<string, string> };
  configuration: { support: string; statement: string; factors: Record<string, string> };
  enquiry: { support: string };
  service: { name: string; serviceType: string };
};
