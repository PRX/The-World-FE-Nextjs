/**
 * @file LandingPageHeader.style.ts
 * Styles for LandingPageHeader.
 */

import { createTheme, Theme } from '@mui/material/styles';
import { makeStyles } from 'tss-react/mui';

export const bioTheme = (theme: Theme) => createTheme(theme, {});

export const bioStyles = makeStyles()((theme) => ({
  body: {
    ...(theme.typography.body1 as any),
    '& > *': {
      marginBlock: 0
    },
    '& > * + *': {
      marginBlockStart: '1.25em'
    }
  }
}));
