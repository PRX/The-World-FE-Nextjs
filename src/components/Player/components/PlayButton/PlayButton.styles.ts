/**
 * @file AudioPlayer.style.ts
 * Styles and theme for AudioPlayer.
 */

import { alpha } from '@mui/material/styles';
import { makeStyles } from 'tss-react/mui';

export const usePlayButtonStyles = makeStyles<{ playing: boolean }>()(
  (theme, { playing }) => ({
    root: {
      ...(!playing && {
        color: theme.palette.grey[900],
        backgroundColor: alpha(theme.palette.grey[900], 0.1),
        '&:hover': {
          backgroundColor: alpha(theme.palette.grey[900], 0.3)
        }
      }),
      ...(playing && {
        color: theme.palette.primary.contrastText,
        backgroundColor: theme.palette.primary.main,
        '&:hover': {
          backgroundColor: theme.palette.primary.light
        }
      })
    },
    iconRoot: {
      fontSize: 'inherit'
    }
  })
);
