import type { NextConfig } from "next";

export const headers: NextConfig["headers"] = async () => {
  return [
    {
      source: "/(.*)",
      headers: [
        {
          key: "Cache-Control",
          value:
            "public, max-age=3600, s-maxage=3600, stale-while-revalidate=300",
        },
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
        {
          key: "Content-Security-Policy",
          value: "frame-ancestors https://admin.theworld.org",
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
  ];
};
