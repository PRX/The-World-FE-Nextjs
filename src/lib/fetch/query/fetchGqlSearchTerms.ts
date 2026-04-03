/**
 * Fetch taxonomy terms data from WP GraphQL API.
 */

import {
  OrderEnum,
  RootQueryToTermNodeConnection,
  TaxonomyEnum,
  TermObjectsConnectionOrderbyEnum,
  type RootQueryToTagConnectionWhereArgs,
  type RootQueryToTermNodeConnectionWhereArgs,
  type TermNodeConnection,
} from "@/interfaces";
import { gql } from "@apollo/client";
import { upperFirst } from "lodash";
import { getClient } from "@/lib/fetch/api";
import { IMAGE_PROPS } from "@/lib/fetch/api/graphql";
import fetchGqlTaxonomies from "@/lib/fetch/tag/fetchGqlTaxonomies";

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
              ...ImageProps
            }
          }
        }
      }
    }
  }
  ${IMAGE_PROPS}
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
