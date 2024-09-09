/**
 * @file appData.ts
 *
 * Reducers for handling app data.
 */

import { HYDRATE } from 'next-redux-wrapper';
import type { AppDataAction, HydrateAction, Maybe } from '@interfaces';
import { AppDataState } from '@interfaces/state';

export const appData = (state: AppDataState, action: AppDataAction) => {
  switch (action?.type) {
    case HYDRATE:
      return { ...state, ...(action as HydrateAction).payload?.appData };
    case 'FETCH_APP_DATA_SUCCESS':
      return {
        ...state,
        ...action.payload
      };

    default:
      return state || null;
  }
};

export const getAppSettings = (state: Maybe<AppDataState>) => state?.settings;
export const getAppDataMenu = (state: Maybe<AppDataState>, menu: string) =>
  state?.menus?.[menu];
export const getAppDataLatestStories = (state: Maybe<AppDataState>) =>
  state?.latestStories;
