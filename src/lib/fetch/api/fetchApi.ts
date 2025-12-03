/**
 * @file fetchApi.js
 * Exports a mechanism that makes GET requests to API easier to manage.
 */

import { encode as base64Encode } from "base-64";
import type { RequestInit } from "next/dist/server/web/spec-extension/request";
import type { ParsedUrlQuery } from "node:querystring";
import { format } from "node:url";
import type {
  Category,
  CategoryToPostConnection,
  CollectionQueryOptions,
  ContributorToPostConnection,
  ICMApiCustomField,
  INewsletterOptions,
  INewsletterData,
  Maybe,
  Page,
  ProgramToPostConnection,
  PostConnection,
  SearchQueryOptions,
  SearchQueryProps,
} from "@/interfaces";
import type {
  fetchGqlAudio,
  fetchGqlContributor,
  fetchGqlEpisode,
  fetchGqlProgram,
  fetchGqlQuerySearch,
  fetchGqlStory,
} from "@/lib/fetch";

/**
 * Method that simplifies GET requests.
 *
 * @param path
 *    Path to the resource being requested.
 * @param req
 *    Request object from `getInitialProps` ctx object.
 * @param query
 *    Query object.
 * @param body
 *    Data object to send as JSON. Will convert request to POST.
 *
 * @returns
 *    Denormalized response to request, or error object.
 */
