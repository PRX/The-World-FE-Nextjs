import { type DOMNode, domToReact, type Element } from "html-react-parser";
import type { ReplaceCallback } from "../types";
import Link from "next/link";
import { replaceElement } from "@/app/(main)/_components/ContentBody/replacers";
import { isLocalUrl, sanitizeUrl } from "@/lib/parse/url";
import { generateContentLinkHref } from "@/lib/routing/content";

/**
 * Replace local anchor tags with Next Link components. Href URL will be sanitized.
 * Data URL's will be unwrapped.
 */
export const anchorToLink: ReplaceCallback = replaceElement(
  "a",
  (el, _index, options) => {
    const { attribs } = el as Element;

    // Return an app link.
    const { href } = attribs || {};
    let url: URL | undefined;
    const sanitizedHref = sanitizeUrl(href);

    if (sanitizedHref.startsWith("data:")) {
      // Data URL link. Render children, but not the link.
      return <>{domToReact(el.children as DOMNode[], options)}</>;
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
          <Link href={linkHref}>
            {domToReact(el.children as DOMNode[], options)}
          </Link>
        );
      }
    }
  },
);
