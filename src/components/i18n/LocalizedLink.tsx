"use client";

import NextLink from "next/link";
import { forwardRef, type ComponentProps, type ReactNode } from "react";
import { useLocaleTranslation } from "./LocaleRuntime";
import { isAppHref, localizePathname } from "@/i18n/config";

type Props = ComponentProps<typeof NextLink> & { "data-locale-switch"?: "true"; "data-no-translate"?: boolean };

function translateChildren(children: ReactNode, translate: (value: string) => string): ReactNode {
  if (typeof children === "string") return translate(children);
  if (Array.isArray(children)) return children.map((child) => typeof child === "string" ? translate(child) : child);
  return children;
}

const LocalizedLink = forwardRef<HTMLAnchorElement, Props>(function LocalizedLink({ href, children, ...props }, ref) {
  const { locale, translate } = useLocaleTranslation();
  const preserveLanguageChoice = props["data-locale-switch"] === "true" || props["data-no-translate"] === true;
  const destination = typeof href === "string" && isAppHref(href) && !preserveLanguageChoice
    ? localizePathname(href, locale)
    : href;
  const localizedProps = preserveLanguageChoice ? props : {
    ...props,
    "aria-label": typeof props["aria-label"] === "string" ? translate(props["aria-label"]) : props["aria-label"],
    title: typeof props.title === "string" ? translate(props.title) : props.title,
  };
  return <NextLink {...localizedProps} ref={ref} href={destination}>{preserveLanguageChoice ? children : translateChildren(children, translate)}</NextLink>;
});

export default LocalizedLink;
