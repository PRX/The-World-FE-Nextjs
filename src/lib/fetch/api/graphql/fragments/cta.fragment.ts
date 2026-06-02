import { gql } from "@apollo/client";

export const CTA_REGION_PROPS = gql`
  fragment CtaRegionProps on CtaRegion {
    id
    title
    slug
    ctaRegionContent {
      callToActions {
        nodes {
          ...CtaProps
        }
      }
    }
  }
`;

export const CTA_PROPS = gql`
  fragment CtaProps on CallToAction {
    id
    modified
    ctaOptions {
      ctaType
      content {
        heading
        message
      }
      actions {
        actionButtonLabel
        actionButtonUrl
        dismissButtonLabel
      }
      optInSettings {
        optInText
      }
      newsletterSettings {
        newsletter {
          nodes {
            ... on Newsletter {
              id
              title
              link
              newsletterOptions {
                buttonLabel
                listId
                optInText
              }
            }
          }
        }
      }
    }
    ctaSettings {
      cookieLifespan
    }
    ctaTargeting {
      targetCategories {
        nodes {
          id
        }
      }
      targetPrograms {
        nodes {
          id
        }
      }
      targetContent {
        nodes {
          __typename
          id
        }
      }
    }
  }
`;
