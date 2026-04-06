import {
  OrderEnum,
  type RootQueryToSocialTagConnection,
  type RootQueryToSocialTagConnectionWhereArgs,
  TermObjectsConnectionOrderbyEnum,
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

export type SocialTagsQueryOptions = {
  first?: number;
  last?: number;
  after?: string;
  before?: string;
  where?: RootQueryToSocialTagConnectionWhereArgs;
};

const GET_SOCIAL_TAGS = gql`
  query getSocialTags($first: Int, $last: Int, $after: String, $before: String, $where: RootQueryToSocialTagConnectionWhereArgs) {
    socialTags(
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
        ...SocialTagCardProps
      }
    }
  }
  fragment SocialTagCardProps on SocialTag {
    id
    link
    name
    count
    taxonomyImages {
      logo {
        ...ImageProps
      }
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

export async function fetchGqlSocialTags(query: SocialTagsQueryOptions) {
  const response = await gqlClient.query<{
    socialTags: RootQueryToSocialTagConnection;
  }>({
    query: GET_SOCIAL_TAGS,
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
  const data = response?.data?.socialTags;

  if (!data) return undefined;

  return data;
}

export default fetchGqlSocialTags;
