"use client";
/** @jsxImportSource @/i18n/react */

import { useEffect, useImperativeHandle, useRef, useState, type ComponentPropsWithRef } from "react";

type ProgressiveVideoProps = ComponentPropsWithRef<"video"> & {
  /**
   * Below-the-fold films: render with `preload="none"` and no poster until the video is
   * within ~800px of the viewport, so their poster and metadata requests stay out of the
   * initial load. `src` is always present, so a `play()` call that arrives first (anchor
   * jump, restored scroll position) still starts playback; the browser simply begins
   * loading at that moment.
   */
  deferUntilNear?: boolean;
};

/** Keeps the loading treatment in sync with the browser's actual video state. */
export default function ProgressiveVideo({
  className,
  onLoadStart,
  onLoadedData,
  onError,
  deferUntilNear = false,
  poster,
  preload,
  ref,
  ...props
}: ProgressiveVideoProps) {
  const [loading, setLoading] = useState(true);
  const element = useRef<HTMLVideoElement>(null);
  const near = useRef(false);
  useImperativeHandle(ref, () => element.current as HTMLVideoElement);

  useEffect(() => {
    const video = element.current;
    if (!deferUntilNear || !video) return;
    const apply = () => {
      if (poster && video.getAttribute("poster") !== poster) video.setAttribute("poster", poster);
      if (preload && video.getAttribute("preload") !== preload) video.setAttribute("preload", preload);
    };
    if (near.current) { apply(); return; }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      near.current = true;
      apply();
      observer.disconnect();
    }, { rootMargin: "800px 0px" });
    observer.observe(video);
    return () => observer.disconnect();
  }, [deferUntilNear, poster, preload]);

  return (
    <video
      {...props}
      ref={element}
      poster={deferUntilNear ? undefined : poster}
      preload={deferUntilNear ? "none" : preload}
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
