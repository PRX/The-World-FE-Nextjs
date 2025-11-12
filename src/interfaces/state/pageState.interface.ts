/**
 * @file pageState.interface.ts
 *
 * Define interfaces for page state.
 */

export interface PageResourceState {
  type: string;
  id: string;
}

export interface PageState {
  resource?: PageResourceState;
}

export interface PageAction {
  payload: {
    resource?: PageResourceState;
  };
}
