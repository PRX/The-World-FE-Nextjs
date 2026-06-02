/**
 * Fetch Content data from WP GraphQL API.
 */

import { gql } from "@apollo/client";
import type {
  ContentNode,
  ContentNodeConnectionPageInfo,
  PageInfo,
  RootQueryToContentNodeConnectionWhereArgs,
  TermNodeConnection,
  WpPageInfo,
} from "@/interfaces";
import { getClient } from "@/lib/fetch/api";
import { IMAGE_PROPS } from "@/lib/fetch/api/graphql";
import { upperFirst } from "lodash";

export type SearchQueryOptions = {
  first?: number;
  last?: number;
  after?: string;
  before?: string;
  where?: RootQueryToContentNodeConnectionWhereArgs;
};

const GET_SEARCH_RESULTS = (
  taxonomySingleName = "program",
  termSlug = "the-world",
) => gql`
  query getContent($search: String, $first: Int, $last: Int, $after: String, $before: String, $where: ${upperFirst(taxonomySingleName || "tag")}ToContentNodeConnectionWhereArgs) {
    contentContext: ${taxonomySingleName} (id: "${termSlug}", idType: SLUG) {
      contentNodes (
      first: $first,
      last: $last,
      after: $after,
      before: $before,
      where: $where
    ) {
        nodes {
          contentTypeName
          id
          date
          link
          ...on NodeWithTitle {
            title
          }
          ...on NodeWithFeaturedImage {
            featuredImage {
              node {
                ...ImageProps
              }
            }
          }
        }
      }
    }
    terms (first: $first, where: { search: $search, hideEmpty: true, orderby: COUNT order: DESC }) {
      nodes {
        id
        taxonomyName
        name
        link
        count
        ...on Contributor {
          contributorDetails {
            image {
              node {
                ...ImageProps
              }
            }
          }
        }
      }
    }
  }
  ${IMAGE_PROPS}
`;

export async function fetchGqlSearch(
  query?: SearchQueryOptions,
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
    terms?: TermNodeConnection;
  }>({
    variables: {
      search: query?.where?.search,
      ...query,
    },
    query: GET_SEARCH_RESULTS(taxonomySingleName, termSlug),
  });
  const data = response?.data && {
    contentNodes: response?.data?.contentContext?.contentNodes?.nodes,
    terms: response?.data?.terms?.nodes,
  };

  return data;
}

export default fetchGqlSearch;
