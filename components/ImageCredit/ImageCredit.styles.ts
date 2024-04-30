/**
 * @file ImageCredit.style.ts
 * Styles for ImageCredit.
 */

import { makeStyles } from 'tss-react/mui';

export const imageCreditStyles = makeStyles()(() => ({
  root: {
    fontSize: '0.75rem',
    '&::before': {
      content: "'Credit:'",
      marginRight: '0.25rem'
    }
  },
  link: {
    textDecoration: 'none'
  }
}));
