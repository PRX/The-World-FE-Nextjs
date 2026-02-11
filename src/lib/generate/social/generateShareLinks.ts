import {
  type ISocialLink,
  type Maybe,
  type SocialShareKey,
  socialShareKeys,
  socialShareTitlesMap,
} from "@/interfaces";

export function generateShareLink(key: SocialShareKey, url: string) {
  const title = socialShareTitlesMap.get(key);
  return {
    key,
    link: {
      url,
      title,
    },
  } as ISocialLink;
}

const socialShareTransformers = new Map<
  SocialShareKey,
  // eslint-disable-next-line no-unused-vars
  (url: string, text?: Maybe<string>) => ISocialLink
>();

socialShareTransformers.set("bluesky", (url) => {
  const shareLinkUrl = new URL("https://bsky.app/intent/compose");

  shareLinkUrl.searchParams.set(
    "text",
    `Check out what's on TheWorld.org: ${url}`,
  );

  return generateShareLink("bluesky", shareLinkUrl.toString());
});

socialShareTransformers.set("twitter", (url, text) => {
  const shareLinkUrl = new URL("http://twitter.com/share");

  shareLinkUrl.searchParams.set("url", url);

  if (text) shareLinkUrl.searchParams.set("text", text);

  return generateShareLink("twitter", shareLinkUrl.toString());
});

socialShareTransformers.set("facebook", (url) => {
  const shareLinkUrl = new URL("http://www.facebook.com/sharer.php");

  shareLinkUrl.searchParams.set("u", url);

  return generateShareLink("facebook", shareLinkUrl.toString());
});

socialShareTransformers.set("linkedin", (url, text) => {
  const shareLinkUrl = new URL("https://www.linkedin.com/shareArticle");

  shareLinkUrl.searchParams.set("mini", "1");
  shareLinkUrl.searchParams.set("url", url);

  if (text) shareLinkUrl.searchParams.set("title", text);

  return generateShareLink("linkedin", shareLinkUrl.toString());
});

socialShareTransformers.set("flipboard", (url, text) => {
  const shareLinkUrl = new URL(
    "https://share.flipboard.com/bookmarklet/popout",
  );

  shareLinkUrl.searchParams.set("v", "2");
  shareLinkUrl.searchParams.set("url", url);
  shareLinkUrl.searchParams.set("utm_campaign", "tools");
  shareLinkUrl.searchParams.set("utm_medium", "article-share");
  shareLinkUrl.searchParams.set("utm_source", "theworld.org");

  if (text) shareLinkUrl.searchParams.set("title", text);

  return generateShareLink("flipboard", shareLinkUrl.toString());
});

socialShareTransformers.set("whatsapp", (url) => {
  const shareLinkUrl = new URL("https://api.whatsapp.com/send");

  shareLinkUrl.searchParams.set(
    "text",
    `Check out what's on TheWorld.org: ${url}`,
  );

  return generateShareLink("whatsapp", shareLinkUrl.toString());
});

socialShareTransformers.set("email", (url, text) => {
  const shareLinkUrl = new URL("mailto:");

  shareLinkUrl.searchParams.set(
    "body",
    `Check out what's on TheWorld.org: ${url}`,
  );

  if (text)
    shareLinkUrl.searchParams.set("subject", `Read "${text}" from The World`);

  return generateShareLink("email", shareLinkUrl.toString());
});

export function generateShareLinks(url: string, text?: Maybe<string>) {
  const linkProtocol = "https";
  const linkHostname = "theworld.org";
  const linkUrl = new URL(url, `${linkProtocol}://${linkHostname}`);

  linkUrl.protocol = linkProtocol;
  linkUrl.hostname = linkHostname;

  const shareLinks = socialShareKeys
    .map((key) => {
      const func = socialShareTransformers.get(key);

      return func?.(linkUrl.toString(), text);
    })
    .filter((v): v is ISocialLink => !!v);

  return shareLinks;
}
