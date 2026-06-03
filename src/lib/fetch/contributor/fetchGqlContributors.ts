import {
  type Contributor,
  type Menu,
  type MenuItem,
  OrderEnum,
  TermObjectsConnectionOrderbyEnum,
  type RootQueryToContributorConnection,
  type RootQueryToContributorConnectionWhereArgs,
  type RootQueryToMenuConnection,
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

const CONTRIBUTOR_CARD_PROPS = gql`
  fragment ContributorCardProps on Contributor {
    id
    link
    name
    count
    contributorDetails {
      position
      teaser
      program {
        nodes {
          id
          link
          name
        }
      }
      image {
        node {
          ...ImageProps
        }
      }
    }
    taxonomyImages {
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
`;

const GET_CURATED_CONTRIBUTORS = gql`
  query getCuratedContributors {
    menus (first: 20) {
      nodes {
        id
        slug
        locations
      }
    }
    curatedContributors: menu(id: "curated-contributors", idType: SLUG) {
      menuItems(first: 20) {
        nodes {
          connectedNode {
            node {
              ... on Contributor {
                ...ContributorCardProps
              }
            }
          }
        }
      }
    }
  }
  ${CONTRIBUTOR_CARD_PROPS}
  ${EPISODE_CARD_PROPS_WITHOUT_SEGMENTS}
  ${POST_CARD_PROPS}
  ${SEGMENT_CARD_PROPS}
  ${AUDIO_PROPS}
  ${IMAGE_PROPS}
`;

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
  ${CONTRIBUTOR_CARD_PROPS}
  ${EPISODE_CARD_PROPS_WITHOUT_SEGMENTS}
  ${POST_CARD_PROPS}
  ${SEGMENT_CARD_PROPS}
  ${AUDIO_PROPS}
  ${IMAGE_PROPS}
`;

export async function fetchGqlContributors(query: ContributorQueryOptions) {
  let data: { nodes: Contributor[] } | undefined;

  console.log(query);

  if (query?.where?.search) {
    // Query contributors when search param is provided.
    const response = await gqlClient.query<{
      contributors: RootQueryToContributorConnection;
    }>({
      query: GET_CONTRIBUTORS,
      variables: {
        ...query,
        where: {
          orderby: TermObjectsConnectionOrderbyEnum.Count,
          order: OrderEnum.Desc,
          ...query?.where,
          hideEmpty: true,
        },
      },
    });
    data = response?.data?.contributors;
  } else {
    // Use curated contributors menu when no search param is provided.
    const response = await gqlClient.query<{
      menus: RootQueryToMenuConnection;
      curatedContributors: Menu;
    }>({
      query: GET_CURATED_CONTRIBUTORS,
    });
    const menuItems: MenuItem[] = response?.data?.curatedContributors?.menuItems
      ?.nodes as MenuItem[];
    const nodes = menuItems
      ?.filter((mi) => !!mi.connectedNode?.node.id)
      .map((mi) => mi.connectedNode?.node as Contributor);

    data = { nodes };
  }

  if (!data) return undefined;

  return data;
}

export default fetchGqlContributors;
