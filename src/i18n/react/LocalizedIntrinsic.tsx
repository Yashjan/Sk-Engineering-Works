"use client";

import { createElement, Fragment, type ElementType, type ReactNode } from "react";
import { useLocaleTranslation } from "@/components/i18n/LocaleRuntime";
import { isAppHref, localizePathname } from "@/i18n/config";

const translatedAttributes = ["aria-label", "aria-description", "title", "placeholder", "alt"] as const;

export default function LocalizedIntrinsic({ as: Tag, ...props }: { as: ElementType; [key: string]: unknown }) {
  const { locale, translate } = useLocaleTranslation();
  const localized: Record<string, unknown> = { ...props };
  if (typeof localized.children === "string") localized.children = translate(localized.children);
  else if (Array.isArray(localized.children)) localized.children = localized.children.map((child) => typeof child === "string" ? translate(child) : child);
  for (const attribute of translatedAttributes) {
    if (typeof localized[attribute] === "string") localized[attribute] = translate(localized[attribute] as string);
  }
  if (Tag === "a" && typeof localized.href === "string" && isAppHref(localized.href)) {
    localized.href = localizePathname(localized.href, locale);
  }
  return createElement(Tag, localized);
}

export function LocalizedFragment({ children }: { children: ReactNode }) {
  const { translate } = useLocaleTranslation();
  const localized = Array.isArray(children)
    ? children.map((child) => typeof child === "string" ? translate(child) : child)
    : typeof children === "string" ? translate(children) : children;
  return createElement(Fragment, null, localized);
}
