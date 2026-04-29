/**
 * Fetch Content data from WP GraphQL API.
 */

import { gql } from "@apollo/client";
import {
  ContentTypeEnum,
  type ContentNode,
  type ContentNodeConnectionPageInfo,
  type PageInfo,
  type RootQueryToContentNodeConnectionWhereArgs,
  type WpPageInfo,
} from "@/interfaces";
import { getClient } from "@/lib/fetch/api";
import {
  AUDIO_PROPS,
  EPISODE_CARD_PROPS_WITHOUT_SEGMENTS,
  IMAGE_PROPS,
  POST_CARD_PROPS,
  SEGMENT_CARD_PROPS,
} from "@/lib/fetch/api/graphql";
import { upperFirst } from "lodash";

export type ContentQueryOptions = {
  first?: number;
  last?: number;
  after?: string;
  before?: string;
  where?: RootQueryToContentNodeConnectionWhereArgs;
};

const GET_CONTENT_NODES = (
  taxonomySingleName = "program",
  termSlug = "the-world",
) => gql`
  query getContent($first: Int, $last: Int, $after: String, $before: String, $where: ${upperFirst(taxonomySingleName || "tag")}ToContentNodeConnectionWhereArgs) {
    contentContext: ${taxonomySingleName} (id: "${termSlug}", idType: SLUG) {
      contentNodes(
        first: $first,
        last: $last,
        after: $after,
        before: $before,
        where: $where
      ) {
        pageInfo {
          startCursor
          endCursor
          hasPreviousPage
          hasNextPage
        }
        nodes {
          ... on Episode {
            ...EpisodeCardPropsWithoutSegments
          }
          ... on Post {
            ...PostCardProps
          }
          ... on Segment {
            ...SegmentCardProps
          }
        }
      }
    }
  }
  ${EPISODE_CARD_PROPS_WITHOUT_SEGMENTS}
  ${POST_CARD_PROPS}
  ${SEGMENT_CARD_PROPS}
  ${AUDIO_PROPS}
  ${IMAGE_PROPS}
`;

export async function fetchGqlContent(
  query?: ContentQueryOptions,
  taxonomySingleName?: string,
  termSlug?: string,
  authToken?: string,
) {
  const gqlClient = getClient(authToken);

  const response = await gqlClient.query<{
    contentContext: {
      contentNodes: {
        nodes: Array<ContentNode>;
        pageInfo: ContentNodeConnectionPageInfo & PageInfo & WpPageInfo;
      };
    };
  }>({
    variables: {
      ...query,
      where: {
        ...query?.where,
        contentTypes: query?.where?.contentTypes || [
          ContentTypeEnum.Post,
          ContentTypeEnum.Episode,
          ContentTypeEnum.Segment,
        ],
      },
    },
    query: GET_CONTENT_NODES(taxonomySingleName, termSlug),
  });
  const results = response?.data?.contentContext?.contentNodes;

  if (!results) return undefined;

  return results;
}

export default fetchGqlContent;
