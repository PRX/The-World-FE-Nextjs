/**
 * Define homepage data interfaces and types.
 */

import type { MenuItem, Program } from "@/interfaces/api";

export type Homepage = Program & {
  menus: Record<"quickLinks", MenuItem[]>;
  youtubePlaylistVideos?: GoogleAppsScript.YouTube.Schema.Video[];
};
