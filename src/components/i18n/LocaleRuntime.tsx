"use client";

import { usePathname, useRouter } from "next/navigation";
import { type MouseEvent as ReactMouseEvent, type ReactNode, useLayoutEffect, useMemo, useRef } from "react";
import { localeHtml, localizePathname, type TranslatedLocale } from "@/i18n/config";

type Dictionary = Readonly<Record<string, string>>;

function preserveWhitespace(source: string, translated: string) {
  const leading = source.match(/^\s*/)?.[0] ?? "";
  const trailing = source.match(/\s*$/)?.[0] ?? "";
  return `${leading}${translated}${trailing}`;
}

function createTranslator(dictionary: Dictionary) {
  const entries = Object.entries(dictionary).sort(([a], [b]) => b.length - a.length);
  const lower = new Map(entries.map(([source, translated]) => [source.toLocaleLowerCase("en"), translated]));

  return (value: string) => {
    const normalized = value.replace(/\s+/g, " ").trim();
    if (!normalized) return value;
    const direct = dictionary[normalized] ?? lower.get(normalized.toLocaleLowerCase("en"));
    return direct ? preserveWhitespace(value, direct) : value;
  };
}

function translateElement(root: HTMLElement, translate: (value: string) => string) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode as Text);
  for (const node of textNodes) {
    const parent = node.parentElement;
    if (!parent || parent.closest("script, style, noscript, code, [data-no-translate]")) continue;
    const next = translate(node.data);
    if (next !== node.data) node.data = next;
  }

  for (const element of root.querySelectorAll<HTMLElement>("[aria-label], [title], [placeholder], [alt]")) {
    for (const attribute of ["aria-label", "title", "placeholder", "alt"] as const) {
      const value = element.getAttribute(attribute);
      if (!value) continue;
      const next = translate(value);
      if (next !== value) element.setAttribute(attribute, next);
    }
  }
}

export default function LocaleRuntime({
  locale,
  dictionary,
  children,
}: {
  locale: TranslatedLocale;
  dictionary: Dictionary;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const translate = useMemo(() => createTranslator(dictionary), [dictionary]);
  const html = localeHtml[locale];

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    document.documentElement.lang = html.lang;
    document.documentElement.dir = html.dir;
    document.documentElement.dataset.locale = locale;
    window.localStorage.setItem("sk-language", locale);
    translateElement(root, translate);

    const observer = new MutationObserver((records) => {
      for (const record of records) {
        if (record.type === "characterData" && record.target instanceof Text) {
          const parent = record.target.parentElement;
          if (!parent || parent.closest("script, style, noscript, code, [data-no-translate]")) continue;
          const next = translate(record.target.data);
          if (next !== record.target.data) record.target.data = next;
          continue;
        }
        for (const node of record.addedNodes) {
          if (node instanceof HTMLElement) translateElement(node, translate);
          else if (node instanceof Text && node.parentElement) {
            const next = translate(node.data);
            if (next !== node.data) node.data = next;
          }
        }
      }
    });
    observer.observe(root, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, [html.dir, html.lang, locale, pathname, translate]);

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
    const destination = localizePathname(`${appPath}${url.search}${url.hash}`, locale);
    event.preventDefault();
    event.stopPropagation();
    router.push(destination);
  };

  return <div ref={rootRef} className="i18n-content" lang={html.lang} dir={html.dir} onClickCapture={captureLocalizedNavigation}>{children}</div>;
}

