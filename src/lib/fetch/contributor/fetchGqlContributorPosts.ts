/**
 * Fetch Contributor posts data from CMS API.
 *
 * @param id Contributor identifier.
 * @param options Query options.
 */

import type { CollectionQueryOptions, Contributor, Maybe } from "@/interfaces";
import { gql } from "@apollo/client";
import { gqlClient } from "@/lib/fetch/api";
import { IMAGE_PROPS, POST_CARD_PROPS } from "@/lib/fetch/api/graphql";

const GET_CONTRIBUTOR_POSTS = gql`
  query getContributorPosts(
    $id: ID!
    $pageSize: Int = 10
    $cursor: String
    $exclude: [ID]
  ) {
    contributor(id: $id) {
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
`;

export async function fetchGqlContributorPosts(
  id: string,
  options?: CollectionQueryOptions,
) {
  const response = await gqlClient.query<{
    contributor: Maybe<Contributor>;
  }>({
    query: GET_CONTRIBUTOR_POSTS,
    variables: {
      id,
      ...options,
    },
  });
  const posts = response?.data?.contributor?.posts;

  if (!posts) return undefined;

  return posts;
}

export default fetchGqlContributorPosts;
