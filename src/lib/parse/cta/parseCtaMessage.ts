/**
 * @file parseCtaMessage.ts
 * Helper functions to parse CTA message API data.
 */

import type {
  Newsletter,
  INewsletterOptions,
  ICtaMessage,
  Maybe,
  CallToAction,
} from "@/interfaces";

export const parseNewsletterOptions = (
  data: Newsletter,
  region?: Maybe<string>,
): INewsletterOptions => ({
  listId: data.newsletterOptions?.listId,
  customFields: {
    source: "website",
    ...(region && { "source-placement": region }),
  },
});

export const parseCtaMessage = (
  cta: Maybe<CallToAction>,
  region?: Maybe<string>,
) =>
  cta?.ctaOptions?.ctaType
    ? ({
        id: cta.id,
        type: cta.ctaOptions.ctaType,
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
        ...(cta.ctaOptions.ctaType === "optin" &&
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
        ...(cta.ctaOptions.ctaType === "newsletter" &&
          cta.ctaOptions.newsletterSettings?.newsletter && {
            ...(!cta.ctaOptions.content?.heading && {
              heading: cta.ctaOptions.newsletterSettings.newsletter.title,
            }),
            ...(!cta.ctaOptions.content?.message && {
              message: cta.ctaOptions.newsletterSettings.newsletter.excerpt,
            }),
            action: {
              name:
                cta.ctaOptions.actions?.actionButtonLabel ||
                cta.ctaOptions.newsletterSettings.newsletter.newsletterOptions
                  ?.buttonLabel,
              url: cta.ctaOptions.newsletterSettings.newsletter.link,
            },
            newsletter: cta.ctaOptions.newsletterSettings.newsletter,
            newsletterOptions: parseNewsletterOptions(
              cta.ctaOptions.newsletterSettings.newsletter,
              region,
            ),
          }),
        ...(cta.ctaTargeting && { ...cta.ctaTargeting }),
        ...(region && { region }),
      } as ICtaMessage)
    : undefined;
