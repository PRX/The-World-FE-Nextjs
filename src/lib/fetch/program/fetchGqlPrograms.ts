import {
  OrderEnum,
  TermObjectsConnectionOrderbyEnum,
  type RootQueryToProgramConnection,
  type RootQueryToProgramConnectionWhereArgs,
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

export type ProgramQueryOptions = {
  first?: number;
  last?: number;
  after?: string;
  before?: string;
  where?: RootQueryToProgramConnectionWhereArgs;
};

const GET_PROGRAMS = gql`
  query getPrograms($first: Int, $last: Int, $after: String, $before: String, $where: RootQueryToProgramConnectionWhereArgs) {
    programs(
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
        ...ProgramCardProps
      }
    }
  }
  fragment ProgramCardProps on Program {
    id
    link
    name
    count
    teaserFields {
      teaser
    }
    taxonomyImages {
      logo {
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

export async function fetchGqlPrograms(query: ProgramQueryOptions) {
  const response = await gqlClient.query<{
    programs: RootQueryToProgramConnection;
  }>({
    query: GET_PROGRAMS,
    variables: {
      ...query,
      where: {
        orderby: TermObjectsConnectionOrderbyEnum.Count,
        order: OrderEnum.Desc,
        ...query?.where,
        hideEmpty: true,
        exclude: ["dGVybToxMjMwNw=="],
      },
    },
  });
  const data = response?.data?.programs;

  if (!data) return undefined;

  return data;
}

export default fetchGqlPrograms;
