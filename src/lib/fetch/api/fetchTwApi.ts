/**
 * @file fetchTwApi.js
 * Exports a mechanism that makes GET requests to TW (WP) API easier to manage.
 */

import type { RequestInit } from "next/dist/server/web/spec-extension/request";
import { stringify as qsStringify } from "qs";

export type TwApiCollectionMeta = {
  count: number;
  size: number;
  page: number;
  first: number;
  last: number;
  next?: number;
};

/**
 * Fetch data from TW (WP) API.
 *
 * @param path API resource path.
 * @param params Query parameters.
 * @param init Init options for the fetch.
 * @returns Fetched data.
 */
export async function fetchTwApi<T>(
  path: string,
  params?: { [k: string]: string },
  init?: RequestInit,
) {
  let url = `${process.env.API_URL_BASE}/${process.env.WP_REST_ENDPOINT}/${path}`;

  if (params) {
    const qs = qsStringify(params);
    url = `${url}?${qs}`;
  }

  const resp = await fetch(url, init);

  if (!resp.ok) return undefined;

  try {
    const data: T = await resp.json();
    const wpTotal = resp.headers.get("x-wp-total");
    const wpTotalPages = resp.headers.get("x-wp-totalpages");
    const isCollection = !!(wpTotal && wpTotalPages);

    if (isCollection) {
      const count = parseInt(wpTotal, 10);
      const first = 1;
      const last = parseInt(wpTotalPages, 10);
      const size = Math.ceil(count / last);
      const page = parseInt(params?.page || "1", 10);
      const next = page + 1;

      return {
        meta: {
          count,
          first,
          last,
          ...(next <= last && { next }),
          page,
          size,
        } as TwApiCollectionMeta,
        data,
      };
    }

    return { data };
  } catch (_error) {
    return undefined;
  }
}

export default fetchTwApi;
