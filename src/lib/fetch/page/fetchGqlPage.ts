/**
 * Fetch Page data from CMS API.
 *
 * @param id Page identifier.
 */

import type { Maybe, Page } from "@/interfaces";
import { gql } from "@apollo/client";
import { getClient } from "@/lib/fetch/api";
import { IMAGE_PROPS, POST_SEO_PROPS } from "@/lib/fetch/api/graphql";

export const GET_PAGE = gql`
  query getPage($id: ID!, $idType: PageIdType) {
    page(id: $id, idType: $idType) {
      id
      title
      content
      seo {
        ...PostSEOProps
      }
    }
  }
  ${POST_SEO_PROPS}
  ${IMAGE_PROPS}
`;

export async function fetchGqlPage(
  id: string,
  idType?: string,
  authToken?: string,
) {
  const gqlClient = getClient(authToken);
  const response = await gqlClient.query<{
    page: Maybe<Page>;
  }>({
    query: GET_PAGE,
    variables: {
      id,
      idType,
    },
  });
  const page = response?.data?.page;

  if (!page) return undefined;

  return page;
}

export default fetchGqlPage;
