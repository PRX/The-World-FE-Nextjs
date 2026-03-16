import type { Taxonomy } from "@/interfaces";
import fetchGqlTaxonomies from "./fetchGqlTaxonomies";

export async function fetchGqlTaxonomy(slug: string) {
  const taxonomies = await fetchGqlTaxonomies();
  const taxonomiesMap = new Map<string, Taxonomy>();

  taxonomies?.nodes.forEach((t: Taxonomy) => {
    const key = t.restBase || t.graphqlPluralName;
    if (key) {
      taxonomiesMap.set(key, t);
    }
  });

  const taxonomy = taxonomiesMap.get(slug);

  return taxonomy;
}

export default fetchGqlTaxonomy;
