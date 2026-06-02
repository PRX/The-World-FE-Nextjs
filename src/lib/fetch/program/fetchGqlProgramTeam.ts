/**
 * Fetch Program Team data from CMS API.
 *
 * @param id Program identifier.
 */

import type { Maybe, Program } from "@/interfaces";
import { gql } from "@apollo/client";
import { gqlClient } from "@/lib/fetch/api";
import { IMAGE_PROPS, TAXONOMY_SEO_PROPS } from "@/lib/fetch/api/graphql";

const GET_PROGRAM = gql`
  query getProgram($id: ID!, $idType: ProgramIdType) {
    program(id: $id, idType: $idType) {
      id
      name
      slug
      programContributors {
        team {
          nodes {
            id
            link
            name
            contributorDetails {
              position
              image {
                node {
                  ...ImageProps
                }
              }
            }
          }
        }
      }
      seo {
        ...TaxonomySEOProps
      }
    }
  }
  ${IMAGE_PROPS}
  ${TAXONOMY_SEO_PROPS}
`;

export async function fetchGqlProgramTeam(id: string, idType?: string) {
  const response = await gqlClient.query<{
    program: Maybe<Program>;
  }>({
    query: GET_PROGRAM,
    variables: {
      id,
      idType,
    },
  });
  const program = response?.data?.program;

  if (!program) return undefined;

  return program;
}

export default fetchGqlProgramTeam;
