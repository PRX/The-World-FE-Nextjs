import {
  OrderEnum,
  type RootQueryToTagConnectionWhereArgs,
  TermObjectsConnectionOrderbyEnum,
  type RootQueryToTagConnection,
} from "@/interfaces";
import { gql } from "@apollo/client";
import { gqlClient } from "@/lib/fetch/api";
import {
  AUDIO_PROPS,
  EPISODE_CARD_PROPS_WITHOUT_SEGMENTS,
  IMAGE_PROPS,
  POST_CARD_PROPS,
  SEGMENT_CARD_PROPS,
} from "@/lib/fetch/api/graphql";

export type TagsQueryOptions = {
  first?: number;
  last?: number;
  after?: string;
  before?: string;
  where?: RootQueryToTagConnectionWhereArgs;
};

const GET_TAGS = gql`
  query getTags($first: Int, $last: Int, $after: String, $before: String, $where: RootQueryToTagConnectionWhereArgs) {
    tags (
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
        ...TermCardProps
      }
    }
  }
  fragment TermCardProps on Tag {
    id
    link
    name
    count
    taxonomyImages {
      imageBanner {
        ...ImageProps
      }
    }
    contentNodes (first: 20, where: { orderby: { field: DATE, order: DESC } }) {
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
  ${EPISODE_CARD_PROPS_WITHOUT_SEGMENTS}
  ${POST_CARD_PROPS}
  ${SEGMENT_CARD_PROPS}
  ${AUDIO_PROPS}
  ${IMAGE_PROPS}
`;

export async function fetchGqlTags(query: TagsQueryOptions) {
  const response = await gqlClient.query<{
    tags: RootQueryToTagConnection;
  }>({
    query: GET_TAGS,
    variables: {
      ...query,
      where: {
        orderby: TermObjectsConnectionOrderbyEnum.Count,
        order: OrderEnum.Desc,
        hideEmpty: true,
        ...query?.where,
      },
    },
  });
  const data = response?.data?.tags;

  if (!data) return undefined;

  return data;
}

export default fetchGqlTags;
