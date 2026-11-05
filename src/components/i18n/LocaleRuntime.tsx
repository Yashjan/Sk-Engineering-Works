"use client";
/** @jsxImportSource @/i18n/react */

import { useRouter } from "next/navigation";
import { type MouseEvent as ReactMouseEvent, type ReactNode, useContext, useMemo } from "react";
import { isAppHref, localizePathname, type Locale } from "@/i18n/config";
import { createTranslator } from "@/i18n/translate";
import ar from "@/i18n/dictionaries/ar.json";
import hi from "@/i18n/dictionaries/hi.json";
import { identity, LocaleContext } from "@/i18n/context";

export function useLocaleTranslation() { return useContext(LocaleContext); }

export default function LocaleRuntime({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  const router = useRouter();
  const translate = useMemo(() => locale === "hi" ? createTranslator(hi) : locale === "ar" ? createTranslator(ar) : identity, [locale]);

  const captureLocalizedNavigation = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = (event.target as Element).closest<HTMLAnchorElement>("a[href]");
    if (!anchor || anchor.dataset.localeSwitch === "true" || anchor.target === "_blank" || anchor.hasAttribute("download")) return;
    const rawHref = anchor.getAttribute("href");
    if (!rawHref || rawHref.startsWith("#") || /^(mailto:|tel:|https?:)/i.test(rawHref)) return;
    const url = new URL(anchor.href, window.location.href);
    if (url.origin !== window.location.origin) return;
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
    const appPath = basePath && url.pathname.startsWith(basePath) ? url.pathname.slice(basePath.length) || "/" : url.pathname;
    if (!isAppHref(appPath)) return;
    const destination = localizePathname(`${appPath}${url.search}${url.hash}`, locale);
    event.preventDefault();
    event.stopPropagation();
    router.push(destination);
  };

  return <LocaleContext.Provider value={{ locale, translate }}><div className="i18n-content" onClickCapture={captureLocalizedNavigation}>{children}</div></LocaleContext.Provider>;
}

