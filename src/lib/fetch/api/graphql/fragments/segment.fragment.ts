import { gql } from '@apollo/client';

export const SEGMENT_LIST_PROPS = gql`
  fragment SegmentListProps on Segment {
    id
    link
    title
    segmentContent {
      audio {
        id
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
    segmentDates {
      broadcastDate
    }
  }
`;
