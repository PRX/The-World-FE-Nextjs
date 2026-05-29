/**
 * @file parseCtaMessage.ts
 * Helper functions to parse CTA message API data.
 */

import type {
  Newsletter,
  ICtaMessage,
  Maybe,
  CallToAction,
} from "@/interfaces";

export const parseNewsletterOptions = (
  data?: Maybe<Newsletter>,
  region?: Maybe<string>,
) =>
  data && {
    listId: data.newsletterOptions?.listId,
    customFields: {
      source: "website",
      ...(region && { "source-placement": region }),
    },
  };

export const parseCtaMessage = (
  cta: Maybe<CallToAction>,
  region?: Maybe<string>,
) =>
  cta?.ctaOptions?.ctaType
    ? ({
        id: cta.id,
        type: cta.ctaOptions.ctaType.at(0),
        hash: `${cta.id}:${cta.modified}`,
        ...(cta.ctaOptions.content?.heading && {
          heading: cta.ctaOptions.content.heading,
        }),
        ...(cta.ctaOptions.content?.message && {
          message: cta.ctaOptions.content.message,
        }),
        ...(cta.ctaSettings?.cookieLifespan && {
          cookieLifespan: cta.ctaSettings.cookieLifespan,
        }),
        ...(cta.ctaOptions.ctaType.at(0) === "optin" &&
          cta.ctaOptions.optInSettings?.optInText && {
            optinLabel: cta.ctaOptions.optInSettings.optInText,
          }),
        ...(cta.ctaOptions.actions?.actionButtonLabel && {
          action: {
            name: cta.ctaOptions.actions.actionButtonLabel,
            ...(cta.ctaOptions.actions.actionButtonUrl && {
              url: cta.ctaOptions.actions.actionButtonUrl,
            }),
          },
        }),
        ...(cta.ctaOptions.actions?.dismissButtonLabel && {
          dismiss: {
            name: cta.ctaOptions.actions.dismissButtonLabel,
          },
        }),
        ...(cta.ctaOptions.ctaType.at(0) === "newsletter" &&
          cta.ctaOptions.newsletterSettings?.newsletter && {
            ...(!cta.ctaOptions.content?.heading && {
              heading: (
                cta.ctaOptions.newsletterSettings.newsletter
                  .nodes as Newsletter[]
              ).at(0)?.title,
            }),
            ...(!cta.ctaOptions.content?.message && {
              message: (
                cta.ctaOptions.newsletterSettings.newsletter
                  .nodes as Newsletter[]
              ).at(0)?.excerpt,
            }),
            action: {
              name:
                cta.ctaOptions.actions?.actionButtonLabel ||
                (
                  cta.ctaOptions.newsletterSettings.newsletter
                    .nodes as Newsletter[]
                ).at(0)?.newsletterOptions?.buttonLabel,
              url: (
                cta.ctaOptions.newsletterSettings.newsletter
                  .nodes as Newsletter[]
              ).at(0)?.link,
            },
            newsletter: cta.ctaOptions.newsletterSettings.newsletter,
            newsletterOptions: parseNewsletterOptions(
              (
                cta.ctaOptions.newsletterSettings.newsletter
                  .nodes as Newsletter[]
              ).at(0),
              region,
            ),
          }),
        ...(cta.ctaTargeting && { ...cta.ctaTargeting }),
        ...(region && { region }),
      } as ICtaMessage)
    : undefined;
