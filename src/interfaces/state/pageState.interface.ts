/**
 * @file pageState.interface.ts
 *
 * Define interfaces for page state.
 */

import { AnyAction } from 'redux';

export interface PageResourceState {
  type: string;
  id: string;
}

export interface PageState {
  resource?: PageResourceState;
}

export interface PageAction extends AnyAction {
  payload: {
    resource?: PageResourceState;
  };
}
