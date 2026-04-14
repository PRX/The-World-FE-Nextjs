/**
 * Defines RSS item interfaces and types.
 */

import type Parser from "rss-parser";
import { IRssPodcast } from "./IRssPodcast";

export type CustomItem = {
  "podcast:value": any;
  "podcast:transcript": any;
  itunes: any;
  "itunes:episodeType": string;
};

export type RssItem = Parser.Item &
  CustomItem & {
    [key: string]: any;
    itunes?: {
      [key: string]: any;
    };
    podcast?: IRssPodcast;
  };
