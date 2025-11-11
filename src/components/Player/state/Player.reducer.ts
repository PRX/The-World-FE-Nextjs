/**
 * @file Player.reducer.ts
 * Defines reducer for handling player state actions.
 */

import { IPlayerState } from '../types';
import {
  PlayerActionTypes as ActionTypes,
  IPlayerAction
} from './Player.actions';

export const playerInitialState: IPlayerState = {
  playing: false,
  autoplay: true,
  currentTime: 0,
  currentDuration: 0,
  muted: false,
  volume: 0.8
};

export const playerStateReducer = (
  state: IPlayerState,
  action: IPlayerAction
): IPlayerState => {
  const {
    autoplay,
    playing,
    currentTrackIndex = 0,
    tracks = [],
    muted,
    currentTime
  } = state;
  let audioTrackIndex: number;
  let isInTracks: boolean;

  switch (action.type) {
    case ActionTypes.PLAYER_HYDRATE:
      return { ...action.payload };

    case ActionTypes.PLAYER_PLAY:
      return { ...state, playing: true };

    case ActionTypes.PLAYER_PAUSE:
      return { ...state, playing: false };

    case ActionTypes.PLAYER_TOGGLE_PLAYING:
      return { ...state, playing: !playing };

    case ActionTypes.PLAYER_AUTOPLAY_ENABLE:
      return { ...state, autoplay: true };

    case ActionTypes.PLAYER_AUTOPLAY_DISABLE:
      return { ...state, autoplay: false };

    case ActionTypes.PLAYER_TOGGLE_AUTOPLAY:
      return { ...state, autoplay: !autoplay };

    case ActionTypes.PLAYER_UPDATE_TRACKS:
      return {
        ...state,
        tracks: action.payload,
        currentTrackIndex: Math.max(
          0,
          action.payload.findIndex(
            ({ guid }) => guid === tracks[currentTrackIndex]?.guid
          )
        )
      };

    case ActionTypes.PLAYER_UPDATE_CURRENT_TRACK_INDEX:
      return {
        ...state,
        currentTrackIndex: Math.max(
          0,
          Math.min(action.payload, tracks.length - 1)
        ),
        currentTime: 0
      };

    case ActionTypes.PLAYER_PLAY_EPISODE:
      return {
        ...state,
        currentTrackIndex: Math.max(
          0,
          tracks.findIndex(({ guid }) => guid === action.payload)
        ),
        currentTime: 0
      };

    case ActionTypes.PLAYER_PLAY_AUDIO:
      audioTrackIndex = tracks.findIndex(
        ({ guid }) => guid === action.payload.guid
      );
      isInTracks = audioTrackIndex !== -1;

      return {
        ...state,
        ...(isInTracks && { currentTrackIndex: audioTrackIndex }),
        ...(!isInTracks && {
          tracks: [
            ...tracks.slice(0, currentTrackIndex + 1),
            action.payload,
            ...tracks.slice(currentTrackIndex + 1)
          ],
          currentTrackIndex: tracks?.length ? currentTrackIndex + 1 : 0
        }),
        currentTime: 0,
        playing: true
      };

    case ActionTypes.PLAYER_ADD_TRACK:
      return {
        ...state,
        tracks: [...tracks, action.payload],
        currentTrackIndex: currentTrackIndex || 0
      };

    case ActionTypes.PLAYER_REMOVE_TRACK:
      if (!tracks) return state;
      audioTrackIndex = tracks.findIndex(
        ({ guid }) => guid === action.payload.guid
      );
      return {
        ...state,
        tracks: [...tracks.filter(({ guid }) => guid !== action.payload.guid)],
        currentTrackIndex:
          audioTrackIndex < currentTrackIndex
            ? currentTrackIndex - 1
            : Math.max(0, Math.min(currentTrackIndex, tracks.length - 2)),
        playing: audioTrackIndex === currentTrackIndex ? false : playing,
        currentTime: audioTrackIndex === currentTrackIndex ? 0 : currentTime
      };

    case ActionTypes.PLAYER_REMOVE_ALL_TRACKS:
      return {
        ...state,
        tracks: undefined,
        currentTrackIndex: undefined,
        currentDuration: 0,
        currentTime: 0,
        playing: false
      };

    case ActionTypes.PLAYER_COMPLETE_CURRENT_TRACK:
      return {
        ...state,
        tracks: [
          ...tracks.slice(0, currentTrackIndex),
          ...tracks.slice(currentTrackIndex + 1)
        ],
        currentTrackIndex:
          tracks.length - 1 > 0
            ? Math.min(tracks.length - 2, currentTrackIndex)
            : undefined,
        currentTime: 0,
        currentDuration: 0,
        playing:
          // Not last track...
          tracks.length - 1 !== currentTrackIndex &&
          // ...and we are auto playing.
          autoplay
      };

    case ActionTypes.PLAYER_PLAY_TRACK:
      return {
        ...state,
        currentTrackIndex: action.payload,
        playing: true,
        currentTime: 0
      };

    case ActionTypes.PLAYER_NEXT_TRACK:
      return {
        ...state,
        currentTrackIndex: Math.min(currentTrackIndex + 1, tracks.length - 1),
        currentTime: 0
      };

    case ActionTypes.PLAYER_PREVIOUS_TRACK:
      return {
        ...state,
        currentTrackIndex: Math.max(currentTrackIndex - 1, 0),
        currentTime: 0
      };

    case ActionTypes.PLAYER_UPDATE_CURRENT_TIME:
      return { ...state, currentTime: action.payload };

    case ActionTypes.PLAYER_UPDATE_CURRENT_DURATION:
      return { ...state, currentDuration: action.payload };

    case ActionTypes.PLAYER_MUTE:
      return { ...state, muted: true };

    case ActionTypes.PLAYER_UNMUTE:
      return { ...state, muted: false };

    case ActionTypes.PLAYER_TOGGLE_MUTED:
      return { ...state, muted: !muted };

    case ActionTypes.PLAYER_UPDATE_VOLUME:
      return { ...state, volume: action.payload };

    default:
      return state;
  }
};
