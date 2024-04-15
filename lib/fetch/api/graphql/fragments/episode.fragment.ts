import { gql } from '@apollo/client';

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
        id
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
                    node {
                      id
                      link
                      ... on Post {
                        title
                      }
                      ... on Segment {
                        title
                      }
                    }
                  }
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
`;
