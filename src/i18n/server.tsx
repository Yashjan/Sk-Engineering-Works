import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
import ar from "./dictionaries/ar.json";
import hi from "./dictionaries/hi.json";
import type { TranslatedLocale } from "./config";
import { createTranslator } from "./translate";

const dictionaries = { hi, ar } as const;
const translatedAttributes = ["aria-label", "aria-description", "title", "placeholder", "alt"] as const;

export function localizeServerTree(node: ReactNode, locale: TranslatedLocale): ReactNode {
  const translate = createTranslator(dictionaries[locale]);
  const visit = (value: ReactNode): ReactNode => {
    if (typeof value === "string") return translate(value);
    if (Array.isArray(value)) return value.map(visit);
    if (!isValidElement(value)) return value;

    const element = value as ReactElement<Record<string, unknown>>;
    const props: Record<string, unknown> = {};
    if (element.props["data-no-translate"] === undefined) {
      for (const attribute of translatedAttributes) {
        const current = element.props[attribute];
        if (typeof current === "string") props[attribute] = translate(current);
      }
      if (element.props.children !== undefined) props.children = Children.map(element.props.children as ReactNode, visit);
    }
    return Object.keys(props).length ? cloneElement(element, props) : element;
  };
  return visit(node);
}
