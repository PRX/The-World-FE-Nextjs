import { gql } from "@apollo/client";

export const SEGMENT_LIST_PROPS = gql`
  fragment SegmentListProps on Segment {
    id
    link
    title
    segmentContent {
      audio {
        node{
          id
        }
      }
    }
  }
`;

export const SEGMENT_CARD_PROPS = gql`
  fragment SegmentCardProps on Segment {
    id
    link
    title
    date
    featuredImage {
      node {
        ...ImageProps
      }
    }
    segmentDates {
      broadcastDate
    }
    segmentContent {
      audio {
        node {
          ...AudioProps
        }
      }
    }
  }
`;
