/**
 * Fetch Program episodes data from CMS API.
 *
 * @param id Program identifier.
 * @param options Query options.
 */

import type { CollectionQueryOptions, Program } from "@/interfaces";
import { gql } from "@apollo/client";
import { gqlClient } from "@/lib/fetch/api";
import {
  AUDIO_PROPS,
  EPISODE_CARD_PROPS,
  IMAGE_PROPS,
} from "@/lib/fetch/api/graphql";

const GET_PROGRAM_EPISODES = gql`
  query getProgramEpisodes(
    $id: ID!
    $pageSize: Int = 10
    $cursor: String
    $exclude: [ID]
  ) {
    program(id: $id) {
      id
      episodes(
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
            ...EpisodeCardProps
          }
        }
      }
    }
  }
  ${EPISODE_CARD_PROPS}
  ${AUDIO_PROPS}
  ${IMAGE_PROPS}
`;

export async function fetchGqlProgramEpisodes(
  id: string,
  options?: CollectionQueryOptions,
) {
  const response = await gqlClient.query<{
    program: Program;
  }>({
    query: GET_PROGRAM_EPISODES,
    variables: {
      id,
      ...options,
    },
  });
  const episodes = response?.data?.program.episodes;

  if (!episodes) return undefined;

  return episodes;
}

export default fetchGqlProgramEpisodes;
