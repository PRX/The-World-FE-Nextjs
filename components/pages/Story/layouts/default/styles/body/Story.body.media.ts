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
      marginLeft: 'auto',
      marginRight: 'auto'
    },

    // Reset for img tag dimension attributes.
    '& img:not([width="1"])': {
      maxWidth: '100%',
      height: 'auto',
      margin: '0 auto',
      backgroundColor: theme.palette.grey[200]
    },

    // Media styles.
    '& :where(.file-image, .media, .wp-block-image, .wp-block-embed, .tw-scroll-gallery-slide)':
      {
        clear: 'both',
        display: 'grid',
        rowGap: theme.spacing(1),
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
                zIndex: -1,
                borderRadius: '1ch'
              }
            }
        },

        '&:where(.aligncenter, .alignleft, .alignright)': {
          maxWidth: 'fit-content',
          width: `calc(100% - ${theme.spacing(6)})`,
          marginInline: 'auto',
          '&:where(.wp-block-embed-tiktok)': {
            maxWidth: 'unset'
          }
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
          }
        },

        '& :where(.content, .tw-scroll-gallery-slide--content)': {
          ...theme.typography.caption,
          display: 'grid',
          rowGap: theme.spacing(0.5),
          '& p': {
            margin: 0
          },
          '& p + p': {
            marginTop: '1rem'
          },
          '& :where(.image__credit, .media-credit)': {
            display: 'flex',
            gap: '0.25rem',
            fontSize: '0.75rem',
            lineHeight: 1
          },
          '& .image__credit-label': {
            marginRight: '0.25rem'
          }
        }
      },

    '& .tw-scroll-gallery': {
      display: 'contents'
    },

    '& .wp-block-embed.wp-has-aspect-ratio': {
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
      '& :where(.media-wysiwyg-align-left, .media-image_on_left, .alignleft)': {
        float: 'left',
        clear: 'left',
        width: '33%',
        marginInlineStart: 0,
        marginInlineEnd: theme.typography.pxToRem(32),
        marginBlockEnd: theme.typography.pxToRem(16)
      },
      '& :where(.media-wysiwyg-align-right, .media-image_on_right, .alignright)':
        {
          float: 'right',
          clear: 'right',
          width: '33%',
          marginInlineStart: theme.typography.pxToRem(32),
          marginInlineEnd: 0,
          marginBlockEnd: theme.typography.pxToRem(16)
        },
      '& :where(.aligncenter)': {
        marginInline: theme.spacing(4)
      }
    }
  } as any);
