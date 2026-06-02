import {
  OrderEnum,
  type RootQueryToCityConnection,
  type RootQueryToCityConnectionWhereArgs,
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

export type CitiesQueryOptions = {
  first?: number;
  last?: number;
  after?: string;
  before?: string;
  where?: RootQueryToCityConnectionWhereArgs;
};

const GET_CITIES = gql`
  query getCities($first: Int, $last: Int, $after: String, $before: String, $where: RootQueryToCityConnectionWhereArgs) {
    cities(
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
        ...CityCardProps
      }
    }
  }
  fragment CityCardProps on City {
    id
    link
    name
    count
    taxonomyImages {
      logo {
        node {
          ...ImageProps
        }
      }
      imageBanner {
        node {
          ...ImageProps
        }
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

export async function fetchGqlCities(query: CitiesQueryOptions) {
  const response = await gqlClient.query<{
    cities: RootQueryToCityConnection;
  }>({
    query: GET_CITIES,
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
  const data = response?.data?.cities;

  if (!data) return undefined;

  return data;
}

export default fetchGqlCities;
