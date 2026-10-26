import type { MetadataRoute } from "next";
import { machineryDetails } from "@/data/machinery-details";
import { absoluteUrl } from "@/config/site";

export const dynamic = "force-static";

const routes = [
  { path: "/", changeFrequency: "monthly", priority: 1 },
  { path: "/salt-refinery-plants", changeFrequency: "monthly", priority: 0.9 },
  { path: "/machinery", changeFrequency: "monthly", priority: 0.9 },
  { path: "/projects", changeFrequency: "monthly", priority: 0.9 },
  { path: "/engineering", changeFrequency: "monthly", priority: 0.8 },
  { path: "/about", changeFrequency: "yearly", priority: 0.7 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.7 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return [...routes.map(({ path, changeFrequency, priority }) => ({
    url: absoluteUrl(path),
    changeFrequency,
    priority,
  })), ...Object.keys(machineryDetails).map((slug) => ({ url: absoluteUrl(`/machinery/${slug}`), changeFrequency: "monthly" as const, priority: 0.8 }))];
}
