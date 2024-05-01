/**
 * @file LedeImage.style.ts
 * Styles for LedeImage.
 */

import { makeStyles } from 'tss-react/mui';

export const ledeImageStyles = makeStyles()((theme) => ({
  root: {
    display: 'grid',
    gridGap: '0.5rem',
    margin: 0
  },

  imageWrapper: {
    position: 'relative',
    overflow: 'hidden',
    paddingTop: `${100 / (16 / 9)}%`,
    borderRadius: theme.spacing(1)
  },

  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%'
  },

  footer: {
    display: 'grid',

    [`${theme.breakpoints.up('lg')}`]: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'start',
      columnGap: theme.spacing(4),
      rowGap: theme.spacing(0.5),
      paddingInline: theme.spacing(1)
    }
  },

  caption: {
    '& > *': {
      margin: 0
    },
    '& > * + *': {
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

  credit: {}
}));
