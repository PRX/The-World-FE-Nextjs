/**
 * @file App.theme.tsx
 * Theme and styles for App layout.
 */

import { deepmerge } from '@mui/utils';
import {
  createTheme,
  alpha,
  type Theme,
  type Breakpoint
} from '@mui/material/styles';
import { common } from '@mui/material/colors';
import { makeStyles } from 'tss-react/mui';
import { blue, orange, red, green, grey, yellow } from './colors';
import { montserrat, sourceSans3 } from './fonts';

const buttonBorderRadius = '3px';
const buttonBorderWidth = '2px';

export const useAppStyles = makeStyles<{
  playerOpen: boolean;
  playlistOpen: boolean;
}>()((theme, { playerOpen, playlistOpen }) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    paddingBottom: 'var(--footer-padding, 0)'
  },
  content: {
    flexGrow: 1
  },
  uiFooter: {
    position: 'fixed',
    bottom: 0,
    width: '100vw',
    zIndex: theme.zIndex.appBar - 1
  },
  playerWrapper: {
    position: 'relative',
    transform: 'translateY(100%)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.enteringScreen,
      easing: theme.transitions.easing.easeInOut
    }),
    ...(playerOpen && {
      transform: 'translateY(0)'
    })
  },
  playlistWrapper: {
    zIndex: 0,
    position: 'absolute',
    bottom: '100%',
    left: 0,
    right: 0,
    height: 'calc(100vh - 100%)',
    transform: 'translateY(100vh)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.enteringScreen,
      easing: theme.transitions.easing.easeInOut
    }),
    backgroundColor: alpha(theme.palette.background.default, 0.8),
    backdropFilter: 'blur(30px)',
    ...(playlistOpen && {
      transform: 'translateY(0)'
    })
  },
  playlist: {},
  socialShareMenu: {
    position: 'absolute',
    right: theme.spacing(2),
    bottom: `calc(100% + ${theme.spacing(2)})`,
    pointerEvents: 'none'
  },
  loadUnderWrapper: {}
}));

export const headingProps = {
  color: blue[900],
  fontFamily: montserrat.style.fontFamily,
  fontWeight: 700
};

export const baseMuiTheme = createTheme(
  {
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1200,
        xl: 1536
      }
    },
    palette: {
      primary: {
        main: blue[600],
        dark: blue[800]
      },
      secondary: {
        light: orange[400],
        main: orange[500],
        dark: orange[700],
        contrastText: common.black
      },
      error: {
        main: red[500]
      },
      success: {
        main: green[500],
        dark: green[700]
      },
      grey,
      common: {
        black: grey[900]
      },
      background: {
        default: grey.A100
      }
    },
    shape: {
      borderRadius: 0
    },
    typography: {
      fontFamily: sourceSans3.style.fontFamily,
      caption: {
        color: grey[700],
        fontSize: '0.9rem',
        lineHeight: '1.35rem'
      },
      h1: {
        ...headingProps
      },
      h2: {
        ...headingProps
      },
      h3: {
        ...headingProps
      },
      h4: {
        ...headingProps
      },
      h5: {
        ...headingProps
      },
      h6: {
        ...headingProps
      },
      overline: {
        fontSize: '0.875rem',
        fontWeight: 'bold',
        letterSpacing: '0.1rem',
        lineHeight: '1.25rem'
      }
    }
  },
  {
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          html: {
            padding: 0
          },
          body: {
            padding: 0,
            margin: 0,
            '& > svg': {
              position: 'absolute',
              left: '-10000px',
              height: 0,
              width: 0
            }
          }
        }
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 0,
            fontSize: 'inherit'
          }
        }
      }
    }
  }
);

export const appTheme = (theme: Theme) =>
  createTheme(
    deepmerge(theme, {
      shadows: (() => {
        const shadows = [...theme.shadows] as Theme['shadows'];
        shadows[1] = `0 1px 1px 0 ${theme.palette.divider}, 0 0 0 0 rgba(0,0,0,0), 0 0 0 0 rgba(0,0,0,0)`;
        return shadows;
      })(),
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            html: {
              backgroundColor: theme.palette.primary.main
            },
            body: {
              overflowX: 'hidden'
            }
          }
        },
        MuiAppBar: {
          styleOverrides: {
            root: {}
          }
        },
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: '0.25em',
              fontSize: '1rem'
            },
            contained: {
              fontWeight: 'bold'
            },
            containedSecondary: {
              border: `1px solid ${yellow[500]}`,
              '&:hover': {
                backgroundColor: yellow[500]
              }
            },
            label: {
              textTransform: 'none'
            }
          }
        },
        MuiButtonGroup: {
          styleOverrides: {
            contained: {
              boxShadow: 'none'
            },
            groupedContained: {
              whiteSpace: 'nowrap',
              '&:first-of-type': {
                borderRadius: `${buttonBorderRadius} 0 0 ${buttonBorderRadius}`
              },
              '&:last-of-type': {
                borderRadius: `0 ${buttonBorderRadius} ${buttonBorderRadius} 0`
              }
            },
            groupedContainedSecondary: {
              border: `${buttonBorderWidth} solid ${theme.palette.secondary.light}`,
              '&:not(:last-of-type)': {
                borderRight: `${buttonBorderWidth} solid ${theme.palette.secondary.light}`,
                borderColor: `${theme.palette.secondary.light}`
              },
              '& + *': {
                marginLeft: `-${buttonBorderWidth}`
              },
              '&:hover, &:focus': {
                backgroundColor: theme.palette.secondary.light,
                boxShadow: 'none'
              }
            }
          }
        },

        MuiContainer: {
          styleOverrides: {
            // Add CSS variables for each breakpoint in each container `maxWidth` value.
            ...Object.keys(theme.breakpoints.values).reduce(
              (a, bp) => ({
                ...a,
                [`maxWidth${bp.slice(0, 1).toUpperCase()}${bp.slice(1)}`]: {
                  ...Object.entries(theme.breakpoints.values)
                    .filter(
                      ([, width]) => width <= theme.breakpoints.values[bp]
                    )
                    .reduce(
                      (ai, [bpi, width]) => ({
                        ...ai,
                        [theme.breakpoints.up(bpi as Breakpoint)]: {
                          '--container--max-width': `${Math.max(width, 444)}${
                            theme.breakpoints.unit || 'px'
                          }`
                        }
                      }),
                      {}
                    )
                }
              }),
              {}
            )
          }
        },

        MuiDrawer: {
          styleOverrides: {
            paper: {
              color: theme.palette.primary.contrastText,
              backgroundColor: theme.palette.primary.main
            }
          }
        },
        MuiIconButton: {
          styleOverrides: {
            root: {
              borderRadius: 0,
              fontSize: 'inherit'
            }
          }
        },
        MuiLink: {
          styleOverrides: {
            root: {
              color: theme.palette.primary.main,
              '&:visited': {
                color: theme.palette.primary.main
              },
              '&:hover': {
                color: theme.palette.primary.dark
              }
            }
          }
        }
      }
    })
  );
