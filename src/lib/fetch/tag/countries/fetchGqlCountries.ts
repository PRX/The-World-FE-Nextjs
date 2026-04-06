import {
  OrderEnum,
  type RootQueryToCountryConnection,
  type RootQueryToCountryConnectionWhereArgs,
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

export type CountriesQueryOptions = {
  first?: number;
  last?: number;
  after?: string;
  before?: string;
  where?: RootQueryToCountryConnectionWhereArgs;
};

const GET_COUNTRIES = gql`
  query getCountries($first: Int, $last: Int, $after: String, $before: String, $where: RootQueryToCountryConnectionWhereArgs) {
    countries(
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
        ...CountryCardProps
      }
    }
  }
  fragment CountryCardProps on Country {
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

export async function fetchGqlCountries(query: CountriesQueryOptions) {
  const response = await gqlClient.query<{
    countries: RootQueryToCountryConnection;
  }>({
    query: GET_COUNTRIES,
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
  const data = response?.data?.countries;

  if (!data) return undefined;

  return data;
}

export default fetchGqlCountries;
