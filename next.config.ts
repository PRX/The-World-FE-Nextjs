import type { NextConfig } from "next";
import { withPlausibleProxy } from "next-plausible";
import { redirects } from "./next.redirects";

const nextConfig: NextConfig = withPlausibleProxy({
  src: "https://plausible.io/js/pa-fuF1qi-NfkrB0shZi0Ip8.js",
})({
  output: "standalone",
  trailingSlash: false,
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
      {
        protocol: "http",
        hostname: "**",
      },
    ],
    deviceSizes: [370, 600, 960, 1280, 1920, 2048, 3840],
    imageSizes: [
      16, 32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048,
      3840,
    ],
    qualities: [75, 100],
  },
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  }, // Tells Turbopack to skip bundling this package and its dependencies
  serverExternalPackages: ["subset-font", "harfbuzzjs"],
});

export default nextConfig;
