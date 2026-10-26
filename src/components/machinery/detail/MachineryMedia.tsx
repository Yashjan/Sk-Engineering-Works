import { existsSync, statSync } from "node:fs";
import path from "node:path";
import type { MachineMedia } from "@/data/machinery-details/types";
import { assetPath } from "@/lib/asset-path";
import MachineryImage from "./MachineryImage";
import MachineryImagePlaceholder from "./MachineryImagePlaceholder";

// Only serve explicitly configured, existing project media. Never substitute
// another machine, infer a filename, or fetch generated/stock imagery.
function existingPublicAsset(src: string) {
  if (!src.startsWith("/") || src.startsWith("//")) return false;
  const publicRoot = path.resolve(process.cwd(), "public");
  const file = path.resolve(publicRoot, `.${src}`);
  return file.startsWith(`${publicRoot}${path.sep}`) && existsSync(file) && statSync(file).isFile();
}
export default function MachineryMedia({ media, machineName = "Machine", priority = false, sizes }: {
  media?: MachineMedia; machineName?: string; priority?: boolean; sizes: string;
}) {
  if (!media || !existingPublicAsset(media.src)) return <MachineryImagePlaceholder machineName={machineName} />;
  return media.type === "image"
    ? <MachineryImage key={media.src} src={assetPath(media.src)} alt={media.alt} machineName={machineName} priority={priority} sizes={sizes} />
    : <video controls playsInline preload="none" poster={media.poster && existingPublicAsset(media.poster) ? assetPath(media.poster) : undefined} aria-label={media.alt}><source src={assetPath(media.src)} /></video>;
}
