/**
 * Fetch Episode data from WP GraphQL API.
 */

import { gql } from "@apollo/client";
import type { Episode, EpisodeIdType, Maybe } from "@/interfaces";
import { getClient } from "@/lib/fetch/api";
import {
  AUDIO_PARENT_PROPS,
  AUDIO_PROPS,
  IMAGE_PROPS,
  POST_SEO_PROPS,
} from "@/lib/fetch/api/graphql";

const CONTRIBUTOR_PROPS = gql`
  fragment ContributorProps on Contributor {
    id
    link
    name
    contributorDetails {
      image {
        ...ImageProps
      }
    }
  }
`;

export const GET_EPISODE = gql`
  query getEpisode($id: ID!, $idType: EpisodeIdType) {
    episode(id: $id, idType: $idType) {
      id
      link
      title
      content
      featuredImage {
        node {
          ...ImageProps
          caption
        }
      }
      programs {
        nodes {
          id
          link
          name
        }
      }
      resourceDevelopmentTags {
        nodes {
          name
        }
      }
      episodeDates {
        broadcastDate
      }
      episodeAudio {
        audio {
          ...AudioProps
          audioFields {
            segmentsList {
              ... on Segment {
                id
                link
                title
                segmentContent {
                  audio {
                    id
                    parent {
                      ...AudioParentProps
                    }
                  }
                }
              }
            }
          }
        }
      }
      episodeContent {
        spotifyPlaylists {
          spotifyPlaylist
        }
      }
      episodeContributors {
        hosts {
          ...ContributorProps
        }
        guests {
          ...ContributorProps
        }
        producers {
          ...ContributorProps
        }
        reporters {
          ...ContributorProps
        }
      }
      seo {
        ...PostSEOProps
      }
    }
  }
  ${CONTRIBUTOR_PROPS}
  ${IMAGE_PROPS}
  ${AUDIO_PROPS}
  ${POST_SEO_PROPS}
  ${AUDIO_PARENT_PROPS}
`;

export async function fetchGqlEpisode(
  id: string,
  idType?: EpisodeIdType,
  authToken?: string,
) {
  const gqlClient = getClient(authToken);
  const response = await gqlClient.query<{
    episode: Maybe<Episode>;
  }>({
    query: GET_EPISODE,
    variables: {
      id,
      idType,
    },
  });
  const episode = response?.data?.episode as Episode;

  if (!episode) return undefined;

  return episode;
}

export default fetchGqlEpisode;
