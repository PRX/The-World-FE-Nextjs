import { unescape as lodashUnescape } from "lodash";

/**
 * Sanitize a URL string to ensure it can be used in URL constructor.
 *
 * @param url URL string.
 */
export const sanitizeUrl = (url: string) =>
  [
    // Extract URL from between quotes or appended weirdly to another string.
    (u: string) => /(?<=^.*)https?:\/\/[\w/._\-?&=%\s]+/i.exec(u)?.[0] || u,
    // Ensure relative protocol URL's have a protocol.
    (u: string) => (u.startsWith("//") ? `https:${u}` : u),
    // Bad links to base 64 encoded image.
    (u: string) => {
      const m = /image\/\w+;base64,[/\w+=]+/.exec(u)?.[0];
      return m ? `data:${m}` : u;
    },
  ].reduce((a, fn) => fn(a), lodashUnescape(url));
