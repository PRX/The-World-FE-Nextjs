/**
 * @file content.ts
 * Handler functions for routing to content.
 */

import { sanitizeUrl } from '@lib/parse/url';

/**
 *
 * @param url Resource link URL.
 * @returns Return the app relative path for the resource, eg. pathname and query params.
 */
export const generateContentLinkHref = (url?: string | null) => {
  if (!url) return undefined;

  const sanitizedUrl = sanitizeUrl(url);
  const urlBase = sanitizedUrl.startsWith('/')
    ? 'https://theworld.org'
    : undefined;
  const parsedUrl = new URL(sanitizedUrl, urlBase);

  if (parsedUrl?.pathname) {
    return parsedUrl.pathname + parsedUrl.search;
  }

  return undefined;
};
