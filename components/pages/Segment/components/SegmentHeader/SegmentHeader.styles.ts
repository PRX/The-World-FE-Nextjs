/**
 * @file AudioHeader.style.tsx
 * Styles for Audio layout.
 */

import { alpha } from '@mui/material/styles';
import { makeStyles } from 'tss-react/mui';

export const audioHeaderStyles = makeStyles()((theme) => ({
  root: {
    fontSize: '1.2rem',

    '&.withImage': {
      isolation: 'isolate',
      display: 'grid',
      gridTemplateRows: '1fr 2fr',
      alignItems: 'end',
      '& > *': {
        gridColumn: '1 / -1',
        gridRow: '1 / -1'
      },
      overflow: 'hidden',
      marginBottom: theme.spacing(1),
      borderRadius: theme.spacing(1),
      color: theme.palette.primary.contrastText,

      '& .MuiTypography-h1': {
        color: 'inherit'
      },

      '& .MuiLink-root': {
        color: theme.palette.primary.contrastText,
        '&:visited': {
          color: theme.palette.primary.contrastText
        },
        '&:hover': {
          color: theme.palette.secondary.main
        }
      }
    }
  },

  lede: {
    position: 'relative',
    aspectRatio: '16 / 9',
    zIndex: -1,
    '&::after': {
      content: '""',
      position: 'absolute',
      inset: 0,
      backgroundImage: `linear-gradient(${alpha(
        theme.palette.primary.dark,
        0.2
      )}, ${alpha(theme.palette.primary.dark, 0.8)})`
    }
  },

  content: {
    '.withImage > :is(&)': {
      gridRow: 2,
      alignSelf: 'stretch',
      display: 'grid',
      gridTemplateRows: '1fr min-content',
      alignItems: 'center',
      padding: theme.spacing(4),
      textShadow: `1px 1px 6px ${alpha(
        theme.palette.common.black,
        0.3
      )}, 1px 1px 3px ${alpha(theme.palette.common.black, 0.4)}`
    }
  },

  title: {
    fontSize: `clamp(${theme.typography.pxToRem(
      32
    )}, 5vw, ${theme.typography.pxToRem(48)})`,
    textWrap: 'balance'
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

  date: {
    fontStyle: 'italic'
  },

  meta: {
    display: 'grid',
    gridTemplateColumns: '1fr 300px',
    alignItems: 'center',
    gap: theme.typography.pxToRem(16),
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'wrap'
    },

    '.withImage &': {
      margin: 0,
      alignItems: 'end'
    }
  },

  info: {
    display: 'grid',
    alignContent: 'start',
    gridGap: theme.typography.pxToRem(4)
  },

  programLink: {
    fontWeight: theme.typography.fontWeightBold
  },

  categoryLink: {
    fontWeight: theme.typography.fontWeightBold
  },

  audio: {
    justifySelf: 'center',
    display: 'flex',
    alignItems: 'center',
    gap: theme.typography.pxToRem(8),

    '.withImage &': {
      justifySelf: 'end',
      backgroundColor: alpha(theme.palette.background.paper, 0.8),
      padding: theme.spacing(2),
      borderRadius: '100vw'
    }
  },

  footer: {
    display: 'grid',

    [`${theme.breakpoints.up('md')}`]: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'start',
      columnGap: theme.spacing(4),
      paddingInline: theme.spacing(1)
    },

    '& p': {
      margin: 0
    },
    paddingInline: theme.spacing(1),
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

  credit: {
    display: 'flex',
    fontSize: '0.75rem',
    '&::before': {
      content: "'Credit:'",
      marginRight: '0.25rem'
    }
  }
}));
