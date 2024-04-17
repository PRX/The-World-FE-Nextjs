/**
 * @file StoryCardGrid.style.tsx
 * Styles for Story Card Grid.
 */

import { alpha } from '@mui/material/styles';
import { openSans } from '@theme/fonts';
import { makeStyles } from 'tss-react/mui';

export const storyCardGridStyles = makeStyles()((theme) => ({
  root: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    [theme.breakpoints.up('lg')]: {
      gridTemplateColumns: '1fr 1fr'
    }
  },

  loadingBar: {
    transition: 'transform 400ms ease-out',
    position: 'absolute',
    top: '100%',
    left: 0,
    width: '100%',
    transform: 'translateY(0)'
  },

  isLoading: {
    transform: 'translateY(-100%)'
  },

  heading: {
    display: 'flex',
    alignItems: 'start',
    gap: theme.typography.pxToRem(6)
  },

  title: {
    fontSize: theme.typography.pxToRem(16)
  },

  info: {
    display: 'grid',
    gap: theme.spacing(0.5)
  },

  date: {},

  primaryCategory: {
    display: 'grid',
    gridTemplateColumns: 'min-content 1fr',
    gap: theme.spacing(0.5),
    position: 'relative',
    alignItems: 'center',
    zIndex: 1,
    fontFamily: openSans.style.fontFamily,
    letterSpacing: 'unset',
    textTransform: 'unset'
  },

  primaryCategoryLink: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },

  audio: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    gap: theme.typography.pxToRem(4),
    alignItems: 'center',
    fontSize: '1.25rem'
  },

  audioPlayButton: {
    position: 'absolute',
    inset: 0,
    zIndex: 1,
    fontSize: '5rem',
    padding: 0,
    borderRadius: 0,
    backgroundColor: 'transparent',
    color: alpha(theme.palette.primary.contrastText, 0.7),
    '&:hover': {
      backgroundColor: 'transparent',
      color: alpha(theme.palette.primary.contrastText, 1)
    }
  },

  link: {
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
    textIndent: '-2000vw'
  },

  MuiCardRoot: {
    display: 'grid'
  },

  MuiCardActionAreaRoot: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gridGap: theme.spacing(2),
    alignItems: 'start',
    padding: theme.spacing(2),
    color: theme.palette.primary.main,
    [theme.breakpoints.between('sm', 'lg')]: {
      gridTemplateColumns: '1fr 3fr'
    }
  },

  MuiCardContentRoot: {
    padding: 0,
    color: theme.palette.text.primary
  },

  MuiCardMediaRoot: {
    position: 'relative',
    alignSelf: 'start',
    aspectRatio: '1',
    overflow: 'hidden',
    backgroundColor: theme.palette.primary.main
  },

  MuiCircularProgressRoot: {
    padding: '20%'
  }
}));
