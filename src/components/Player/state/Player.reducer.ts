/**
 * @file Player.reducer.ts
 * Defines reducer for handling player state actions.
 */

import { wrap } from "motion/react";
import type { IPlayerState, PlayerAudio } from "../types";
import {
  PlayerActionTypes as ActionTypes,
  type IPlayerAction,
} from "./Player.actions";
import { clamp } from "lodash";

export const playerInitialState: IPlayerState = {
  playing: false,
  autoplay: true,
  currentTrackIndex: 0,
  tracks: [],
};

export const playerStateReducer = (
  state: IPlayerState,
  action: IPlayerAction,
): IPlayerState => {
  const {
    standalone,
    autoplay,
    playing,
    currentTrackIndex = 0,
    tracks = [],
  } = state;
  let audioTrackIndex: number;
  let isInTracks: boolean;

  switch (action.type) {
    case ActionTypes.PLAYER_HYDRATE:
      return { ...(action.payload as IPlayerState) };

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
        tracks: action.payload as PlayerAudio[],
        currentTrackIndex: Math.max(
          0,
          (action.payload as PlayerAudio[]).findIndex(
            ({ id }: PlayerAudio) => id === tracks[currentTrackIndex]?.id,
          ),
        ),
      };

    case ActionTypes.PLAYER_UPDATE_CURRENT_TRACK_INDEX:
      return {
        ...state,
        currentTrackIndex: Math.max(
          0,
          Math.min(action.payload as number, tracks.length - 1),
        ),
      };

    case ActionTypes.PLAYER_PLAY_EPISODE:
      return {
        ...state,
        currentTrackIndex: Math.max(
          0,
          tracks.findIndex(({ id }) => id === action.payload),
        ),
      };

    case ActionTypes.PLAYER_PLAY_AUDIO:
      audioTrackIndex = tracks.findIndex(
        ({ id }) => id === (action.payload as PlayerAudio).id,
      );
      isInTracks = audioTrackIndex !== -1;

      return {
        ...state,
        ...(isInTracks && { currentTrackIndex: audioTrackIndex }),
        ...(!isInTracks && {
          tracks: [
            ...tracks.slice(0, currentTrackIndex + 1),
            action.payload as PlayerAudio,
            ...tracks.slice(currentTrackIndex + 1),
          ],
          currentTrackIndex: tracks?.length ? currentTrackIndex + 1 : 0,
        }),
        playing: true,
      };

    case ActionTypes.PLAYER_ADD_TRACK:
      return {
        ...state,
        tracks: [...tracks, action.payload as PlayerAudio],
        currentTrackIndex: currentTrackIndex || 0,
      };

    case ActionTypes.PLAYER_REMOVE_TRACK:
      if (!tracks) return state;
      audioTrackIndex = tracks.findIndex(
        ({ id }) => id === (action.payload as PlayerAudio).id,
      );
      return {
        ...state,
        tracks: [
          ...tracks.filter(
            ({ id }) => id !== (action.payload as PlayerAudio).id,
          ),
        ],
        currentTrackIndex:
          audioTrackIndex < currentTrackIndex
            ? currentTrackIndex - 1
            : Math.max(0, Math.min(currentTrackIndex, tracks.length - 2)),
        playing: audioTrackIndex === currentTrackIndex ? false : playing,
      };

    case ActionTypes.PLAYER_REMOVE_ALL_TRACKS:
      return {
        ...state,
        tracks: [],
        currentTrackIndex: 0,
        playing: false,
      };

    case ActionTypes.PLAYER_COMPLETE_CURRENT_TRACK:
      console.log({
        ...state,
        tracks: standalone ? tracks : [
          ...tracks.slice(0, currentTrackIndex),
          ...tracks.slice(currentTrackIndex + 1),
        ],
        currentTrackIndex: standalone ?
          clamp(currentTrackIndex + 1, 0, tracks.length - 1) :
          clamp(currentTrackIndex, 0, tracks.length - 2),
        playing:
          // Not last track...
          tracks.length - 1 !== (standalone ? currentTrackIndex + 1 : currentTrackIndex) &&
          // ...and we are auto playing.
          autoplay,
      })
      return {
        ...state,
        tracks: standalone ? tracks : [
          ...tracks.slice(0, currentTrackIndex),
          ...tracks.slice(currentTrackIndex + 1),
        ],
        currentTrackIndex: standalone ?
          clamp(currentTrackIndex + 1, 0, tracks.length - 1) :
          clamp(currentTrackIndex, 0, tracks.length - 2),
        playing:
          // Not last track...
          tracks.length - 1 !== (standalone ? currentTrackIndex + 1 : currentTrackIndex) &&
          // ...and we are auto playing.
          autoplay,
      };

    case ActionTypes.PLAYER_PLAY_TRACK:
      return {
        ...state,
        currentTrackIndex: action.payload as number,
        playing: true,
      };

    case ActionTypes.PLAYER_NEXT_TRACK:
      return {
        ...state,
        currentTrackIndex: Math.min(currentTrackIndex + 1, tracks.length - 1),
      };

    case ActionTypes.PLAYER_PREVIOUS_TRACK:
      return {
        ...state,
        currentTrackIndex: Math.max(currentTrackIndex - 1, 0),
      };

    default:
      return state;
  }
};
