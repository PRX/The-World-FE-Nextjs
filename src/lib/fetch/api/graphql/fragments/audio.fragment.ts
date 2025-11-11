import { gql } from '@apollo/client';

export const AUDIO_PARENT_PROPS = gql`
  fragment AudioParentProps on HierarchicalContentNodeToParentContentNodeConnectionEdge {
    node {
      id
      link
      date
      ... on Post {
        title
        featuredImage {
          node {
            ...ImageProps
          }
        }
        additionalDates {
          broadcastDate
        }
      }
      ... on Segment {
        title
        featuredImage {
          node {
            ...ImageProps
          }
        }
        segmentDates {
          broadcastDate
        }
      }
      ... on Episode {
        title
        featuredImage {
          node {
            ...ImageProps
          }
        }
        episodeDates {
          broadcastDate
        }
      }
    }
  }
`;
