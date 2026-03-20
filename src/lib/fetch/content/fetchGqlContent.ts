/**
 * Fetch Episode data from WP GraphQL API.
 */

import { gql } from "@apollo/client";
import type {
  RootQueryToContentNodeConnection,
  RootQueryToContentNodeConnectionWhereArgs,
} from "@/interfaces";
import { getClient } from "@/lib/fetch/api";
import {
  EPISODE_CARD_PROPS_WITHOUT_SEGMENTS,
  IMAGE_PROPS,
  POST_CARD_PROPS,
  SEGMENT_CARD_PROPS,
} from "@/lib/fetch/api/graphql";

export type ContentQueryOptions = {
  first?: number;
  last?: number;
  after?: string;
  before?: string;
  where?: RootQueryToContentNodeConnectionWhereArgs;
};

export const GET_CONTENT_NODES = gql`
  query getContent($first: Int, $last: Int, $after: String, $before: String, $where: RootQueryToContentNodeConnectionWhereArgs) {
    contentNodes(
      first: $first,
      last: $last,
      after: $after,
      before: $before,
      where: $where
    ) {
      pageInfo {
        startCursor
        endCursor
        hasPreviousPage
        hasNextPage
      }
      nodes {
        ... on Episode {
          ...EpisodeCardPropsWithoutSegments
        }
        ... on Post {
          ...PostCardProps
        }
        ... on Segment {
          ...SegmentCardProps
        }
      }
    }
  }
  ${EPISODE_CARD_PROPS_WITHOUT_SEGMENTS}
  ${POST_CARD_PROPS}
  ${SEGMENT_CARD_PROPS}
  ${IMAGE_PROPS}
`;

export async function fetchGqlContent(
  query?: ContentQueryOptions,
  authToken?: string,
) {
  const gqlClient = getClient(authToken);

  console.log(query);

  const response = await gqlClient.query<{
    contentNodes: RootQueryToContentNodeConnection;
  }>({
    query: GET_CONTENT_NODES,
    variables: query,
  });
  const results = response?.data?.contentNodes;

  if (!results) return undefined;

  return results;
}

export default fetchGqlContent;
