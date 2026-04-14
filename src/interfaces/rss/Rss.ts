/**
 * Define RSS interface and types.
 */

import type Parser from "rss-parser";
import type { RssItem } from "./RssItem";
import type { IRssPodcast } from "./IRssPodcast";

export type CustomFeed = {
  "podcast:follow": any;
  "podcast:value": any;
  "itunes:type": string;
};

export type Rss = Parser.Output<RssItem> &
  CustomFeed & {
    /**
     * Copyright string.
     */
    copyright?: string;

    /**
     * Podcast namespace object.
     */
    podcast?: IRssPodcast;
  };
