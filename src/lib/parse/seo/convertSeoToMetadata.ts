import type { Metadata } from "next";
import type { Maybe, PostTypeSeo, TaxonomySeo } from "@/interfaces";
import type { Robots } from "next/dist/lib/metadata/types/metadata-types";

export function convertSeoToMetadata(
  seo?: Maybe<PostTypeSeo> | Maybe<TaxonomySeo>,
  parent?: Metadata,
) {
  if (!seo) return parent;

  const {
    canonical,
    title: metaTitle,
    metaDesc,
    metaRobotsNoindex,
    metaRobotsNofollow,
    opengraphTitle,
    opengraphDescription,
    opengraphType,
    opengraphUrl,
    twitterTitle,
    twitterDescription,
  } = seo;
  const md: Metadata = structuredClone(parent) || {};
  const title = metaTitle || opengraphTitle || twitterTitle;
  const description = metaDesc || opengraphDescription || twitterDescription;

  if (canonical) {
    const { pathname } = new URL(canonical);
    md.alternates = md.alternates || {};
    md.alternates.canonical = pathname;
  }

  if (title) {
    md.title = { absolute: title };
    md.openGraph = md.openGraph || {};
    md.openGraph.title = title;
    md.twitter = md.twitter || {};
    md.twitter.title = title;
  }

  if (description) {
    md.description = description;
    md.openGraph = md.openGraph || {};
    md.openGraph.description = description;
    md.twitter = md.twitter || {};
    md.twitter.description = description;
  }

  /* ROBOTS */

  const robotsIndex = metaRobotsNoindex === "index";
  const robotsFollow = metaRobotsNofollow === "follow";
  md.robots = (md.robots || {}) as Robots;
  md.robots.index = robotsIndex;
  md.robots.follow = robotsFollow;
  md.robots.googleBot =
    (typeof md.robots.googleBot !== "string" && md.robots.googleBot) ||
    ({} as { index: boolean; follow: boolean });
  md.robots.googleBot.index = robotsIndex;
  md.robots.googleBot.follow = robotsFollow;

  /* OPEN GRAPH */

  if (opengraphTitle) {
    md.openGraph = md.openGraph || {};
    md.openGraph.title = opengraphTitle;
  }

  if (opengraphDescription) {
    md.openGraph = md.openGraph || {};
    md.openGraph.description = opengraphDescription;
  }

  if (opengraphType) {
    md.openGraph = md.openGraph || {};
    // @ts-expect-error: `type` is missing from one or more of the union types of OpenGraph.
    md.openGraph.type = opengraphType;
  }

  if (opengraphUrl) {
    const { pathname } = new URL(opengraphUrl);
    md.openGraph = md.openGraph || {};
    md.openGraph.url = pathname;
  }

  /* TWITTER CARD */

  if (twitterTitle) {
    md.twitter = md.twitter || {};
    md.twitter.title = twitterTitle;
  }

  if (twitterDescription) {
    md.twitter = md.twitter || {};
    md.twitter.description = twitterDescription;
  }

  return md;
}

export default convertSeoToMetadata;
