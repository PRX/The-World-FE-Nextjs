import { gql } from '@apollo/client';

export const POST_CARD_PROPS = gql`
  fragment PostCardProps on Post {
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
    primaryCategory {
      id
      link
      name
    }
    additionalDates {
      broadcastDate
    }
    additionalMedia {
      audio {
        id
      }
    }
    presentation {
      format
    }
  }
`;
