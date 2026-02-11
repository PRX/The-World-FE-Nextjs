import { gql } from "@apollo/client";

export const IMAGE_PROPS = gql`
  fragment ImageProps on MediaItem {
    id
    sourceUrl
    mediaItemUrl
    altText
    mediaDetails {
      width
      height
    }
    imageFields {
      mediaCredit
      mediaCreditUrl
    }
  }
`;
