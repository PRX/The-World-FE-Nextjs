import {
  OrderEnum,
  TermObjectsConnectionOrderbyEnum,
  type RootQueryToContributorConnection,
  type RootQueryToContributorConnectionWhereArgs,
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

export type ContributorQueryOptions = {
  first?: number;
  last?: number;
  after?: string;
  before?: string;
  where?: RootQueryToContributorConnectionWhereArgs;
};

const GET_CONTRIBUTORS = gql`
  query getContributors($first: Int, $last: Int, $after: String, $before: String, $where: RootQueryToContributorConnectionWhereArgs) {
    contributors(
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
        ...ContributorCardProps
      }
    }
  }
  fragment ContributorCardProps on Contributor {
    id
    link
    name
    count
    contributorDetails {
      position
      teaser
      program {
        id
        link
        name
      }
      image {
        ...ImageProps
      }
    }
    taxonomyImages {
      imageBanner {
        ...ImageProps
      }
    }
    contentNodes (first: 20, where: { contentTypes: [POST, SEGMENT] orderby: { field: DATE, order: DESC } }) {
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

export async function fetchGqlContributors(query: ContributorQueryOptions) {
  const response = await gqlClient.query<{
    contributors: RootQueryToContributorConnection;
  }>({
    query: GET_CONTRIBUTORS,
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
  const data = response?.data?.contributors;

  if (!data) return undefined;

  return data;
}

export default fetchGqlContributors;
