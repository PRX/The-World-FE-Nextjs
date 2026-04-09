/**
 * Fetch Episode data from WP GraphQL API.
 */

import { gql } from "@apollo/client";
import type { Episode, RootQueryToEpisodeConnection } from "@/interfaces";
import { getClient } from "@/lib/fetch/api";
import {
  AUDIO_PROPS,
  EPISODE_CARD_PROPS,
  IMAGE_PROPS,
} from "@/lib/fetch/api/graphql";

export const GET_EPISODES_IN_MONTH = gql`
  query getEpisodesInMonth($year: Int, $month: Int) {
    episodes(
      where: {dateQuery: { year: $year, month: $month }, orderby: {field: DATE, order: DESC}}
    ) {
      nodes {
        ...EpisodeCardProps
      }
    }
  }
  ${EPISODE_CARD_PROPS}
  ${AUDIO_PROPS}
  ${IMAGE_PROPS}
`;

export async function fetchGqlEpisodesInMonth(
  year: string | number,
  month: string | number,
  authToken?: string,
) {
  const gqlClient = getClient(authToken);

  const response = await gqlClient.query<{
    episodes: RootQueryToEpisodeConnection;
  }>({
    query: GET_EPISODES_IN_MONTH,
    variables: {
      year: parseInt(`${year}`, 10),
      month: parseInt(`${month}`, 10),
    },
  });
  const episodes = response?.data?.episodes.nodes;

  if (!episodes) return undefined;

  return episodes as Episode[];
}

export default fetchGqlEpisodesInMonth;
