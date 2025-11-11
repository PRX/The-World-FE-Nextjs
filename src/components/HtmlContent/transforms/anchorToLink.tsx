/**
 * @file anchorToLink.tsx
 *
 * Converts an anchor tag with a local URL to Link component.
 */
import parse, {
  domToReact,
  type HTMLReactParserOptions,
  type DOMNode,
} from "html-react-parser";
import Link from "next/link";
import { generateContentLinkHref } from "@/lib/routing";
import { isLocalUrl, sanitizeUrl } from "@/lib/parse/url";

export const anchorToLink = (
  node: DOMNode,
  transform: HTMLReactParserOptions["transform"],
  _index: number,
) => {
  if (
    node.type === "tag" &&
    node.name === "a" &&
    node.attribs.href &&
    !/^mailto:/.test(node.attribs.href)
  ) {
    // Return an app link.
    const {
      attribs,
      attribs: { href, key },
      children,
    } = node;
    let url: URL | undefined;
    const sanitizedHref = sanitizeUrl(href);

    if (sanitizedHref.startsWith("data:")) {
      // Data URL link. Render children, but not the link.
      return <>{domToReact(children as DOMNode[], { transform })}</>;
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

      delete attribs.target;

      if (linkHref) {
        return (
          <Link href={linkHref} passHref key={key} legacyBehavior>
            {domToReact(children as DOMNode[], { transform })}
          </Link>
        );
      }
    }

    return children;
  }

  return undefined;
};
