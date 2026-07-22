/* eslint-disable no-unused-vars */
/**
 * @file interfaces/contexts/playerContext.interface.ts
 *
 * Interface for player context.
 */

import type { IPlayerState } from "./IPlayerState";
import type { RefObject } from "react";
import type { PlayerTrack } from "./PlayerTrack.type";

export interface IPlayerContext {
  el: RefObject<HTMLMediaElement | HTMLAudioElement | HTMLVideoElement | null>;
  state: IPlayerState;
  play(): void;
  playTrackAt(index: number): void;
  playTrack(audio: PlayerTrack): void;
  pause(): void;
  togglePlayPause(): void;
  enableAutoplay(): void;
  disableAutoplay(): void;
  toggleAutoplay(): void;
  toggleMute(): boolean;
  seekTo(time: number): void;
  seekBy(time: number): void;
  replay(): void;
  forward(): void;
  seekToRelative(time: number): void;
  nextTrack(): void;
  previousTrack(): void;
  setTrack(index: number): void;
  setTracks(tracks: PlayerTrack[]): void;
  setVolume(volume: number): number;
  addTrack(track: PlayerTrack): void;
  removeTrack(track: PlayerTrack): void;
  clearPlaylist(): void;
  isQueued(id: string): boolean;
  isCurrentTrack(id: string): boolean;
  isPlaying(id: string): boolean;
}
