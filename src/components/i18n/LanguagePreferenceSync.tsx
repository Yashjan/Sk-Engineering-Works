"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { isLocale, localeFromPathname, localeHtml, localizePathname } from "@/i18n/config";

export default function LanguagePreferenceSync() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const currentLocale = localeFromPathname(pathname);
    const html = localeHtml[currentLocale];
    document.documentElement.lang = html.lang;
    document.documentElement.dir = html.dir;
    document.documentElement.dataset.locale = currentLocale;

    if (currentLocale !== "en") {
      window.localStorage.setItem("sk-language", currentLocale);
      return;
    }

    const preferred = window.localStorage.getItem("sk-language");
    if (preferred && isLocale(preferred) && preferred !== "en") {
      router.replace(localizePathname(pathname, preferred));
    }
  }, [pathname, router]);

  return null;
}

