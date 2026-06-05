import type { NextConfig } from "next";
import { withPlausibleProxy } from "next-plausible";
import { headers } from "./next.headers";
import { redirects } from "./next.redirects";

const nextConfig: NextConfig = withPlausibleProxy({
  src: "https://plausible.io/js/pa-fuF1qi-NfkrB0shZi0Ip8.js",
})({
  output: "standalone",
  trailingSlash: false,
  headers,
  redirects,
  experimental: {
    turbopackFileSystemCacheForDev: false,
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
