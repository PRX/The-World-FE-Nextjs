/**
 * Fetch Episodes data from WP GraphQL API.
 */

import { gql } from "@apollo/client";
import type {
  RootQueryToEpisodeConnection,
  RootQueryToEpisodeConnectionWhereArgs,
} from "@/interfaces";
import { getClient } from "@/lib/fetch/api";
import {
  AUDIO_PROPS,
  EPISODE_CARD_PROPS_WITHOUT_SEGMENTS,
  IMAGE_PROPS,
} from "@/lib/fetch/api/graphql";

export type EpisodesQueryOptions = {
  first?: number;
  last?: number;
  after?: string;
  before?: string;
  where?: RootQueryToEpisodeConnectionWhereArgs;
};

export const GET_EPISODES = gql`
  query getEpisodes($first: Int, $last: Int, $after: String, $before: String, $where: RootQueryToEpisodeConnectionWhereArgs) {
    episodes(
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
        ...EpisodeCardPropsWithoutSegments
      }
    }
  }
  ${EPISODE_CARD_PROPS_WITHOUT_SEGMENTS}
  ${AUDIO_PROPS}
  ${IMAGE_PROPS}
`;

export async function fetchGqlEpisodes(
  query?: EpisodesQueryOptions,
  authToken?: string,
) {
  const gqlClient = getClient(authToken);

  const response = await gqlClient.query<{
    episodes: RootQueryToEpisodeConnection;
  }>({
    query: GET_EPISODES,
    variables: query,
  });
  const results = response?.data?.episodes;

  if (!results) return undefined;

  return results;
}

export default fetchGqlEpisodes;
