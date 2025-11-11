/**
 * @file ui.interface.ts
 *
 * Define interfaces for ui state.
 */

import { AnyAction } from 'redux';
import { IIconsMap } from '@interfaces/icons';
import { ISocialLink } from '@interfaces/social';

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
  icons?: IIconsMap;
}

export interface UiState {
  drawer?: DrawerState;
  player?: PlayerState;
  socialShareMenu?: SocialShareMenuState;
}

export interface UiAction extends AnyAction {
  payload?: {
    ui?: UiState;
  };
}
