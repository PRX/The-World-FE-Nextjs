/**
 * @file IPlayerState.ts
 * Define state interface used by player.
 */

import type { PlayerAudio } from "./PlayerAudio.type";

export interface IPlayerState {
  /**
   * Standalone player flag. Tracks will not be removed from playlist when completed.
   */
  standalone?: boolean;

  /**
   * Boolean to play or pause track playback.
   */
  playing: boolean;

  /**
   * Boolean to tell player to autoplay next track.
   */
  autoplay: boolean;

  /**
   * Holds the currently playing audio data.
   */
  currentTrackIndex: number;

  /**
   * Holds all the audio data that can be played.
   */
  tracks: PlayerAudio[];

  /**
   * Current volume of the player as a value between 0 and 1.
   */
  volume: number;

  /**
   * Boolean to mute player.
   */
  muted: boolean;
}
