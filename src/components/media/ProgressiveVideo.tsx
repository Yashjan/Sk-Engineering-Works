"use client";

import { useState, type ComponentPropsWithRef } from "react";

/** Keeps the loading treatment in sync with the browser's actual video state. */
export default function ProgressiveVideo({
  className,
  onLoadStart,
  onLoadedData,
  onError,
  ...props
}: ComponentPropsWithRef<"video">) {
  const [loading, setLoading] = useState(true);

  return (
    <video
      {...props}
      className={["progressive-video", loading ? "is-media-loading" : "is-media-loaded", className].filter(Boolean).join(" ")}
      onLoadStart={(event) => {
        setLoading(true);
        onLoadStart?.(event);
      }}
      onLoadedData={(event) => {
        setLoading(false);
        onLoadedData?.(event);
      }}
      onError={(event) => {
        setLoading(false);
        onError?.(event);
      }}
    />
  );
}
