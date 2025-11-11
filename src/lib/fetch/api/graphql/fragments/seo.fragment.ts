import { gql } from '@apollo/client';

const SEO_PROPS = `
    canonical
    metaDesc
    metaKeywords
    metaRobotsNofollow
    metaRobotsNoindex
    opengraphDescription
    opengraphTitle
    opengraphImage {
      ...ImageProps
      mimeType
    }
    opengraphUrl
    title
    twitterDescription
    twitterTitle
    twitterImage {
      ...ImageProps
      mimeType
    }
    opengraphType
`;

export const POST_SEO_PROPS = gql`
  fragment PostSEOProps on PostTypeSEO {
    ${SEO_PROPS}
  }
`;

export const TAXONOMY_SEO_PROPS = gql`
  fragment TaxonomySEOProps on TaxonomySEO {
    ${SEO_PROPS}
  }
`;
