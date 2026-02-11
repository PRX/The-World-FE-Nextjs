/**
 * @file interfaces/icon/icon.interface.tsx
 * Interfaces for icons.
 */

export const socialShareKeys = [
  "bluesky",
  "twitter",
  "facebook",
  "linkedin",
  "flipboard",
  "whatsapp",
  "email",
] as const;
export type SocialShareKey = (typeof socialShareKeys)[number];

const socialShareTitles = [
  "Bluesky",
  "Twitter",
  "Facebook",
  "LinkedIn",
  "Flipboard",
  "WhatsApp",
  "Email",
] as const;
export type SocialShareTitle = (typeof socialShareTitles)[number];
export const socialShareTitlesMap = new Map<SocialShareKey, SocialShareTitle>();
socialShareTitlesMap.set("bluesky", "Bluesky");
socialShareTitlesMap.set("twitter", "Twitter");
socialShareTitlesMap.set("facebook", "Facebook");
socialShareTitlesMap.set("linkedin", "LinkedIn");
socialShareTitlesMap.set("flipboard", "Flipboard");
socialShareTitlesMap.set("whatsapp", "WhatsApp");
socialShareTitlesMap.set("email", "Email");

export interface ISocialLink {
  key: SocialShareKey;
  link: {
    title: SocialShareTitle;
    url: string;
  };
}
