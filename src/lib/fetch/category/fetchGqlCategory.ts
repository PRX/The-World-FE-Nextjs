/**
 * Fetch Category data from CMS API.
 *
 * @param id Category identifier.
 */

import type { Category, Maybe } from "@/interfaces";
import { gql } from "@apollo/client";
import { gqlClient } from "@/lib/fetch/api";
import {
  AUDIO_PROPS,
  IMAGE_PROPS,
  POST_CARD_PROPS,
  TAXONOMY_SEO_PROPS,
} from "@/lib/fetch/api/graphql";

const GET_CATEGORY_CHILDREN = gql`
  query getCategoryChildren($id: ID!, $cursor: String) {
    category(id: $id) {
      children(first: 100, after: $cursor) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          cursor
          node {
            id
            name
            link
          }
        }
      }
    }
  }
`;

const GET_CATEGORY = gql`
  query getCategory($id: ID!, $idType: CategoryIdType) {
    category(id: $id, idType: $idType) {
      id
      link
      name
      description
      teaserFields {
        teaser
      }
      taxonomyImages {
        imageBanner {
          node {
            ...ImageProps
          }
        }
        logo {
          node {
            ...ImageProps
          }
        }
      }
      landingPage {
        featuredPosts {
          nodes {
            ... on ContentNode {
              databaseId
            }
            ... on Post {
              ...PostCardProps
            }
          }
        }
      }
      categoryEditors {
        editors {
          nodes {
            id
            link
            name
            ... on WithAcfContributorDetails {
              contributorDetails {
                image {
                  node {
                    ...ImageProps
                  }
                }
              }
            }
          }
        }
      }
      sponsorship {
        collectionSponsorLinks {
          sponsorLinks {
            url
            title
          }
        }
      }
      seo {
        ...TaxonomySEOProps
      }
      children(first: 100) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          name
          link
          count
        }
      }
    }
  }
  ${POST_CARD_PROPS}
  ${AUDIO_PROPS}
  ${IMAGE_PROPS}
  ${TAXONOMY_SEO_PROPS}
`;

export async function fetchGqlCategory(id: string, idType?: string) {
  const response = await gqlClient.query<{
    category: Maybe<Category>;
  }>({
    query: GET_CATEGORY,
    variables: {
      id,
      idType,
    },
  });
  const category = response?.data?.category;

  if (!category?.children) return undefined;

  if (category.children.pageInfo) {
    let childrenNodes = [...category.children.nodes];
    let { hasNextPage, endCursor } = category.children.pageInfo;

    while (hasNextPage && endCursor) {
      // eslint-disable-next-line no-await-in-loop
      const moreChildren = await gqlClient
        .query<{
          category: Maybe<Category>;
        }>({
          query: GET_CATEGORY_CHILDREN,
          variables: {
            id: category.id,
            cursor: endCursor,
          },
        })
        .then((res) => res.data?.category?.children);

      if (moreChildren) {
        childrenNodes = [...childrenNodes, ...moreChildren.nodes];
        category.children.pageInfo = { ...moreChildren.pageInfo };
      }

      hasNextPage = !!moreChildren?.pageInfo.hasNextPage;
      endCursor = moreChildren?.pageInfo.endCursor;
    }

    category.children.nodes = childrenNodes;
  }

  return category;
}

export default fetchGqlCategory;
