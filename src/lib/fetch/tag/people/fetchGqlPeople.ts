import {
  OrderEnum,
  type RootQueryToPersonConnection,
  type RootQueryToPersonConnectionWhereArgs,
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

export type PeopleQueryOptions = {
  first?: number;
  last?: number;
  after?: string;
  before?: string;
  where?: RootQueryToPersonConnectionWhereArgs;
};

const GET_PEOPLE = gql`
  query getPeople($first: Int, $last: Int, $after: String, $before: String, $where: RootQueryToPersonConnectionWhereArgs) {
    people(
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
        ...PersonCardProps
      }
    }
  }
  fragment PersonCardProps on Person {
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

export async function fetchGqlPeople(query: PeopleQueryOptions) {
  const response = await gqlClient.query<{
    people: RootQueryToPersonConnection;
  }>({
    query: GET_PEOPLE,
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
  const data = response?.data?.people;

  if (!data) return undefined;

  return data;
}

export default fetchGqlPeople;
