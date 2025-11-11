/**
 * @file rootState.interface.ts
 *
 * Define interfaces for RootState.
 */

import { AnyAction } from 'redux';
import { Maybe } from '@interfaces/api';
import { AppDataState } from './appData.interface';
import { ContentDataState } from './contentData.interface';
import { CollectionsState } from './collections.interface';
import { CtaRegionGroupDataState } from './ctaRegionGroupData.interface';
import { MenusDataState } from './menusData.interface';
import { SearchState } from './search.interface';
import { UiState } from './ui.interface';

export interface RootState {
  appData: Maybe<AppDataState>;
  aliasData: ContentDataState;
  contentData: ContentDataState;
  collections: CollectionsState;
  ctaRegionData: CtaRegionGroupDataState;
  menusData: MenusDataState;
  search: SearchState;
  ui: UiState;
}

export interface HydrateAction extends AnyAction {
  payload?: RootState;
}
