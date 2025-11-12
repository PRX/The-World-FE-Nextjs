/**
 * Defines segment data interface and types.
 */

import type { Segment } from "@/interfaces/api";

export type PostSegment = Segment & {
  // Add props that were aliased in the query.
};
