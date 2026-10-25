"use client";

import Image, { type ImageProps } from "next/image";
import { useState, type SyntheticEvent } from "react";

/**
 * Project-wide image primitive. Images remain native Next.js images, so all
 * non-critical media is lazy loaded by the browser while priority/preload
 * images keep their eager behaviour.
 */
export default function ProgressiveImage({
  className,
  onLoad,
  onError,
  src,
  alt,
  loading,
  ...props
}: ImageProps) {
  const sourceKey = typeof src === "string" ? src : "src" in src ? src.src : src.default.src;
  const [loadedSource, setLoadedSource] = useState<string | null>(null);
  const loaded = loadedSource === sourceKey;

  const classes = ["progressive-image", loaded ? "is-media-loaded" : "is-media-loading", className]
    .filter(Boolean)
    .join(" ");

  return (
    <Image
      {...props}
      src={src}
      alt={alt}
      className={classes}
      loading={loading ?? (props.priority || props.preload || props.fetchPriority === "high" ? undefined : "lazy")}
      data-media-state={loaded ? "loaded" : "loading"}
      onLoad={(event: SyntheticEvent<HTMLImageElement>) => {
        setLoadedSource(sourceKey);
        onLoad?.(event);
      }}
      onError={(event: SyntheticEvent<HTMLImageElement>) => {
        setLoadedSource(sourceKey);
        onError?.(event);
      }}
    />
  );
}

