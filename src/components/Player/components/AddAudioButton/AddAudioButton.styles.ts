/**
 * @file AddAudioButton.style.ts
 * Styles and theme for AddAudioButton.
 */

import { alpha } from '@mui/material/styles';
import { makeStyles } from 'tss-react/mui';

export const useAddAudioButtonStyles = makeStyles<{
  isQueued: boolean;
  loading: boolean;
}>()((theme, { isQueued, loading }) => ({
  root: {
    borderRadius: '50%',
    padding: '0.35em',
    ...(!isQueued && {
      backgroundColor: 'transparent',
      color: theme.palette.success.contrastText,
      ...(loading && {
        backgroundColor: theme.palette.success.main
      }),
      '&:hover': {
        backgroundColor: alpha(theme.palette.success.light, 1)
      }
    }),
    ...(isQueued && {
      backgroundColor: theme.palette.success.main,
      color: theme.palette.success.contrastText,
      '&:hover': {
        backgroundColor: theme.palette.success.light
      }
    })
  },
  circularProgressPrimary: {
    color: 'inherit'
  },
  iconButtonRoot: {},
  iconRoot: {
    fontSize: 'inherit',
    fill: 'currentColor',
    margin: 0
  }
}));
