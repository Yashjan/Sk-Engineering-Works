const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function assetPath(source: string) {
  if (!source.startsWith("/") || source.startsWith("//")) return source;
  if (basePath && (source === basePath || source.startsWith(`${basePath}/`))) return source;
  return `${basePath}${source}`;
}
