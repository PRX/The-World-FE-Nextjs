/**
 * @file BioHeader.style.ts
 * Styles for BioHeader.
 */

import { alpha } from '@mui/material/styles';
import { makeStyles } from 'tss-react/mui';

export const bioHeaderStyles = makeStyles()((theme) => ({
  root: {
    position: 'relative',
    display: 'grid',
    gridTemplateRows: 'max-content max-content',
    alignItems: 'end',
    maxHeight: '75vh',
    overflow: 'hidden',
    backgroundColor: theme.palette.primary.light,
    marginBottom: theme.typography.pxToRem(16)
  },

  title: {
    fontSize: theme.typography.pxToRem(48)
  },

  subhead: {
    fontSize: 'inherit',
    lineHeight: '1.1'
  },

  position: {
    fontSize: 'inherit',
    lineHeight: '1.1'
  },

  imageWrapper: {
    gridColumn: '1 / -1',
    gridRow: '1 / -1',
    height: '100%',
    zIndex: 0
  },

  content: {
    position: 'relative',
    gridColumn: '1 / -1',
    gridRow: '1 / -1',
    display: 'grid',
    alignItems: 'end',
    // gridTemplateColumns: '1fr 100vw 1fr',
    gridGap: theme.typography.pxToRem(16),
    width: '100%',
    minHeight: '33.33333%',
    padding: theme.typography.pxToRem(32),
    paddingTop: theme.typography.pxToRem(96),
    '&::before, &::after': {
      content: '""',
      position: 'absolute',
      bottom: -1,
      left: -1,
      right: -1,
      zIndex: 0,
      backgroundColor: alpha(theme.palette.background.default, 0.65),
      clipPath: 'polygon(0 0, 100% 66.66666%, 100% 100%, 0 100%)'
    },
    '&::before': {
      height: '110%',
      [theme.breakpoints.down('sm')]: {
        height: '66%'
      }
    },
    '&::after': {
      height: '150%',
      [theme.breakpoints.down('sm')]: {
        height: '80%'
      }
    }
  },

  header: {
    gridRow: '1 / -1',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.typography.pxToRem(16),
    alignItems: 'center',
    zIndex: 1,
    [theme.breakpoints.up('sm')]: {
      alignItems: 'flex-start'
    },
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
      alignItems: 'center'
    }
  },

  text: {
    display: 'grid',
    gridGap: theme.typography.pxToRem(16),
    fontSize: theme.typography.pxToRem(18)
  },

  link: {
    fontWeight: theme.typography.fontWeightBold
  },

  image: {
    flexShrink: 0,
    overflow: 'hidden',
    margin: theme.typography.pxToRem(24),
    borderRadius: '50%',
    backgroundColor: theme.palette.background.default,
    [theme.breakpoints.up('sm')]: {
      marginLeft: 0
    },
    [theme.breakpoints.up('md')]: {
      margin: 0,
      marginRight: theme.typography.pxToRem(24)
    }
  }
}));
