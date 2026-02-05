/**
 * @file IPlayerProgressState.ts
 * Define state interface used for player progress.
 */

export interface IPlayerProgressState {
  /**
   * Position user wants to change playback to as a value between 0 and 1.
   */
  scrubPosition?: number;

  /**
   * How much of the track has played as a value between 0 and 1.
   */
  played: number;

  /**
   * How much of the track has loaded as a value between 0 and 1.
   */
  loaded: number;

  /**
   * How much of the track has loaded in seconds.
   */
  loadedSeconds: number;
}
