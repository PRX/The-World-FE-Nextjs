/**
 * @file PlayerProgress.reducer.ts
 * Defines reducer for handling player progress actions.
 */

import { IPlayerProgressState } from '../types';
import {
  PlayerActionTypes as ActionTypes,
  IPlayerAction
} from './Player.actions';

export const playerProgressInitialState: IPlayerProgressState = {
  duration: 0,
  played: 0,
  playedSeconds: 0,
  loaded: 0,
  loadedSeconds: 0
};

export const playerProgressStateReducer = (
  state: IPlayerProgressState,
  action: IPlayerAction
): IPlayerProgressState => {
  const { scrubPosition, played, duration } = state;
  const headPosition = scrubPosition || played;

  switch (action.type) {
    case ActionTypes.PLAYER_UPDATE_PROGRESS:
      return {
        ...state,
        ...action.payload
      };

    case ActionTypes.PLAYER_UPDATE_SCRUB_POSITION:
      return { ...state, scrubPosition: action.payload };

    case ActionTypes.PLAYER_UPDATE_PROGRESS_TO_SCRUB_POSITION:
      return {
        ...state,
        played: headPosition,
        playedSeconds: duration * headPosition,
        scrubPosition: undefined
      };

    case ActionTypes.PLAYER_UPDATE_CURRENT_DURATION:
      return {
        ...state,
        duration: action.payload
      };

    default:
      return state;
  }
};
