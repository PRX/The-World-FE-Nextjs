import fetchGqlTaxonomies from "./fetchGqlTaxonomies";

export async function fetchGqlTaxonomy(slug: string) {
  const taxonomies = await fetchGqlTaxonomies(true);

  const taxonomy = taxonomies?.get(slug);

  return taxonomy;
}

export default fetchGqlTaxonomy;
