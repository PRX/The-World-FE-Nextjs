/**
 * @file menus.interface.ts
 *
 * Define interfaces for menus.
 */

import { IButton } from '@interfaces/button';
import { AnyAction } from 'redux';

export interface MenusDataState {
  [k: string]: IButton[];
}

export interface MenuDataAction extends AnyAction {
  payload?: MenusDataState;
}
