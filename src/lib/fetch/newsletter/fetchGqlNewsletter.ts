/**
 * Fetch Newsletter data from WP GraphQL API.
 */

import type { Newsletter, Maybe } from "@/interfaces";
import { gql } from "@apollo/client";
import { getClient } from "@/lib/fetch/api";
import { IMAGE_PROPS } from "@/lib/fetch/api/graphql";

const GET_NEWSLETTER = gql`
  query getNewsletter($id: ID!, $idType: NewsletterIdType) {
    newsletter(id: $id, idType: $idType) {
      id
      link
      title
      content
      excerpt
      featuredImage {
        node {
          ...ImageProps
        }
      }
      newsletterOptions {
        listId
        buttonLabel
        optInText
      }
    }
  }
  ${IMAGE_PROPS}
`;

export async function fetchGqlNewsletter(
  id: string,
  idType?: string,
  authToken?: string,
) {
  const gqlClient = getClient(authToken);
  const response = await gqlClient.query<{
    newsletter: Maybe<Newsletter>;
  }>({
    query: GET_NEWSLETTER,
    variables: {
      id,
      idType,
    },
  });
  const newsletter = response?.data?.newsletter;

  if (!newsletter) return undefined;

  return newsletter;
}

export default fetchGqlNewsletter;
