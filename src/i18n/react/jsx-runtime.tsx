import { Fragment, jsx as reactJsx, jsxs as reactJsxs } from "react/jsx-runtime";
import type { ElementType } from "react";
import LocalizedIntrinsic, { LocalizedFragment } from "./LocalizedIntrinsic";

const translatedAttributes = new Set(["aria-label", "aria-description", "title", "placeholder", "alt"]);

export function prepareLocalizedElement(type: unknown, props: Record<string, unknown> | null) {
  const children = props?.children;
  const hasTextChild = typeof children === "string" || (Array.isArray(children) && children.some((child) => typeof child === "string"));
  if (type === Fragment && hasTextChild) return [LocalizedFragment, props];
  const shouldLocalize = typeof type === "string" && props && props["data-no-translate"] === undefined &&
    (hasTextChild ||
      [...translatedAttributes].some((attribute) => typeof props[attribute] === "string"));
  return shouldLocalize ? [LocalizedIntrinsic, { ...props, as: type }] : [type, props];
}

export function jsx(type: unknown, props: Record<string, unknown> | null, key?: string) {
  const [nextType, nextProps] = prepareLocalizedElement(type, props);
  return reactJsx(nextType as ElementType, nextProps, key);
}

export function jsxs(type: unknown, props: Record<string, unknown> | null, key?: string) {
  const [nextType, nextProps] = prepareLocalizedElement(type, props);
  return reactJsxs(nextType as ElementType, nextProps, key);
}

export { Fragment };

export type { JSX } from "react";
