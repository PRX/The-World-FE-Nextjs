/**
 * Fetch taxonomy terms data from WP GraphQL API.
 */

import {
  OrderEnum,
  type RootQueryToTermNodeConnection,
  TermObjectsConnectionOrderbyEnum,
  type RootQueryToTermNodeConnectionWhereArgs,
} from "@/interfaces";
import { gql } from "@apollo/client";
import { getClient } from "@/lib/fetch/api";

export type SearchTermQueryOptions = {
  first?: number;
  last?: number;
  after?: string;
  before?: string;
  where?: RootQueryToTermNodeConnectionWhereArgs;
};

const GET_SEARCH_TERM_RESULTS = gql`
  query getContent($first: Int, $last: Int, $after: String, $before: String, $where: RootQueryToTermNodeConnectionWhereArgs) {
    terms (
      first: $first,
      last: $last,
      after: $after,
      before: $before,
      where: $where
    ) {
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
`;

export async function fetchGqlSearchTerms(
  query?: SearchTermQueryOptions,
  taxonomySingleName?: string,
  authToken?: string,
) {
  const gqlClient = getClient(authToken);
  const taxonomy = taxonomySingleName?.toUpperCase();
  const response = await gqlClient.query<{
    terms?: RootQueryToTermNodeConnection;
  }>({
    variables: {
      ...query,
      where: {
        orderby: TermObjectsConnectionOrderbyEnum.Count,
        order: OrderEnum.Desc,
        ...(taxonomy && { taxonomies: [taxonomy] }),
        ...query?.where,
      },
    },
    query: GET_SEARCH_TERM_RESULTS,
  });
  const data = response?.data && {
    terms: response?.data?.terms?.nodes,
  };

  return data;
}

export default fetchGqlSearchTerms;
