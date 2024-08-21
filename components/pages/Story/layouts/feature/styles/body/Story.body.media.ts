/**
 * @file Story.body.media.ts
 * Body media styles as JSS object.
 */

import { alpha, type Theme } from '@mui/material/styles';

export const storyBodyMediaStyles = (theme: Theme) =>
  ({
    // Iframe styles.
    '& iframe': {
      display: 'block',
      maxWidth: '100%',
      marginInline: 'auto'
    },

    // Reset for img tag dimension attributes.
    '& img:not([width="1"])': {
      maxWidth: '100%',
      height: 'auto',
      margin: '0 auto',
      backgroundColor: theme.palette.grey[200]
    },

    // Media styles.
    '& :where(.file-image, .media, .wp-block-image, .wp-block-embed)': {
      position: 'relative',
      clear: 'both',
      width: '100%',
      marginInline: 0,

      '&:not(.alignleft, .alignright)': {
        marginBlock: theme.typography.pxToRem(32),

        '&:where(.wp-embed-aspect-9-16, .wp-block-embed-tiktok, .wp-block-embed-twitter)':
          {
            rowGap: theme.spacing(2),
            '& .wp-block-embed__wrapper': {
              backgroundColor: theme.palette.background.paper,
              boxShadow: theme.shadows[8],
              borderRadius: '1ch',
              overflow: 'hidden',
              lineHeight: 0
            },
            '&::after': {
              content: '""',
              gridColumn: 'full-width',
              gridRow: 'content',
              height: 'calc(100% - 2rem)',
              alignSelf: 'center',
              backgroundColor: theme.palette.divider,
              backgroundImage: [
                `radial-gradient(circle at bottom, ${theme.palette.background.default}, transparent)`,
                `repeating-radial-gradient(circle at bottom, ${theme.palette.background.default}, ${theme.palette.background.default} 5px, transparent 0, transparent 40px)`
              ].join(','),
              zIndex: -1
            },
            '&:where(.alignfull)': {
              '--embed--gutter': theme.spacing(4)
            },
            '&:not(.alignfull)': {
              '&::after': {
                borderRadius: '1ch'
              }
            }
          }
      },

      '&:where(.alignwide, .alignfull), & .file-full-width-wrapper': {
        transform: 'translateX(-50%)',
        position: 'relative',
        left: '50%',
        width: 'var(--_full-width, 100vw)',

        '& > img': {
          maxHeight: '90vh',
          width: '100%',
          objectFit: 'cover'
        }
      },

      '&.alignwide, & .file-browser-width-wrapper': {
        maxWidth: '1200px'
      },

      '&:where(.aligncenter, .alignleft, .alignright)': {
        marginInline: 'auto'
      },

      '& :where(blockquote)': {
        margin: 0
      },

      '& :where(iframe)': {
        border: 'none'
      },

      '&:where(.wp-block-image, .wp-block-embed)': {
        isolation: 'isolate',
        display: 'grid',
        gridTemplateColumns: [
          '[full-width-start]',
          'var(--embed--gutter, 0)',
          '[content-start] auto [content-end]',
          'var(--embed--gutter, 0)',
          '[full-width-end]'
        ].join(' '),
        gridTemplateRows: '[content-start] 1fr [content-end]',
        rowGap: theme.spacing(1),
        '&:has(.wp-element-caption)': {
          gridTemplateRows:
            '[content-start] 1fr [content-end caption-start] min-content [caption-end]'
        },
        '& > *': {
          gridColumn: 'content'
        },
        '& .wp-block-embed__wrapper': {
          gridRow: 'content',
          width: '100%'
        },
        '& :where(figcaption)': {
          ...theme.typography.caption,
          gridRow: 'caption',
          justifySelf: 'center',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          columnGap: theme.spacing(4),
          rowGap: theme.spacing(1),
          paddingInline: '1ch'
        },
        '&:where(.alignleft, .alignright) :where(figcaption)': {
          paddingInline: theme.spacing(1)
        },
        '&:where(.alignwide, .alignfull) :where(figcaption)': {
          maxWidth: 'var(--container--max-width)'
        },
        '&:where(.wp-block-image) :where(figcaption)': {
          width: '100%'
        },
        '& img': {
          width: '100%'
        },
        '& p': {
          margin: 0
        },
        '& p + p': {
          marginTop: '1rem'
        },
        '& .field-caption': {
          marginTop: '0.25rem'
        },
        '& :where(.image__credit, .media-credit)': {
          display: 'flex',
          gap: '0.25rem',
          fontSize: '0.75rem'
        }
      }
    },

    '& .wp-block-embed:where(.wp-has-aspect-ratio)': {
      '& .wp-block-embed__wrapper': {
        '& iframe': {
          width: '100%',
          height: '100%'
        }
      },
      '&:where(.wp-embed-aspect-9-16)': {
        '& .wp-block-embed__wrapper': {
          justifySelf: 'center',
          aspectRatio: 9 / 16,
          maxWidth: 'calc(80vh * (9 / 16))'
        },
        '&.wp-block-embed-youtube': {
          '& iframe': {
            borderRadius: '1ch'
          }
        }
      },
      '&:where(.wp-embed-aspect-16-9)': {
        '& .wp-block-embed__wrapper': {
          aspectRatio: 16 / 9
        }
      },
      '&:where(.wp-embed-aspect-4-3)': {
        '& .wp-block-embed__wrapper': {
          aspectRatio: 4 / 3
        }
      }
    },

    // Legacy YouTube embed styles.
    '& .media-youtube-video, & :not([class]):has( > iframe:where([src*="youtube"]))':
      {
        position: 'relative',
        height: 0,
        paddingTop: `${(9 / 16) * 100}%`,
        '& iframe': {
          display: 'block',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          border: 0
        }
      },

    // YouTube embeds.
    '& .wp-block-embed-youtube': {},

    // Twitter embeds.
    '& .wp-block-embed-twitter': {
      '& .wp-block-embed__wrapper': {
        justifySelf: 'center',
        minWidth: 300,
        maxWidth: 550,
        borderRadius: 12
      }
    },

    // Facebook embeds.
    '& .fb-post': {
      display: 'block',

      '& > span': {
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto'
      }
    },

    // Instagram embeds.
    '& .instagram-media': {
      marginLeft: 'auto !important',
      marginRight: 'auto !important'
    },

    // Spotify embeds.
    '& .wp-block-embed-spotify:where(.alignwide, .alignfull)': {
      '--_full-width': `calc(100vw - ${theme.spacing(6)})`
    },

    // TikTok embeds.
    '& .wp-block-embed-tiktok': {
      '--embed--tiktok--background-color': theme.palette.background.paper,
      '--embed--tiktok--background-color--hover': alpha(
        theme.palette.background.paper,
        0.5
      ),
      '& .wp-block-embed__wrapper': {
        justifySelf: 'center',
        width: 325
      },
      '& .tiktok-embed': {
        width: '100%',
        aspectRatio: 9 / 16
      },
      '& iframe': {
        width: '100%',
        height: '100%',
        border: 0
      },
      '&:is(.alignleft, .alignright)': {
        width: 325
      }
    },

    [theme.breakpoints.up('md')]: {
      '& :where(.wp-block-image, .wp-block-embed)': {
        '&:where(.aligncenter)': {
          paddingInline: theme.spacing(4)
        }
      },
      '& :is(.media-wysiwyg-align-left, .media-image_on_left, .alignleft)': {
        float: 'left',
        clear: 'left',
        width: '33%',
        marginInlineStart: 0,
        marginInlineEnd: theme.typography.pxToRem(48),
        marginBlockStart: 0,
        marginBlockEnd: theme.typography.pxToRem(32),
        [theme.breakpoints.up(1028)]: {
          marginInlineStart: theme.typography.pxToRem(-16)
        }
      },
      '& :is(.media-wysiwyg-align-right, .media-image_on_right, .alignright)': {
        float: 'right',
        clear: 'right',
        width: '33%',
        marginInlineStart: theme.typography.pxToRem(48),
        marginInlineEnd: 0,
        marginBlockStart: 0,
        marginBlockEnd: theme.typography.pxToRem(32),
        [theme.breakpoints.up(1028)]: {
          marginInlineEnd: theme.typography.pxToRem(-16)
        }
      }
    }
  } as any);
