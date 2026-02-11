import { gql } from "@apollo/client";
import { AUDIO_PROPS } from "./audio.fragment";

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
        ...AudioProps
      }
    }
    presentation {
      format
    }
  }
  ${AUDIO_PROPS}
`;
