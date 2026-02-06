/* eslint-disable no-unused-vars */
/**
 * @file interfaces/contexts/playerContext.interface.ts
 *
 * Interface for player context.
 */

import type { PlayerAudio } from "./PlayerAudio.type";
import type { IPlayerState } from "./IPlayerState";

export interface IPlayerContext {
  audioElm: HTMLAudioElement | null;
  state: IPlayerState;
  play(): void;
  playTrack(index: number): void;
  playAudio(audio: PlayerAudio): void;
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
  setTracks(tracks: PlayerAudio[]): void;
  setVolume(volume: number): number;
  addTrack(track: PlayerAudio): void;
  removeTrack(track: PlayerAudio): void;
  clearPlaylist(): void;
  isQueued(id: string): boolean;
  isCurrentTrack(id: string): boolean;
  isPlaying(id: string): boolean;
}
