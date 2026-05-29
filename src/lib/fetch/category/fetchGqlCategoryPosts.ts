/**
 * Fetch Category posts data from CMS API.
 *
 * @param id Category identifier.
 * @param options Query options.
 */

import type { CollectionQueryOptions, Category } from "@/interfaces";
import { gql } from "@apollo/client";
import { gqlClient } from "@/lib/fetch/api";
import {
  AUDIO_PROPS,
  IMAGE_PROPS,
  POST_CARD_PROPS,
} from "@/lib/fetch/api/graphql";

const GET_CATEGORY_POSTS = gql`
  query getCategoryPosts(
    $id: ID!
    $pageSize: Int = 10
    $cursor: String
    $exclude: [ID]
  ) {
    category(id: $id) {
      id
      posts(
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
            ...PostCardProps
          }
        }
      }
    }
  }
  ${POST_CARD_PROPS}
  ${IMAGE_PROPS}
  ${AUDIO_PROPS}
`;

export async function fetchGqlCategoryPosts(
  id: string,
  options?: CollectionQueryOptions,
) {
  const response = await gqlClient.query<{
    category: Category;
  }>({
    query: GET_CATEGORY_POSTS,
    variables: {
      id,
      ...options,
    },
  });
  const posts = response?.data?.category.posts;

  if (!posts) return undefined;

  return posts;
}

export default fetchGqlCategoryPosts;
