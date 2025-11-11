/**
 * Fetch Contributor segments data from CMS API.
 *
 * @param id Contributor identifier.
 * @param options Query options.
 */

import type { CollectionQueryOptions, Contributor, Maybe } from "@/interfaces";
import { gql } from "@apollo/client";
import { gqlClient } from "@/lib/fetch/api";
import { SEGMENT_LIST_PROPS } from "@/lib/fetch/api/graphql";

const GET_CONTRIBUTOR_SEGMENTS = gql`
  query getContributorSegments(
    $id: ID!
    $pageSize: Int = 10
    $cursor: String
    $exclude: [ID]
  ) {
    contributor(id: $id) {
      id
      segments(
        first: $pageSize
        after: $cursor
        where: { notIn: $exclude, orderby: { field: DATE, order: DESC } }
      ) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          cursor
          node {
            ...SegmentListProps
          }
        }
      }
    }
  }
  ${SEGMENT_LIST_PROPS}
`;

export async function fetchGqlContributorSegments(
  id: string,
  options?: CollectionQueryOptions,
) {
  const response = await gqlClient.query<{
    contributor: Maybe<Contributor>;
  }>({
    query: GET_CONTRIBUTOR_SEGMENTS,
    variables: {
      id,
      ...options,
    },
  });
  const segments = response?.data?.contributor?.segments;

  if (!segments) return undefined;

  return segments;
}

export default fetchGqlContributorSegments;
