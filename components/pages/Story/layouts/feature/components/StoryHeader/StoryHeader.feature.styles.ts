/**
 * @file LandingPageHeader.style.ts
 * Styles for LandingPageHeader.
 */

import { alpha, createTheme, Theme } from '@mui/material/styles';
import { makeStyles } from 'tss-react/mui';

export const storyHeaderTheme = (theme: Theme) =>
  createTheme(theme, {
    typography: {
      h1: {
        color: theme.palette.primary.contrastText,
        fontSize: theme.typography.pxToRem(28),
        textWrap: 'balance',
        [theme.breakpoints.up('sm')]: {
          fontSize: theme.typography.pxToRem(48)
        }
      },
      subtitle1: {
        fontSize: theme.typography.pxToRem(20),
        lineHeight: theme.typography.pxToRem(24),
        [theme.breakpoints.up('sm')]: {
          fontSize: theme.typography.pxToRem(24),
          lineHeight: theme.typography.pxToRem(30)
        }
      }
    },
    components: {
      MuiLink: {
        styleOverrides: {
          root: {
            color: theme.palette.primary.contrastText,
            '&:visited': {
              color: theme.palette.primary.contrastText
            },
            '&:hover': {
              color: theme.palette.secondary.main
            }
          }
        }
      }
    }
  });

export const storyHeaderStyles = makeStyles()((theme) => ({
  root: {
    position: 'relative',
    display: 'grid',
    gridTemplateRows: '1fr max-content',
    alignContent: 'end',
    overflow: 'hidden',
    minHeight: '75vh',
    backgroundColor: theme.palette.primary.light,
    marginBottom: theme.typography.pxToRem(16),
    color: theme.palette.primary.contrastText,
    fontSize: '1.2rem'
  },

  imageWrapper: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '100%',
    zIndex: 0,
    [theme.breakpoints.up('md')]: {
      alignSelf: 'start',
      gridColumn: '1 / -1',
      gridRow: '1 / -1',
      height: '100%'
    }
  },

  image: {
    height: '100%'
  },

  content: {
    position: 'relative',
    isolation: 'isolate',
    gridColumn: '1 / -1',
    gridRow: '2',
    gridGap: theme.typography.pxToRem(16),
    width: '100%',
    textShadow: `1px 1px 6px ${alpha(
      theme.palette.common.black,
      0.3
    )}, 1px 1px 3px ${alpha(theme.palette.common.black, 0.4)}`,
    '&::after': {
      content: '""',
      position: 'absolute',
      inset: '-4rem 0 0',
      zIndex: -1,
      backgroundImage: `linear-gradient(${alpha(
        theme.palette.primary.dark,
        0
      )}, ${alpha(theme.palette.primary.dark, 0.6)})`
    }
  },

  header: {
    gridRow: '1 / -1',
    display: 'grid',
    zIndex: 1,
    padding: theme.typography.pxToRem(24)
  },

  teaser: {
    marginTop: theme.typography.pxToRem(16),
    fontSize: theme.typography.pxToRem(24),
    lineHeight: theme.typography.pxToRem(30)
  },

  byline: {
    padding: 0,
    margin: 0,
    listStyle: 'none'
  },

  bylineItem: {},

  bylineLink: {
    fontWeight: theme.typography.fontWeightBold
  },

  bylinePeople: {},

  bylinePerson: {
    '&::after': {
      content: "', '"
    },
    '&:last-of-type:not(:only-child)::before': {
      content: "' and '"
    },
    '&:last-of-type::after': {
      content: "''"
    }
  },

  date: {
    fontStyle: 'italic'
  },

  info: {
    display: 'grid',
    alignContent: 'start',
    gridGap: theme.typography.pxToRem(4)
  },

  audio: {},

  programLink: {
    fontWeight: theme.typography.fontWeightBold
  },

  categoryLink: {
    fontWeight: theme.typography.fontWeightBold
  },

  footer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    columnGap: '2rem',
    rowGap: '0.5rem',
    marginBottom: theme.typography.pxToRem(16),
    '& p': {
      margin: 0
    },
    '& p + p': {
      marginTop: '1rem'
    },
    '& a': {
      color: theme.palette.primary.main,
      '&:visited': {
        color: theme.palette.primary.main
      },
      '&:hover': {
        color: theme.palette.primary.dark
      }
    }
  },

  caption: {},

  credit: {},

  withImage: {}
}));
