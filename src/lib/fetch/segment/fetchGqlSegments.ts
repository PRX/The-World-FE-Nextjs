/**
 * Fetch Segments data from WP GraphQL API.
 */

import { gql } from "@apollo/client";
import type {
  RootQueryToSegmentConnection,
  RootQueryToSegmentConnectionWhereArgs,
} from "@/interfaces";
import { getClient } from "@/lib/fetch/api";
import {
  AUDIO_PROPS,
  IMAGE_PROPS,
  SEGMENT_CARD_PROPS,
} from "@/lib/fetch/api/graphql";

export type SegmentsQueryOptions = {
  first?: number;
  last?: number;
  after?: string;
  before?: string;
  where?: RootQueryToSegmentConnectionWhereArgs;
};

export const GET_SEGMENTS = gql`
  query getSegments($first: Int, $last: Int, $after: String, $before: String, $where: RootQueryToSegmentConnectionWhereArgs) {
    segments(
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

export async function fetchGqlSegments(
  query?: SegmentsQueryOptions,
  authToken?: string,
) {
  const gqlClient = getClient(authToken);

  const response = await gqlClient.query<{
    segments: RootQueryToSegmentConnection;
  }>({
    query: GET_SEGMENTS,
    variables: query,
  });
  const results = response?.data?.segments;

  if (!results) return undefined;

  return results;
}

export default fetchGqlSegments;
