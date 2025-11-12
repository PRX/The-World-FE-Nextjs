/**
 * @file rootState.interface.ts
 *
 * Define interfaces for RootState.
 */

import type { ContentDataState } from "./contentData.interface";
import type { CollectionsState } from "./collections.interface";
import type { CtaRegionGroupDataState } from "./ctaRegionGroupData.interface";
import type { SearchState } from "./search.interface";
import type { UiState } from "./ui.interface";

export interface RootState {
  aliasData: ContentDataState;
  contentData: ContentDataState;
  collections: CollectionsState;
  ctaRegionData: CtaRegionGroupDataState;
  search: SearchState;
  ui: UiState;
}

export interface HydrateAction {
  payload?: RootState;
}
