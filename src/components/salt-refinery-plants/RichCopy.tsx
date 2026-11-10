"use client";

import { Fragment } from "react";
import Link from "@/components/i18n/LocalizedLink";

// Renders server-resolved copy, turning [[/path|label]] into a link that keeps the current language.
// The text is already translated, so it deliberately skips the client translation runtime.
export default function RichCopy({ text }: { text: string }) {
  return text.split(/(\[\[[^\]]+\]\])/).map((part, index) => {
    const link = part.match(/^\[\[([^|]+)\|([^\]]+)\]\]$/);
    return link
      ? <Link key={index} href={link[1]} style={{ textDecoration: "underline", textUnderlineOffset: "3px" }}>{link[2]}</Link>
      : <Fragment key={index}>{part}</Fragment>;
  });
}
