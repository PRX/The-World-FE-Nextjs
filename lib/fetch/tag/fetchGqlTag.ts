/**
 * Fetch Tag data from CMS API.
 *
 * @param id Tag identifier.
 */

import { upperFirst } from 'lodash';
import type { Maybe, PostTag } from '@interfaces';
import { gql } from '@apollo/client';
import { gqlClient } from '@lib/fetch/api';
import {
  EPISODE_CARD_PROPS,
  IMAGE_PROPS,
  POST_CARD_PROPS,
  TAXONOMY_SEO_PROPS
} from '@lib/fetch/api/graphql';

const GET_TAG = (taxonomySingleName?: Maybe<string>) => gql`
  query getTag($id: ID!, $idType: ${upperFirst(
    taxonomySingleName || 'tag'
  )}IdType) {
    ${taxonomySingleName || 'tag'}(id: $id, idType: $idType) {
      taxonomy {
        node {
          id
          name
          restBase
          graphqlSingleName
          graphqlPluralName
        }
      }
      id
      link
      name
      description
      taxonomyImages {
        imageBanner {
          ...ImageProps
        }
        logo {
          ...ImageProps
        }
      }
      landingPage {
        featuredPosts {
          ... on Post {
            ...PostCardProps
          }
        }
      }
      seo {
        ...TaxonomySEOProps
      }
      episodes(first: 10) {
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
  ${POST_CARD_PROPS}
  ${IMAGE_PROPS}
  ${TAXONOMY_SEO_PROPS}
  ${EPISODE_CARD_PROPS}
`;

export async function fetchGqlTag(
  id: string,
  idType?: string,
  taxonomySingleName?: Maybe<string>
) {
  const dataPropKey = taxonomySingleName || 'tag';
  const response = await gqlClient.query<{
    [k: string]: Maybe<PostTag>;
  }>({
    query: GET_TAG(taxonomySingleName),
    variables: {
      id,
      idType
    }
  });
  const tag = response?.data?.[dataPropKey];

  if (!tag) return undefined;

  return tag;
}

export default fetchGqlTag;