export async function fetchApi<T>({
  path,
  query,
  body,
  init,
}: {
  path: string;
  query?: ParsedUrlQuery;
  body?: object;
  init?: RequestInit;
}): Promise<T | undefined> {
  const url = format({
    pathname: `/api/${path}`,
    query: {
      ...(query || {}),
    },
  });

  return fetch(
    url,
    body
      ? {
          ...init,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      : {
          ...init,
        },
  ).then((r) => (r.status === 200 ? (r.json() as T) : undefined));
}

/**
 * Method that simplifies GET queries for resource item using URL path alias.
 *
 * @param alias
 *    Alias used by resource item to display data.
 * @param req
 *    Request object from `getInitialProps` ctx object.
 *
 * @returns
 *    Denormalized resource item.
 */
export const fetchApiQueryAlias = async (alias: string, init?: RequestInit) =>
  fetchApi({
    path: `query/alias/${alias.replace(/^\/+|\/+$/, "")}`,
    init,
  });

/**
 * Method that simplifies GET queries for app data.
 *
 * @param req
 *    Request object from `getInitialProps` ctx object.
 *
 * @returns
 *    App data object.
 */
// export const fetchApiApp = async (init?: RequestInit) =>
//   fetchApi<IApp>({ path: "app", init });

/**
 * Method that simplifies GET queries for homepage data.
 *
 * @param req
 *    Request object from `getInitialProps` ctx object.
 *
 * @returns
 *    Homepage data object.
 */
export const fetchApiHomepage = async (init?: RequestInit) =>
  fetchApi({ path: "homepage", init });

/**
 * Method that simplifies GET queries for newsletter data.
 *
 * @param id
 *    API id of newsletter.
 * @param req
 *    Request object from `getInitialProps` ctx object.
 *
 * @returns
 *    Story data object.
 */
export const fetchApiNewsletter = async (id: string, init?: RequestInit) =>
  fetchApi({ path: `newsletter/${id}`, init });

/**
 * Post subscription data to Campaign Monitor.
 *
 * @param newsletter Newsletter data object.
 * @param options Newsletter subscription options.
 */
export const postNewsletterSubscription = async (
  newsletter: INewsletterData,
  options: INewsletterOptions,
  init?: RequestInit,
) => {
  const { emailAddress } = newsletter;
  const { listId, customFields: cflds } = {
    listId: "04472db22d3fa6920bb38f18358b0f72",
    ...options,
  };
  const customFields =
    cflds &&
    Object.entries(cflds).map(
      ([Key, Value]: [string, string]): ICMApiCustomField => ({
        Key,
        Value,
      }),
    );
  const payload = {
    listId,
    emailAddress,
    customFields,
  };

  return fetch("/api/newsletter/subscribe", {
    ...init,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  }).then((r) => r.json());
};

/**
 * Method that simplifies GET queries for story data.
 *
 * @param id
 *    API id of story.
 * @param req
 *    Request object from `getInitialProps` ctx object.
 *
 * @returns
 *    Story data object.
 */
export const fetchApiStory = async (id: number, init?: RequestInit) =>
  fetchApi<ReturnType<typeof fetchGqlStory>>({ path: `story/${id}`, init });

/**
 * Method that simplifies GET queries for episode data.
 *
 * @param id
 *    API id of episode.
 * @param req
 *    Request object from `getInitialProps` ctx object.
 *
 * @returns
 *    Episode data object.
 */
export const fetchApiEpisode = async (id: string, init?: RequestInit) =>
  fetchApi<ReturnType<typeof fetchGqlEpisode>>({ path: `episode/${id}`, init });

/**
 * Method that simplifies GET queries for audio file data.
 *
 * @param id
 *    API id of audio file.
 * @param req
 *    Request object from `getInitialProps` ctx object.
 *
 * @returns
 *    Audio file data object.
 */
export const fetchApiFileAudio = async (id: string, init?: RequestInit) =>
  fetchApi<ReturnType<typeof fetchGqlAudio>>({
    path: `file/audio/${id}`,
    init,
  });

/**
 * Method that simplifies GET queries for contributor data.
 *
 * @param id
 *    API id of contributor.
 * @param req
 *    Request object from `getInitialProps` ctx object.
 *
 * @returns
 *    Story data object.
 */
export const fetchApiContributor = async (id: string, init?: RequestInit) =>
  fetchApi<ReturnType<typeof fetchGqlContributor>>({
    path: `contributor/${id}`,
    init,
  });

/**
 * Method that simplifies GET queries for contributor stories data.
 *
 * @param id
 *    API id of contributor.
 * @param options
 *    Collection query options.
 * @param init
 *    Fetch init options.
 *
 * @returns
 *    Story collection data object.
 */
export const fetchApiContributorStories = async (
  id: string,
  options?: CollectionQueryOptions,
  init?: RequestInit,
) => {
  const { cursor, pageSize, exclude } = options || {};
  return fetchApi<ContributorToPostConnection>({
    path: `contributor/${id}/posts`,
    query: {
      ...(options && { c: cursor }),
      ...(pageSize && { f: `${pageSize}` }),
      ...(exclude && { e: exclude }),
    },
    init,
  });
};

/**
 * Method that simplifies GET queries for program data.
 *
 * @param id
 *    API id of program.
 * @param req
 *    Request object from `getInitialProps` ctx object.
 *
 * @returns
 *    Story data object.
 */
export const fetchApiProgram = async (id: string, init?: RequestInit) =>
  fetchApi<ReturnType<typeof fetchGqlProgram>>({ path: `program/${id}`, init });

/**
 * Method that simplifies GET queries for program stories data.
 *
 * @param id
 *    API id of program.
 * @param options
 *    Collection query options.
 * @param init
 *    Fetch init options.
 *
 * @returns
 *    Story collection data object.
 */
export const fetchApiProgramStories = async (
  id: string,
  options?: CollectionQueryOptions,
  init?: RequestInit,
) => {
  const { cursor, pageSize, exclude } = options || {};
  return fetchApi<ProgramToPostConnection>({
    path: `program/${id}/posts`,
    query: {
      ...(options && { c: cursor }),
      ...(pageSize && { f: `${pageSize}` }),
      ...(exclude && { e: exclude }),
    },
    init,
  });
};

/**
 * Method that simplifies GET queries for program stories data.
 *
 * @param id
 *    API id of program.
 * @param req
 *    Request object from `getInitialProps` ctx object.
 *
 * @returns
 *    Episode collection data object.
 */
export const fetchApiProgramEpisodes = async (
  id: string,
  options?: CollectionQueryOptions,
  init?: RequestInit,
) => {
  const { cursor, pageSize, exclude } = options || {};
  return fetchApi<ProgramToPostConnection>({
    path: `program/${id}/episodes`,
    query: {
      ...(options && { c: cursor }),
      ...(pageSize && { f: `${pageSize}` }),
      ...(exclude && { e: exclude }),
    },
    init,
  });
};

/**
 * Method that simplifies GET queries for category data.
 *
 * @param id
 *    API id of category.
 * @param req
 *    Request object from `getInitialProps` ctx object.
 *
 * @returns
 *    Category data object.
 */
export const fetchApiCategory = async (id: string, init?: RequestInit) =>
  fetchApi<Category>({ path: `category/${id}`, init });

/**
 * Method that simplifies GET queries for category stories data.
 *
 * @param id
 *    API id of category.
 * @param page
 *    Page number of stories to return.
 * @param range
 *    Number of stories to return for the page.
 * @param field
 *    Name of field prop to look for category reference on stories.
 * @param exclude
 *    Array of story ids to exclude from query.
 * @param req
 *    Request object from `getInitialProps` ctx object.
 *
 * @returns
 *    Promise that returns Collection of Story data objects.
 */
export const fetchApiCategoryStories = async (
  id: string,
  options?: CollectionQueryOptions,
  init?: RequestInit,
) => {
  const { cursor, pageSize, exclude } = options || {};
  return fetchApi<CategoryToPostConnection>({
    path: `category/${id}/posts`,
    query: {
      ...(options && { c: cursor }),
      ...(pageSize && { f: `${pageSize}` }),
      ...(exclude && { e: exclude }),
    },
    init,
  });
};

/**
 * Method that simplifies GET queries for tag stories data.
 *
 * @param id
 *    API id of tag.
 * @param taxonomyRestBase
 *    Rest base of tag's taxonomy.
 * @param options
 *    Collection query options.
 * @param init
 *    Fetch init options.
 *
 * @returns
 *    Story collection data object.
 */
export const fetchApiTagStories = async (
  id: string,
  taxonomyRestBase?: Maybe<string>,
  options?: CollectionQueryOptions,
  init?: RequestInit,
) => {
  const { cursor, pageSize, exclude } = options || {};
  const taxonomySlug =
    taxonomyRestBase && taxonomyRestBase !== "tags"
      ? taxonomyRestBase
      : undefined;
  const path = ["tag", taxonomySlug, id, "posts"].filter((v) => !!v).join("/");
  return fetchApi<PostConnection>({
    path,
    query: {
      ...(options && { c: cursor }),
      ...(pageSize && { f: `${pageSize}` }),
      ...(exclude && { e: exclude }),
    },
    init,
  });
};

/**
 * Method that simplifies GET queries for tag stories data.
 *
 * @param id
 *    API id of tag.
 * @param req
 *    Request object from `getInitialProps` ctx object.
 *
 * @returns
 *    Episode collection data object.
 */
export const fetchApiTagEpisodes = async (
  id: string,
  taxonomyRestBase?: Maybe<string>,
  options?: CollectionQueryOptions,
  init?: RequestInit,
) => {
  const { cursor, pageSize, exclude } = options || {};
  const taxonomySlug =
    taxonomyRestBase && taxonomyRestBase !== "tags"
      ? taxonomyRestBase
      : undefined;
  const path = ["tag", taxonomySlug, id, "episodes"]
    .filter((v) => !!v)
    .join("/");
  return fetchApi<PostConnection>({
    path,
    query: {
      ...(options && { c: cursor }),
      ...(pageSize && { f: `${pageSize}` }),
      ...(exclude && { e: exclude }),
    },
    init,
  });
};

/**
 * Method that simplifies GET queries for page data.
 *
 * @param id
 *    API id of page.
 * @param req
 *    Request object from `getInitialProps` ctx object.
 *
 * @returns
 *    Page data object.
 */
export const fetchApiPage = async (id: string, init?: RequestInit) =>
  fetchApi<Page>({ path: `page/${id}`, init });

export const fetchApiSearch = (
  queryProps: SearchQueryProps,
  options?: SearchQueryOptions,
  init?: RequestInit,
) => {
  const { query, facet, cursors } = queryProps;
  const { pageSize } = options || {};
  return fetchApi<ReturnType<typeof fetchGqlQuerySearch>>({
    path: `query/search/${query}`,
    query: {
      ...(pageSize && { f: `${pageSize}` }),
      ...(facet && {
        t: facet,
      }),
      ...(cursors && { c: base64Encode(JSON.stringify(cursors)) }),
    },
    init,
  });
};
