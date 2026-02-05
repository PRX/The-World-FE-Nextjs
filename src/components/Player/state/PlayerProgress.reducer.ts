/**
 * @file PlayerProgress.reducer.ts
 * Defines reducer for handling player progress actions.
 */

import type { IPlayerProgressState } from "../types";
import {
  PlayerActionTypes as ActionTypes,
  type IPlayerAction,
} from "./Player.actions";

export const playerProgressInitialState: IPlayerProgressState = {
  played: 0,
  loaded: 0,
  loadedSeconds: 0,
};

export const playerProgressStateReducer = (
  state: IPlayerProgressState,
  action: IPlayerAction,
): IPlayerProgressState => {
  const { scrubPosition, played } = state;
  const headPosition = scrubPosition || played;

  switch (action.type) {
    case ActionTypes.PLAYER_UPDATE_PROGRESS:
      return {
        ...state,
        ...(action.payload as IPlayerProgressState),
      };

    case ActionTypes.PLAYER_UPDATE_SCRUB_POSITION:
      return { ...state, scrubPosition: action.payload as number };

    case ActionTypes.PLAYER_UPDATE_PROGRESS_TO_SCRUB_POSITION:
      return {
        ...state,
        played: headPosition,
        scrubPosition: undefined,
      };

    default:
      return state;
  }
};
