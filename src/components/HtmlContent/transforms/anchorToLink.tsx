import type { ReplaceCallback } from "../types";
import { domToReact, type Element } from "html-react-parser";
import { ElementType } from "htmlparser2";
import Link from "next/link";
import { isLocalUrl, sanitizeUrl } from "@/lib/parse/url";
import { generateContentLinkHref } from "@/lib/routing/content";

export const anchorToLink: ReplaceCallback = (domNode, _index, options) => {
  const { type, name, attribs } = domNode as Element;

  if (type !== ElementType.Tag || name !== "a") return;

  // Return an app link.
  const { href } = attribs || {};
  let url: URL | undefined;
  const sanitizedHref = sanitizeUrl(href);

  if (sanitizedHref.startsWith("data:")) {
    // Data URL link. Render children, but not the link.
    return <>{domToReact(domNode.children, options)}</>;
  }

  try {
    url = new URL(sanitizedHref, "https://theworld.org");
  } catch {
    url = undefined;
  }

  // Handle links copied from google searches for internal URL's.
  if (
    url &&
    /\/\/(www\.)?google\.com\/url/.test(url.href) &&
    url.searchParams
  ) {
    const q = url.searchParams.get("q");

    try {
      url = q ? new URL(q) : undefined;
    } catch {
      url = undefined;
    }
  }

  if (url?.href && isLocalUrl(url.href)) {
    const linkHref = generateContentLinkHref(url.href);

    if (linkHref) {
      return (
        <Link href={linkHref}>{domToReact(domNode.children, options)}</Link>
      );
    }
  }
};
