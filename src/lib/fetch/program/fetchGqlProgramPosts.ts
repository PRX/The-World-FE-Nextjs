/**
 * Fetch Program posts data from CMS API.
 *
 * @param id Program identifier.
 * @param options Query options.
 */

import type { CollectionQueryOptions, Program } from "@/interfaces";
import { gql } from "@apollo/client";
import { gqlClient } from "@/lib/fetch/api";
import {
  AUDIO_PROPS,
  IMAGE_PROPS,
  POST_CARD_PROPS,
} from "@/lib/fetch/api/graphql";

const GET_PROGRAM_POSTS = gql`
  query getProgramPosts(
    $id: ID!
    $pageSize: Int = 10
    $cursor: String
    $exclude: [ID]
  ) {
    program(id: $id) {
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

export async function fetchGqlProgramPosts(
  id: string,
  options?: CollectionQueryOptions,
) {
  const response = await gqlClient.query<{
    program: Program;
  }>({
    query: GET_PROGRAM_POSTS,
    variables: {
      id,
      ...options,
    },
  });
  const posts = response?.data?.program.posts;

  if (!posts) return undefined;

  return posts;
}

export default fetchGqlProgramPosts;
