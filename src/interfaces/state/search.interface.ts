/**
 * @file search.interface.ts
 *
 * Define interfaces for search state.
 */

import { AnyAction } from 'redux';
import { ContentNodeConnection } from '@interfaces/api';

export const searchFacetKeys = ['posts', 'episodes', 'segments'] as const;
export type SearchFacet = (typeof searchFacetKeys)[number];
export type SearchFacetAll = (typeof searchFacetKeys)[number] | 'all';

// eslint-disable-next-line no-unused-vars
export type SearchQueryCursors = { [key in SearchFacet]?: string };

export type SearchQueryProps = {
  query: string;
  facet?: SearchFacetAll;
  cursors?: SearchQueryCursors;
};

export type SearchQueryOptions = {
  pageSize?: number;
};

export type SearchQueryState = {
  // Key: Facet name.
  // eslint-disable-next-line no-unused-vars
  [key in SearchFacet]?: ContentNodeConnection;
};

export interface SearchesState {
  // Key: Query string (lowercase).
  [k: string]: SearchQueryState;
}

export interface SearchState {
  open?: boolean;
  query?: string;
  options?: SearchQueryOptions;
  loading?: boolean;
  searches?: SearchesState;
}

export type SearchResultsData = {
  // eslint-disable-next-line no-unused-vars
  [key in SearchFacet]?: ContentNodeConnection;
};

export interface SearchAction extends AnyAction {
  payload: {
    search?: SearchState;
    query: string;
    options?: SearchQueryOptions;
    data: SearchResultsData;
  };
}
