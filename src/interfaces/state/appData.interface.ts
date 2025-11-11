/**
 * @file appData.interface.ts
 *
 * Define interfaces for app data state.
 */

import { IApp } from '@interfaces/app';
import { AnyAction } from 'redux';

export interface AppDataState extends IApp {}

export interface AppDataAction extends AnyAction {
  payload?: AppDataState;
}
