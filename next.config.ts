import type { NextConfig } from "next";
import { withPlausibleProxy } from "next-plausible";
import { uid } from "uid";

const nextConfig: NextConfig = withPlausibleProxy({
  subdirectory: uid(6),
  scriptName: uid(),
})({
  trailingSlash: false,
  env: {
    APP_DOMAIN: process.env.APP_DOMAIN,
    API_URL_BASE: process.env.API_URL_BASE,
    WP_REST_ENDPOINT: process.env.WP_REST_ENDPOINT,
    WP_GRAPHQL_ENDPOINT: process.env.WP_GRAPHQL_ENDPOINT,
    CM_API_KEY: process.env.CM_API_KEY,
    CM_API_KEY_28C2ADD24B84C68A: process.env.CM_API_KEY_28C2ADD24B84C68A,
    FB_ACCESS_TOKEN: process.env.FB_ACCESS_TOKEN,
    FB_ADMINS: process.env.FB_ADMINS,
    FB_APP_ID: process.env.FB_APP_ID,
    TWITTER_ACCOUNT_ID: process.env.TWITTER_ACCOUNT_ID,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    deviceSizes: [370, 600, 960, 1280, 1920, 2048, 3840],
    imageSizes: [50, 86, 100, 172, 200, 300, 400, 568, 808],
    qualities: [75, 100],
  },
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
});

export default nextConfig;
