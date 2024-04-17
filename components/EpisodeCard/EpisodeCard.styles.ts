/**
 * @file EpisodeCard.style.tsx
 * Styles for episode card.
 */

import { alpha, createTheme, Theme } from '@mui/material/styles';
import { makeStyles } from 'tss-react/mui';

export const episodeCardStyles = makeStyles()((theme) => {
  const headingProps = {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: 400
  };

  return {
    root: {},

    body: {
      display: 'grid',
      gap: theme.typography.pxToRem(16),
      fontSize: theme.typography.pxToRem(16),
      '& > *': {
        margin: 0
      }
    },

    header: {
      paddingInline: 0,
      paddingBlockStart: theme.spacing(2),
      paddingBlockEnd: theme.spacing(1.5),
      '& h1': {
        ...headingProps
      },
      '& h2': {
        ...headingProps
      },
      '& h3': {
        ...headingProps
      },
      '& h4': {
        ...headingProps
      },
      '& h5': {
        ...headingProps
      },
      '& h6': {
        ...headingProps
      },
      '& svg': {
        marginRight: '0.25rem',
        fill: theme.palette.secondary.main,
        verticalAlign: 'text-bottom'
      }
    },

    imageWrapper: {
      paddingTop: 'unset'
    },

    heading: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'start',
      gap: theme.typography.pxToRem(24),
      color: theme.palette.text.primary
    },

    link: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      overflow: 'hidden',
      textIndent: '-2000vw'
    },

    info: {
      display: 'flex',
      gap: theme.typography.pxToRem(8)
    },

    program: {
      position: 'relative',
      zIndex: 1,
      fontWeight: theme.typography.fontWeightBold
    },

    title: {
      marginTop: theme.typography.pxToRem(8),
      marginBottom: theme.typography.pxToRem(12),
      fontSize: theme.typography.pxToRem(18)
    },

    audio: {
      position: 'relative',
      zIndex: 1
    },

    MuiButtonBaseRoot: {
      fontSize: 'inherit',
      lineHeight: 'inherit'
    },

    MuiCardRoot: {
      color: theme.palette.primary.main
    },

    MuiCardActionsRoot: {
      display: 'grid',
      margin: 0,
      padding: 0
    },

    MuiCardContentRoot: {
      color: theme.palette.text.primary,
      fontWeight: theme.typography.fontWeightBold
    },

    MuiCardMediaRoot: {
      position: 'relative',
      width: '100%',
      height: 0,
      paddingTop: `${(9 / 16) * 100}%`,
      '& > :only-child': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
      }
    },

    MuiListRoot: {
      width: '100%',
      '& :is(.MuiListItemButton-root)': {
        paddingBlock: theme.spacing(0.5)
      }
    },
    MuiListPadding: {
      paddingTop: 0,
      paddingBottom: theme.typography.pxToRem(16)
    }
  };
});

export const episodeCardTheme = (theme: Theme) =>
  createTheme(theme, {
    typography: {
      body1: {
        fontSize: theme.typography.pxToRem(16)
      },
      h2: {
        color: theme.palette.text.primary
      },
      h5: {
        fontSize: theme.typography.pxToRem(18)
      },
      overline: {
        display: 'inline-block',
        padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
        background: theme.palette.grey[200],
        border: `1px solid ${theme.palette.grey[300]}`,
        borderRadius: '12px',
        fontSize: theme.typography.pxToRem(14),
        fontWeight: theme.typography.fontWeightRegular,
        lineHeight: 1
      }
    },
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
            color: theme.palette.primary.main
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
            width: '100%',
            height: 0,
            paddingTop: `${(9 / 16) * 100}%`,
            '& > :only-child': {
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%'
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
            marginLeft: theme.spacing(2),
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
            marginBottom: theme.typography.pxToRem(12)
          }
        }
      }
    }
  });
