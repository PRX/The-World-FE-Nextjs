/**
 * Fetch Tag data from CMS API.
 *
 * @param id Tag identifier.
 */

import type { Tag } from "@/interfaces";
import { gql } from "@apollo/client";
import { gqlClient } from "@/lib/fetch/api";
import {
  EPISODE_CARD_PROPS_WITHOUT_SEGMENTS,
  IMAGE_PROPS,
  POST_CARD_PROPS,
  TAXONOMY_SEO_PROPS,
} from "@/lib/fetch/api/graphql";

const GET_TAG = gql`
  query getTag($id: ID!, $idType: TagIdType) {
    tag (id: $id, idType: $idType) {
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
            ...EpisodeCardPropsWithoutSegments
          }
        }
      }
    }
  }
  ${POST_CARD_PROPS}
  ${IMAGE_PROPS}
  ${TAXONOMY_SEO_PROPS}
  ${EPISODE_CARD_PROPS_WITHOUT_SEGMENTS}
`;

export async function fetchGqlTag(id: string, idType?: string) {
  const response = await gqlClient.query<{
    tag: Tag;
  }>({
    query: GET_TAG,
    variables: {
      id,
      idType,
    },
  });
  const tag = response?.data?.tag;

  if (!tag) return undefined;

  return tag;
}

export default fetchGqlTag;
