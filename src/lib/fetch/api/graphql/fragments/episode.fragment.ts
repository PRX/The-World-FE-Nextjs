import { gql } from "@apollo/client";
import { AUDIO_PROPS } from "./audio.fragment";

export const EPISODE_CARD_PROPS = gql`
  fragment EpisodeCardProps on Episode {
    id
    link
    date
    title
    excerpt
    featuredImage {
      node {
        ...ImageProps
      }
    }
    episodeDates {
      broadcastDate
    }
    teaserFields {
      teaser
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
              featuredImage {
                node {
                  ...ImageProps
                }
              }
              segmentContent {
                audio {
                  ...AudioProps
                }
              }
            }
          }
        }
      }
    }
    programs(first: 1) {
      nodes {
        id
        link
        name
      }
    }
  }
  ${AUDIO_PROPS}
`;
