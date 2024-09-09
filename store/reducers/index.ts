import type { ContentNode } from '@interfaces';
import { combineReducers } from 'redux';
import { RootState } from '@interfaces/state';
import * as fromAppData from './appData';
import * as fromAliasData from './aliasData';
import * as fromCollections from './collections';
import * as fromContentData from './contentData';
import * as fromCtaRegionGroupData from './ctaRegionGroupData';
import * as fromMenusData from './menusData';
import * as fromSearch from './search';
import * as fromUi from './ui';

export const initialState: RootState = {
  appData: null,
  aliasData: {},
  contentData: {},
  collections: {},
  ctaRegionData: {},
  menusData: {},
  search: {
    open: false,
    loading: false,
    searches: {}
  },
  ui: {
    drawer: {
      open: true
    },
    socialShareMenu: {
      shown: false
    }
  }
};

export const reducers = combineReducers({
  appData: fromAppData.appData,
  aliasData: fromAliasData.aliasData,
  contentData: fromContentData.contentData,
  collections: fromCollections.collections,
  ctaRegionData: fromCtaRegionGroupData.ctaRegionGroupData,
  menusData: fromMenusData.menusData,
  search: fromSearch.search,
  ui: fromUi.ui
});

export const getAppData = (state: RootState) => state?.appData;
export const getSettings = (state: RootState) =>
  fromAppData.getAppSettings(state.appData);
export const getSettingsTimeZone = (state: RootState) =>
  state.appData?.settings?.generalSettingsTimezone;
export const getAppDataMenu = (state: RootState, menu: string) =>
  fromAppData.getAppDataMenu(getAppData(state), menu);
export const getAppDataLatestStories = (state: RootState) =>
  fromAppData.getAppDataLatestStories(getAppData(state));

export const getDataByAlias = (state: RootState, alias: string) =>
  fromAliasData.getAliasData(state.aliasData, alias);

export function getDataByResource<T>(
  state: RootState,
  type?: string,
  id?: string | number
) {
  return fromContentData.getContentData<T>(state.contentData, type, id);
}

export const getContentDataByAlias = (state: RootState, alias: string) => {
  const aliasData = fromAliasData.getAliasData(state.aliasData, alias);
  const { id, type } = aliasData || {};
  return fromContentData.getContentData<ContentNode>(
    state.contentData || {},
    type,
    id as string
  );
};

export function getCollectionData<T>(
  state: RootState,
  type: string | undefined,
  id: string | number | undefined,
  collection: string
) {
  const collectionState = fromCollections.getResourceCollection(
    state.collections,
    type,
    id,
    collection
  );

  return (
    collectionState && {
      ...collectionState,
      items: collectionState.items.map(
        (item) => state.contentData[item.id] as T
      )
    }
  );
}

export const getHomepageData = (state: RootState) => ({
  featuredStory: getCollectionData(
    state,
    'homepage',
    undefined,
    'featured story'
  ),
  featuredStories: getCollectionData(
    state,
    'homepage',
    undefined,
    'featured stories'
  ),
  stories: getCollectionData(state, 'homepage', undefined, 'stories'),
  episodes: getCollectionData(state, 'homepage', undefined, 'episodes'),
  latestStories: getCollectionData(state, 'homepage', undefined, 'latest')
});

export const getCtaRegionData = (
  state: RootState,
  region: string,
  type?: string,
  id?: string | number
) =>
  fromCtaRegionGroupData.getCtaRegionData(
    state.ctaRegionData,
    region,
    type,
    id
  );
export const getCookies = (state: RootState) =>
  fromCtaRegionGroupData.getCookies(state.ctaRegionData);

export const getMenusData = (state: RootState, menu: string) =>
  fromMenusData.getMenusData(state.menusData, menu);

export const getSearchOpen = (state: RootState) =>
  fromSearch.getSearchOpen(state.search);
export const getSearchLoading = (state: RootState) =>
  fromSearch.getSearchLoading(state.search);
export const getSearchQuery = (state: RootState) =>
  fromSearch.getSearchQuery(state.search);
export const getSearchData = (state: RootState, query: string) =>
  fromSearch.getSearchData(state.search, query);

export const getUiDrawerOpen = (state: RootState) =>
  fromUi.getUiDrawerOpen(state.ui);
export const getUiPlayerOpen = (state: RootState) =>
  fromUi.getUiPlayerOpen(state.ui);
export const getUiPlayerPlaylistOpen = (state: RootState) =>
  fromUi.getUiPlayerPlaylistOpen(state.ui);
export const getUiSocialShareMenu = (state: RootState) =>
  fromUi.getUiSocialShareMenu(state.ui);
