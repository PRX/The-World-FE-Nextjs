/**
 * @file ui.interface.ts
 *
 * Define interfaces for ui state.
 */

import type { ISocialLink } from "@/interfaces/social";

export interface DrawerState {
  open: boolean;
}

export interface PlayerState {
  open: boolean;
  playlistOpen: boolean;
}

export interface SocialShareMenuState {
  shown?: boolean;
  links?: ISocialLink[];
}

export interface UiState {
  drawer?: DrawerState;
  player?: PlayerState;
  socialShareMenu?: SocialShareMenuState;
}

export interface UiAction {
  payload?: {
    ui?: UiState;
  };
}
