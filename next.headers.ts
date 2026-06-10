import type { NextConfig } from "next";

const deploymentEnv = process.env.NODE_ENV || "development";

export const headers: NextConfig["headers"] = async () => {
  return deploymentEnv !== "development"
    ? [
        {
          source: "/(.*)",
          headers: [
            {
              key: "Strict-Transport-Security",
              value: "max-age=63072000; includeSubDomains; preload",
            },
            {
              key: "X-XSS-Protection",
              value: "1; mode=block",
            },
            {
              key: "X-Content-Type-Options",
              value: "nosniff",
            },
            {
              key: "Permissions-Policy",
              value: "interest-cohort=()",
            },
            {
              key: "Cache-Control",
              value:
                "public, max-age=3600, s-maxage=3600, stale-while-revalidate=300",
            },
            {
              key: "Content-Security-Policy",
              value: "frame-ancestors https://admin.theworld.org",
            },
          ],
        },
        {
          source: "/_next/static/(.*)",
          headers: [
            {
              key: "Cache-Control",
              value: "public, max-age=31536000, immutable",
            },
          ],
        },
      ]
    : [];
};
