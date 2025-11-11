/**
 * @file interfaces/button/button.interface.tsx
 * Interfaces for button.
 */

import type { OverridableStringUnion } from '@mui/types';
import type {
  ButtonPropsColorOverrides,
  IconButtonPropsColorOverrides
} from '@mui/material';

export type IconButtonColors = OverridableStringUnion<
  | 'inherit'
  | 'default'
  | 'primary'
  | 'secondary'
  | 'error'
  | 'info'
  | 'success'
  | 'warning',
  IconButtonPropsColorOverrides
>;

export type ButtonColors = OverridableStringUnion<
  | 'inherit'
  | 'primary'
  | 'secondary'
  | 'error'
  | 'info'
  | 'success'
  | 'warning',
  ButtonPropsColorOverrides
>;

export interface IButton {
  key?: string | number;
  name: string;
  url?: string | URL;
  service?: string;
  itemLinkClass?: string;
  color?: IconButtonColors | ButtonColors;
  icon?: string;
  title?: string;
  children?: IButton[];
  attributes?: { [k: string]: string };
}

export interface IButtonWithUrl extends IButton {
  url: string;
}
