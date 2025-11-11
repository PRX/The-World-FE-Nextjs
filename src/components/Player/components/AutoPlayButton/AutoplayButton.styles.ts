/**
 * @file AutoplayButton.style.ts
 * Styles and theme for AutoplayButton.
 */

import { alpha } from '@mui/material/styles';
import { makeStyles } from 'tss-react/mui';

export const useAutoplayButtonStyles = makeStyles()(theme => ({
  root: {},

  switchBase: {
    borderRadius: '50%'
  },

  colorPrimary: {
    color: theme.palette.grey[300],
    '&:hover': {
      backgroundColor: alpha(
        theme.palette.primary.main,
        theme.palette.action.hoverOpacity
      ),
      color: theme.palette.primary.main
    }
  }
}));
