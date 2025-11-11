import { gql } from '@apollo/client';

export const CTA_REGION_PROPS = gql`
  fragment CtaRegionProps on CtaRegion {
    id
    title
    slug
    ctaRegionContent {
      callToActions {
        ...CtaProps
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
    ctaSettings {
      cookieLifespan
    }
    ctaTargeting {
      targetCategories {
        id
      }
      targetPrograms {
        id
      }
      targetContent {
        __typename
        ... on Post {
          id
        }
        ... on Episode {
          id
        }
      }
    }
  }
`;
