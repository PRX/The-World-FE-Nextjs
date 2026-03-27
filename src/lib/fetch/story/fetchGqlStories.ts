/**
 * Fetch Stories data from WP GraphQL API.
 */

import { gql } from "@apollo/client";
import type {
  RootQueryToPostConnection,
  RootQueryToPostConnectionWhereArgs,
} from "@/interfaces";
import { getClient } from "@/lib/fetch/api";
import {
  AUDIO_PROPS,
  IMAGE_PROPS,
  SEGMENT_CARD_PROPS,
} from "@/lib/fetch/api/graphql";

export type StoriesQueryOptions = {
  first?: number;
  last?: number;
  after?: string;
  before?: string;
  where?: RootQueryToPostConnectionWhereArgs;
};

export const GET_STORIES = gql`
  query getStories($first: Int, $last: Int, $after: String, $before: String, $where: RootQueryToPostConnectionWhereArgs) {
    posts(
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
        ...SegmentCardProps
      }
    }
  }
  ${SEGMENT_CARD_PROPS}
  ${AUDIO_PROPS}
  ${IMAGE_PROPS}
`;

export async function fetchGqlStories(
  query?: StoriesQueryOptions,
  authToken?: string,
) {
  const gqlClient = getClient(authToken);

  const response = await gqlClient.query<{
    posts: RootQueryToPostConnection;
  }>({
    query: GET_STORIES,
    variables: query,
  });
  const results = response?.data?.posts;

  if (!results) return undefined;

  return results;
}

export default fetchGqlStories;
