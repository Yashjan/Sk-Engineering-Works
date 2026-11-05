import { jsxDEV as reactJsxDEV, type JSXSource } from "react/jsx-dev-runtime";
import type { ElementType, Key } from "react";
import { prepareLocalizedElement } from "./jsx-runtime";

export { Fragment, jsx, jsxs } from "./jsx-runtime";
export type { JSX } from "./jsx-runtime";

export function jsxDEV(
  type: unknown,
  props: Record<string, unknown> | null,
  key: Key | undefined,
  isStaticChildren: boolean,
  source?: JSXSource,
  self?: unknown,
) {
  const [nextType, nextProps] = prepareLocalizedElement(type, props);
  return reactJsxDEV(nextType as ElementType, nextProps, key, isStaticChildren, source, self);
}
