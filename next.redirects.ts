import type { NextConfig } from "next";

export const redirects: NextConfig["redirects"] = async () => {
  return [
    /* Host Redirects */
    {
      source: "/:slug*",
      has: [
        {
          type: "host",
          value: "www.theworld.org",
        },
      ],
      destination: "https://theworld.org/:slug*",
      permanent: false,
    },
    {
      source: "/:slug*",
      has: [
        {
          type: "host",
          value: "www2.pri.org",
        },
      ],
      destination: "https://www.prx.org/stations",
      permanent: true,
    },
    {
      source: "/:slug*",
      has: [
        {
          type: "host",
          value: "cf.pri.org",
        },
      ],
      destination: "https://www.prx.org/stations",
      permanent: true,
    },

    /* External Redirects */
    {
      source: "/(give|donate/pris-world)",
      destination: "https://give.prx.org/campaign/804766/donate",
      permanent: false,
    },
    {
      source: "/rss/glohit.xml",
      destination: "https://feeds.theworld.org/categories/global-hit/feed",
      permanent: true,
    },
    {
      source: "/rss/geoquiz.xml",
      destination: "https://feeds.feedburner.com/pri/geo-quiz",
      permanent: true,
    },
    {
      source: "/geo-quiz/feed",
      destination: "https://feeds.feedburner.com/pri/geo-quiz",
      permanent: true,
    },
    {
      source: "/rss/theworld.xml",
      destination: "https://latest-edition.feed.theworld.org/",
      permanent: true,
    },
    {
      source: "/rss/twiw.xml",
      destination: "https://subtitlepod.com/feed/podcast",
      permanent: true,
    },
    {
      source: "/rss/enhancedtech.xml",
      destination: "https://feeds.theworld.org/feed/segmentsworld",
      permanent: true,
    },
    {
      source: "/rss/(science|tech).xml",
      destination:
        "https://feeds.theworld.org/theworld/science-tech-environment/feed",
      permanent: true,
    },
    {
      source: "/rss/:slug*",
      destination: "https://feeds.theworld.org/rss/:slug*",
      permanent: true,
    },

    /* File Redirects */
    {
      source: "/s3/files/:slug*",
      destination: "https://files.theworld.org/s3/files/:slug*",
      permanent: true,
    },
    {
      source: "/kraken/files/:slug*",
      destination: "https://files.theworld.org/kraken/files/:slug*",
      permanent: true,
    },

    /* Sitemap Redirects */
    {
      source: "/sitemap.xml",
      has: [{ type: "query", key: "page", value: "(?<path>.*)" }],
      destination: "https://sitemap.theworld.org/sitemap.xml?page=:path",
      permanent: false,
    },
    {
      source: "/sitemap.xml",
      destination: "https://sitemap.theworld.org/sitemap.xml",
      permanent: false,
    },
    {
      source: "/googlenews.xml",
      destination: "https://sitemap.theworld.org/googlenews.xml",
      permanent: false,
    },
    {
      source: "/google-news-sitemap.xml",
      destination: "https://sitemap.theworld.org/googlenews.xml",
      permanent: true,
    },

    /* Internal Redirects */
    {
      source: "/programs/3704/episodes",
      destination: "/episodes",
      permanent: true,
    },
    {
      source: "/collections/:slug*",
      destination: "/categories/:slug*",
      permanent: true,
    },
    {
      source: "/sections/:slug*",
      destination: "/categories/:slug*",
      permanent: true,
    },
    {
      source: "/series/:slug*",
      destination: "/categories/:slug*",
      permanent: true,
    },
    {
      source: "/verticals/:slug*",
      destination: "/categories/:slug*",
      permanent: true,
    },
    {
      source: "/people/:slug*",
      destination: "/contributors/:slug*",
      permanent: true,
    },
    {
      source: "/newsletters",
      destination: "/newsletters/top-of-the-world",
      permanent: true,
    },
    {
      source: "/subscribe-worlds-daily-newsletter",
      destination: "/newsletters/top-of-the-world",
      permanent: true,
    },
    {
      source: "/ways-listen",
      destination: "/ways-listen-world",
      permanent: true,
    },
    {
      source: "/ukraine",
      destination: "/countries/ukraine",
      permanent: true,
    },
    {
      source: "/abortion",
      destination: "/categories/abortion",
      permanent: true,
    },
    {
      source: "/50-states",
      destination: "/categories/50-states",
      permanent: true,
    },
    {
      source: "/(sacred-?nation)",
      destination: "/categories/sacred-nation",
      permanent: true,
    },
    {
      source: "/(program-list|bbc-world-service).html",
      destination: "/programs",
      permanent: true,
    },
    {
      source: "/music-heard-on-air",
      destination: "/episodes",
      permanent: true,
    },
    {
      source: "/team",
      destination: "/programs/the-world/team",
      permanent: true,
    },
    {
      source: "/(news(?:/latest)?)",
      destination: "/",
      permanent: true,
    },
    {
      source: "/((?:category/)?blogs?)",
      destination: "/",
      permanent: true,
    },
    {
      source: "/search/:query",
      destination: "/explore?search=:query",
      permanent: false,
    },
  ];
};
