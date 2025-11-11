/**
 * @file collections.interface.ts
 *
 * Define interfaces for collections state.
 */

import { PageInfo } from '@interfaces/api';

export type RefItem = {
  cursor: string;
  id: string;
};

export type CollectionQueryOptions = {
  pageSize?: number;
  cursor?: string;
  exclude?: string[];
};

export interface CollectionState {
  pageInfo: PageInfo;
  items: RefItem[];
  options?: CollectionQueryOptions;
}

export interface CollectionsState {
  // Key: Resource signature.
  [k: string]: {
    // Key: Collection name.
    [k: string]: CollectionState;
  };
}
