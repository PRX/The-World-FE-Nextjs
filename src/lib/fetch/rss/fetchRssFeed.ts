import Parser from "rss-parser";
import type { Rss, RssItem } from "@/interfaces/rss";
import { decoratePodcast } from "./decoratePodcast";

const parser: Parser<Rss, RssItem> = new Parser({
  customFields: {
    feed: [
      "podcast:follow",
      // @ts-expect-error
      ["podcast:value", "podcast:value", { keepArray: true }],
      "itunes:type",
    ],
    item: [
      "podcast:value",
      "itunes:episodeType",
      ["podcast:transcript", "podcast:transcript", { keepArray: true }],
    ],
  },
});

/**
 * Fetch and parse RSS feed URL.
 * @param feedUrl URL to request feed from.
 * @returns Promise for parsed IRss data object.
 */
const fetchRssFeed = async (feedUrl: string) => {
  try {
    const feed = await parser.parseURL(feedUrl);

    const decoratedFeed = decoratePodcast(feed);
    const result = {
      ...decoratedFeed,
      ...(decoratedFeed["itunes:type"] && {
        itunes: {
          ...decoratedFeed.itunes,
          type: decoratedFeed["itunes:type"],
        },
        items: decoratedFeed.items.map((item: RssItem) => ({
          ...item,
          itunes: {
            ...item.itunes,
            episodeType: item["itunes:episodeType"],
          },
        })),
      }),
    };

    if (result.podcast?.follow?.url) {
      try {
        const response = await fetch(result.podcast.follow.url);

        if (!response.ok) {
          throw new Error(`Error fetching follow URL: ${response.status}`);
        }

        const followData = await response.json();

        result.podcast.follow.data = followData;
      } catch (error) {
        // There was a problem fetching follow data. This should not block page rendering. Log as a warning.
        // eslint-disable-next-line no-console
        console.warn(error, "podcast:follow");
      }
    }

    return result;
  } catch (_err) {
    return undefined;
  }
};

export default fetchRssFeed;
