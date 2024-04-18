/**
 * @file content.ts
 * Handler functions for routing to content.
 */

/**
 *
 * @param url Resource link URL.
 * @returns Return the app relative path for the resource, eg. pathname and query params.
 */
export const generateContentLinkHref = (url?: string | null) => {
  if (!url) return undefined;

  const sanitizedUrl = [
    // Extract URL from between quotes or appended weirdly to another string.
    (u: string) => /(?<!=)https?:\/\/[\w/._\-?&]+/i.exec(u)?.[0] || u,
    // Ensure relative protocol URL's have a protocol.
    (u: string) => (u.startsWith('//') ? `https:${u}` : u)
  ].reduce((a, fn) => a && fn(a), url);
  const urlBase = sanitizedUrl.startsWith('/')
    ? 'https://theworld.org'
    : undefined;
  const parsedUrl = new URL(sanitizedUrl, urlBase);

  if (parsedUrl?.pathname) {
    return parsedUrl.pathname + parsedUrl.search;
  }

  return undefined;
};
