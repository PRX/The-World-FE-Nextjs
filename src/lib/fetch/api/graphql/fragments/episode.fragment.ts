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
        id
        duration
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
                  id
                  duration
                  parent {
                    node {
                      contentTypeName
                      id
                      link
                      ... on Post {
                        title
                        additionalDates {
                          broadcastDate
                        }
                        featuredImage {
                          node {
                            ...ImageProps
                          }
                        }
                      }
                      ... on Segment {
                        title
                        featuredImage {
                          node {
                            ...ImageProps
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
