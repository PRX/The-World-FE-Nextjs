/**
 * Fetch search data from CMS API.
 *
 * @param query Query string.
 * @param type Content type to search for. defaults to "all".
 * @param options Query options.
 */

import { type DocumentNode, gql } from "@apollo/client";
import type { OperationDefinitionNode } from "graphql";
import type {
  RootQueryToEpisodeConnection,
  RootQueryToPostConnection,
  RootQueryToSegmentConnection,
  SearchFacet,
  SearchQueryOptions,
  SearchQueryProps,
} from "@/interfaces";
import { searchFacetKeys } from "@/interfaces";
import { gqlClient } from "@/lib/fetch/api";
import {
  EPISODE_CARD_PROPS,
  IMAGE_PROPS,
  POST_CARD_PROPS,
  SEGMENT_CARD_PROPS,
} from "@/lib/fetch/api/graphql";

const GET_CONTENT_SEARCH = (facets: SearchFacet[] = [...searchFacetKeys]) => {
  const typeNamePropsMap = new Map<
    SearchFacet,
    [string, DocumentNode] | [string, DocumentNode, DocumentNode[]]
  >();
  const fragments = new Set<DocumentNode>();
  const cursorParams = new Set<string>();

  typeNamePropsMap.set("posts", ["posts", POST_CARD_PROPS, [IMAGE_PROPS]]);
  typeNamePropsMap.set("episodes", [
    "episodes",
    EPISODE_CARD_PROPS,
    [IMAGE_PROPS],
  ]);
  typeNamePropsMap.set("segments", ["segments", SEGMENT_CARD_PROPS]);

  const queryProps = facets
    .map((f: SearchFacet) => {
      const typeNameProps = typeNamePropsMap.get(f);

      if (!typeNameProps) return "";

      const cursorVariable = `$${f}Cursor`;
      const [typeName, typePropsFragment, depFragments] = typeNameProps;
      const typePropsFragmentName = (
        typePropsFragment.definitions.at(0) as OperationDefinitionNode
      )?.name?.value;

      cursorParams.add(`${cursorVariable}: String`);
      fragments.add(typePropsFragment);

      if (depFragments?.length) {
        depFragments.forEach((fragment) => {
          fragments.add(fragment);
        });
      }

      return typeName && typePropsFragmentName
        ? `
          ${typeName}(
            first: $pageSize
            after: ${cursorVariable}
            where: { search: $query, orderby: { field: DATE, order: DESC } }
          ) {
            pageInfo {
              hasNextPage
              endCursor
            }
            edges {
              cursor
              node {
                ...${typePropsFragmentName}
              }
            }
          }
        `
        : "";
    })
    .join("\n");

  return gql(`
    query getContentSearch(
      $query: String!
      $pageSize: Int = 10
      ${[...cursorParams].join("\n")}
    ) {
      ${queryProps}
    }
    ${[...fragments].map((f) => f.loc?.source.body || "").join("\n")}
  `);
};

export async function fetchGqlQuerySearch(
  queryProps: SearchQueryProps,
  options?: SearchQueryOptions,
) {
  const { query, facet, cursors } = queryProps;
  const facets = !facet || facet === "all" ? [...searchFacetKeys] : [facet];
  const cursorVariables =
    cursors &&
    facets.reduce(
      (a, f) => ({
        // biome-ignore lint/performance/noAccumulatingSpread: Maybe refactor this.
        ...a,
        ...(cursors[f] && {
          [`${f}Cursor`]: cursors[f],
        }),
      }),
      {},
    );
  const response = await gqlClient.query<{
    posts?: RootQueryToPostConnection;
    episodes?: RootQueryToEpisodeConnection;
    segments?: RootQueryToSegmentConnection;
  }>({
    query: GET_CONTENT_SEARCH(facets),
    variables: {
      query,
      ...options,
      ...cursorVariables,
    },
  });
  const data = response?.data;

  if (!data) return undefined;

  return data;
}

export default fetchGqlQuerySearch;
