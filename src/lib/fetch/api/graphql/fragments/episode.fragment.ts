import { gql } from "@apollo/client";

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
        node {
          ...AudioProps
          audioFields {
            segmentsList {
              nodes {
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
                      node {
                        ...AudioProps
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

export const EPISODE_CARD_PROPS_WITHOUT_SEGMENTS = gql`
  fragment EpisodeCardPropsWithoutSegments on Episode {
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
        node {
          ...AudioProps
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
