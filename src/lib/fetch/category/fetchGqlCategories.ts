import {
  OrderEnum,
  type RootQueryToCategoryConnection,
  type RootQueryToCategoryConnectionWhereArgs,
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

export type CategoriesQueryOptions = {
  first?: number;
  last?: number;
  after?: string;
  before?: string;
  where?: RootQueryToCategoryConnectionWhereArgs;
};

const GET_CATEGORIES = gql`
  query getCategories($first: Int, $last: Int, $after: String, $before: String, $where: RootQueryToCategoryConnectionWhereArgs) {
    categories(
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
        ...CategoryCardProps
      }
    }
  }
  fragment CategoryCardProps on Category {
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
    contentNodes (first: 20, where: { contentTypes: [POST, SEGMENT, EPISODE] orderby: { field: DATE, order: DESC } }) {
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

export async function fetchGqlCategories(query: CategoriesQueryOptions) {
  const response = await gqlClient.query<{
    categories: RootQueryToCategoryConnection;
  }>({
    query: GET_CATEGORIES,
    variables: {
      ...query,
      where: {
        orderby: TermObjectsConnectionOrderbyEnum.Slug,
        order: OrderEnum.Asc,
        hideEmpty: true,
        ...query?.where,
      },
    },
  });
  const data = response?.data?.categories;

  if (!data) return undefined;

  return data;
}

export default fetchGqlCategories;
