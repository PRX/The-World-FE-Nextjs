/**
 * Fetch Tag posts data from CMS API.
 *
 * @param id Tag identifier.
 * @param options Query options.
 */

import type { CollectionQueryOptions, Maybe, PostTag } from "@/interfaces";
import { upperFirst } from "lodash";
import { gql } from "@apollo/client";
import { gqlClient } from "@/lib/fetch/api";
import { IMAGE_PROPS, POST_CARD_PROPS } from "@/lib/fetch/api/graphql";

const GET_TAG_POSTS = (taxonomySingleName: Maybe<string>) => gql`
  query getTagPosts(
    $id: ID!, $idType: ${upperFirst(taxonomySingleName || "tag")}IdType,
    $pageSize: Int = 10
    $cursor: String
    $exclude: [ID]
  ) {
    ${taxonomySingleName}(id: $id, idType: $idType) {
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

export async function fetchGqlTagPosts(
  id: string,
  options?: CollectionQueryOptions,
  taxonomySingleName?: Maybe<string>,
) {
  const dataPropKey = taxonomySingleName || "tag";
  const response = await gqlClient.query<{
    [k: string]: Maybe<PostTag>;
  }>({
    query: GET_TAG_POSTS(dataPropKey),
    variables: {
      id,
      ...options,
    },
  });
  const posts = response?.data?.[dataPropKey]?.posts;

  if (!posts) return undefined;

  return posts;
}

export default fetchGqlTagPosts;
