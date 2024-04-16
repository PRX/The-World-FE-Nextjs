/**
 * Fetch Tag episodes data from CMS API.
 *
 * @param id Tag identifier.
 * @param options Query options.
 */

import type { CollectionQueryOptions, Maybe, PostTag } from '@interfaces';
import { upperFirst } from 'lodash';
import { gql } from '@apollo/client';
import { gqlClient } from '@lib/fetch/api';
import { EPISODE_CARD_PROPS, IMAGE_PROPS } from '@lib/fetch/api/graphql';

const GET_TAG_EPISODES = (taxonomySingleName: Maybe<string>) => gql`
  query getTagEpisodes(
    $id: ID!, $idType: ${upperFirst(taxonomySingleName || 'tag')}IdType,
    $pageSize: Int = 10
    $cursor: String
    $exclude: [ID]
  ) {
    ${taxonomySingleName}(id: $id, idType: $idType) {
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
  ${IMAGE_PROPS}
`;

export async function fetchGqlTagEpisodes(
  id: string,
  options?: CollectionQueryOptions,
  taxonomySingleName?: Maybe<string>
) {
  const dataPropKey = taxonomySingleName || 'tag';
  const response = await gqlClient.query<{
    [k: string]: Maybe<PostTag>;
  }>({
    query: GET_TAG_EPISODES(dataPropKey),
    variables: {
      id,
      ...options
    }
  });
  const episodes = response?.data?.[dataPropKey]?.episodes;

  if (!episodes) return undefined;

  return episodes;
}

export default fetchGqlTagEpisodes;
