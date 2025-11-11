/**
 * Defines segment data interface and types.
 */

import { Segment } from '@interfaces/api';

export type PostSegment = Segment & {
  // Add props that were aliased in the query.
};
