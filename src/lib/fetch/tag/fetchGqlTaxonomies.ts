import type { RootQueryToTaxonomyConnection } from "@/interfaces";
import { gql } from "@apollo/client";
import { gqlClient } from "@/lib/fetch/api";

const GET_TAXONOMIES = gql`
  query getTaxonomies {
    taxonomies {
      nodes {
        id
        name
        graphqlSingleName
        graphqlPluralName
        restBase
      }
    }
  }
`;

export async function fetchGqlTaxonomies() {
  const response = await gqlClient.query<{
    taxonomies: RootQueryToTaxonomyConnection;
  }>({
    query: GET_TAXONOMIES,
  });
  const data = response?.data?.taxonomies;

  if (!data) return undefined;

  return data;
}

export default fetchGqlTaxonomies;
