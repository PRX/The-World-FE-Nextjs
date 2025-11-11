/**
 * @file interfaces/icon/icon.interface.tsx
 * Interfaces for icons.
 */

import SvgIcon from '@mui/material/SvgIcon';

export interface IIconsMap {
  [k: string]: typeof SvgIcon;
}
