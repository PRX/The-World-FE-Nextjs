/**
 * Fetch Episode data from WP GraphQL API.
 */

import { gql } from "@apollo/client";
import type { Episode, RootQueryToEpisodeConnection } from "@/interfaces";
import { getClient } from "@/lib/fetch/api";
import { EPISODE_CARD_PROPS, IMAGE_PROPS } from "@/lib/fetch/api/graphql";

export const GET_EPISODES = gql`
  query getEpisodesInMonth($after: DateInput, $before: DateInput) {
    episodes(
      where: {dateQuery: {after: $after, before: $before}, orderby: {field: DATE, order: DESC}}
    ) {
      nodes {
        ...EpisodeCardProps
      }
    }
  }
  ${EPISODE_CARD_PROPS}
  ${IMAGE_PROPS}
`;

export async function fetchGqlEpisodesInMonth(
  year: string | number,
  month: string | number,
  authToken?: string,
) {
  const gqlClient = getClient(authToken);
  const afterDate = new Date(`${year}/${month}/1`);
  const beforeDate = new Date(afterDate);

  beforeDate.setMonth(beforeDate.getMonth() + 1);

  const response = await gqlClient.query<{
    episodes: RootQueryToEpisodeConnection;
  }>({
    query: GET_EPISODES,
    variables: {
      after: {
        year: afterDate.getFullYear(),
        month: afterDate.getMonth() + 1,
        day: 1,
      },
      before: {
        year: beforeDate.getFullYear(),
        month: beforeDate.getMonth() + 1,
        day: 1,
      },
    },
  });
  const episodes = response?.data?.episodes.nodes;

  if (!episodes) return undefined;

  return episodes as Episode[];
}

export default fetchGqlEpisodesInMonth;
