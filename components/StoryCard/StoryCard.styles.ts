/**
 * @file StoryCard.style.tsx
 * Styles for story card.
 */

import { alpha, createTheme, Theme } from '@mui/material/styles';
import { openSans } from '@theme/fonts';
import { makeStyles } from 'tss-react/mui';

export const useStoryCardStyles = makeStyles()((theme) => ({
  root: {
    '& > * + *': {
      display: 'grid',
      marginTop: 0
    }
  },
  heading: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    gap: theme.typography.pxToRem(24),
    marginBottom: theme.typography.pxToRem(8)
  },
  title: {
    marginTop: 0,
    fontSize: theme.typography.pxToRem(20),
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.typography.pxToRem(18)
    },
    lineHeight: '1.3',
    textWrap: 'balance'
  },
  excerpt: {
    '& > :last-child': {
      marginBlockEnd: 0
    }
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
  imageWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    paddingTop: 'unset'
  },
  link: {
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
    textIndent: '-2000vw'
  },
  loadingBar: {
    transition: 'transform 400ms ease-out',
    position: 'absolute',
    top: '100%',
    left: 0,
    width: '100%',
    '.isLoading &': {
      transform: 'translateY(-100%)'
    }
  },
  audio: {
    position: 'relative',
    zIndex: 1
  },
  audioPlayBtn: {
    position: 'relative',
    zIndex: 1,
    fontSize: '5rem',
    padding: 0,
    borderRadius: 0,
    backgroundColor: 'transparent',
    color: alpha(theme.palette.primary.contrastText, 0.7),
    '&:hover': {
      backgroundColor: 'transparent',
      color: alpha(theme.palette.primary.contrastText, 1)
    },
    '.feature &': {
      fontSize: '8rem'
    }
  },
  MuiCardActionAreaRoot: {
    display: 'grid',
    gridTemplateColumns: '1fr 3fr',
    gridGap: `${16}px`,
    alignItems: 'center',
    padding: `${16}px`,
    color: theme.palette.primary.main,
    '.feature &': {
      gridTemplateColumns: '1fr'
    },
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr 2fr'
    }
  },
  MuiCardContentRoot: {
    padding: 0,
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightBold
  },
  MuiCardMediaRoot: {
    position: 'relative',
    overflow: 'hidden',
    display: 'grid',
    backgroundColor: theme.palette.primary.main,
    '& > *': {
      gridRow: '1 / -1',
      gridColumn: '1 / -1'
    },
    alignSelf: 'start',
    aspectRatio: '1',
    '.feature &': {
      aspectRatio: '16 / 9'
    }
  },
  feature: {},
  short: {},
  isLoading: {},
  noImage: {}
}));

export const storyCardTheme = (theme: Theme) =>
  createTheme(theme, {
    components: {
      MuiButtonBase: {
        styleOverrides: {
          root: {
            fontSize: 'inherit',
            lineHeight: 'inherit'
          }
        }
      },
      MuiCard: {
        styleOverrides: {
          root: {
            color: theme.palette.primary.main,
            marginTop: 0,
            borderTop: `1px solid ${theme.palette.grey[200]}`
          }
        }
      },
      MuiCardActions: {
        styleOverrides: {
          root: {
            margin: 0,
            padding: 0
          }
        }
      },
      MuiCardContent: {
        styleOverrides: {
          root: {
            color: theme.palette.text.primary,
            fontWeight: theme.typography.fontWeightBold
          }
        }
      },
      MuiCardMedia: {
        styleOverrides: {
          root: {
            position: 'relative',
            overflow: 'hidden',
            display: 'grid',
            backgroundColor: theme.palette.primary.main,
            '& > *': {
              gridRow: '1 / -1',
              gridColumn: '1 / -1'
            }
          }
        }
      },
      MuiList: {
        styleOverrides: {
          root: {
            width: '100%'
          },
          padding: {
            paddingTop: 0,
            paddingBottom: theme.typography.pxToRem(16)
          }
        }
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            '&:hover': {
              color: theme.palette.primary.main,
              backgroundColor: alpha(
                theme.palette.primary.main,
                theme.palette.action.hoverOpacity
              )
            }
          }
        }
      },
      MuiListItemText: {
        styleOverrides: {
          root: {
            display: 'list-item',
            listStyle: 'disc',
            marginTop: 0,
            marginBottom: 0,
            marginLeft: 16,
            color: theme.palette.grey[500]
          },
          primary: {
            color: theme.palette.primary.main,
            fontWeight: theme.typography.fontWeightBold,
            lineHeight: 1
          }
        }
      },
      MuiTypography: {
        styleOverrides: {
          gutterBottom: {
            marginBottom: theme.typography.pxToRem(4)
          }
        }
      }
    }
  });
