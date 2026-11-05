"use client";

import Image, { type ImageProps } from "next/image";
import { useLocaleTranslation } from "./LocaleRuntime";

export default function LocalizedImage({ alt, ...props }: ImageProps) {
  const { translate } = useLocaleTranslation();
  return <Image {...props} alt={translate(alt)} />;
}
