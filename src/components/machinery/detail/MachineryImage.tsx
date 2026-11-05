"use client";
/** @jsxImportSource @/i18n/react */
import Image from "@/components/i18n/LocalizedImage";
import { useState } from "react";
import MachineryImagePlaceholder from "./MachineryImagePlaceholder";
export default function MachineryImage({ src, alt, machineName, priority, sizes }: {
  src: string; alt: string; machineName: string; priority: boolean; sizes: string;
}) {
  const [failed, setFailed] = useState(false);
  return failed ? <MachineryImagePlaceholder machineName={machineName} />
    : <Image src={src} alt={alt} fill preload={priority} sizes={sizes} onError={() => setFailed(true)} />;
}
