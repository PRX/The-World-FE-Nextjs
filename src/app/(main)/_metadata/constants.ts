import type { Metadata } from "next";
import type { Facebook } from "next/dist/lib/metadata/types/extra-types";
import type { Robots } from "next/dist/lib/metadata/types/metadata-types";
import type { OpenGraph } from "next/dist/lib/metadata/types/opengraph-types";
import type { Twitter } from "next/dist/lib/metadata/types/twitter-types";

export const SITE_URL = "https://theworld.org";
export const SITE_TITLE = "The World from PRX";
export const SITE_DESCRIPTION =
  "The World is a public radio program that crosses borders and time zones to bring home the stories that matter. A co-production of PRX and GBH.";

export const SITE_ROBOTS: Robots = {
  index: true,
  follow: true,
  nocache: false,
  googleBot: {
    index: true,
    follow: true,
    noimageindex: false,
    "max-video-preview": -1,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
};

export const SITE_OPEN_GRAPH: OpenGraph = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  siteName: SITE_TITLE,
  locale: "en_US",
  type: "website",
};

export const SITE_TWITTER: Twitter = {
  card: "summary_large_image",
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  siteId: process.env.TWITTER_ACCOUNT_ID,
};

export const SITE_FACEBOOK: Facebook = {
  appId: process.env.FB_APP_ID,
  admins: process.env.FB_ADMINS?.split(",").map((v) => v.trim()),
};

export const SITE_METADATA: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  title: {
    default: SITE_TITLE,
    template: "%s | The World from PRX",
  },
  description: SITE_DESCRIPTION,
  robots: SITE_ROBOTS,
  openGraph: SITE_OPEN_GRAPH,
  twitter: SITE_TWITTER,
  facebook: SITE_FACEBOOK,
};
