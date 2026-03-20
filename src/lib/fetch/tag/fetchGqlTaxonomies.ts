import type { RootQueryToTaxonomyConnection, Taxonomy } from "@/interfaces";
import { gql } from "@apollo/client";
import { gqlClient } from "@/lib/fetch/api";

const GET_TAXONOMIES = gql`
  query getTaxonomies {
    taxonomies (first: 100) {
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

type ReturnTypeMap<T> = T extends true
  ? Map<string, Taxonomy>
  : Taxonomy[] | undefined;

/**
 * Fetch all taxonomies.
 * @param asMap Return as Map object keyed by slug.
 * @returns Array of taxonomy objects, unless asMap flag is true.
 */
export async function fetchGqlTaxonomies<T extends boolean>(
  asMap?: T,
): Promise<ReturnTypeMap<T> | undefined> {
  const response = await gqlClient.query<{
    taxonomies: RootQueryToTaxonomyConnection;
  }>({
    query: GET_TAXONOMIES,
  });
  const data = response?.data?.taxonomies?.nodes;

  if (!data) return undefined;

  const omittedTaxonomies = ["post_format"];
  const taxonomies = data.filter(
    (t: Taxonomy) => !!t.name && !omittedTaxonomies.includes(t.name),
  );

  if (asMap) {
    const taxonomiesMap = new Map<string, Taxonomy>();

    taxonomies?.forEach((t: Taxonomy) => {
      const key = t.restBase || t.graphqlPluralName;
      if (key) {
        taxonomiesMap.set(key, t);
      }
    });

    return taxonomiesMap as ReturnTypeMap<T>;
  }

  return taxonomies as ReturnTypeMap<T>;
}

export default fetchGqlTaxonomies;
