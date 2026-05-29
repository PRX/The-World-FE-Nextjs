/**
 * Fetch Program data from CMS API.
 *
 * @param id Program identifier.
 */

import type { Maybe, Program } from "@/interfaces";
import { gql } from "@apollo/client";
import { gqlClient } from "@/lib/fetch/api";
import {
  AUDIO_PROPS,
  EPISODE_CARD_PROPS,
  IMAGE_PROPS,
  POST_CARD_PROPS,
  TAXONOMY_SEO_PROPS,
} from "@/lib/fetch/api/graphql";

const GET_PROGRAM = gql`
  query getProgram($id: ID!, $idType: ProgramIdType) {
    program(id: $id, idType: $idType) {
      id
      link
      slug
      name
      description
      teaserFields {
        teaser
      }
      taxonomyImages {
        imageBanner {
          node {
            ...ImageProps
          }
        }
        logo {
          node {
            ...ImageProps
          }
        }
      }
      landingPage {
        featuredPosts {
          nodes {
            ... on Post {
              ...PostCardProps
            }
          }
        }
      }
      programContributors {
        hosts {
          nodes {
            id
            link
            name
            ... on WithAcfContributorDetails {
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
        team {
          nodes {
            id
            link
            name
            ... on WithAcfContributorDetails {
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
      }
      sponsorship {
        collectionSponsorLinks {
          sponsorLinks {
            url
            title
          }
        }
      }
      seo {
        ...TaxonomySEOProps
      }
      episodes(first: 10) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          cursor
          node {
            ...EpisodeCardProps
          }
        }
      }
    }
  }
  ${POST_CARD_PROPS}
  ${AUDIO_PROPS}
  ${IMAGE_PROPS}
  ${TAXONOMY_SEO_PROPS}
  ${EPISODE_CARD_PROPS}
`;

export async function fetchGqlProgram(id: string, idType?: string) {
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

export default fetchGqlProgram;
