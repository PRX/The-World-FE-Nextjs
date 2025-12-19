/**
 * Defines story data interface and types.
 */

import type { Category, Maybe, Post } from "@/interfaces/api";

export type PostStory = Post & {
  // Add props that were aliased in the query.
};
