import { gql } from "@apollo/client";

export const AUDIO_PARENT_PROPS = gql`
  fragment AudioParentProps on HierarchicalContentNodeToParentContentNodeConnectionEdge {
    node {
      contentTypeName
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

export const AUDIO_PROPS = gql`
  fragment AudioProps on MediaItem {
    id
    title
    date
    sourceUrl
    mediaItemUrl
    duration
    contributors {
      nodes {
        id
        name
        link
      }
    }
    audioFields {
      audioType
      audioTitle
      broadcastDate
      program {
        id
        link
        name
        taxonomyImages {
          logo {
            ...ImageProps
          }
        }
      }
    }
    parent {
      ...AudioParentProps
    }
  }
  ${AUDIO_PARENT_PROPS}
`;
