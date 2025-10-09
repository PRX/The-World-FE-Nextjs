/**
 * @file StoryHeader.default.style.tsx
 * Styles for default Story layout.
 */

import { makeStyles } from 'tss-react/mui';

export const storyHeaderStyles = makeStyles()((theme) => ({
  root: {
    fontSize: '1.2rem'
  },

  heading: {
    display: 'grid',
    gridTemplateColumns: '1fr 300px',
    alignItems: 'start',
    gap: theme.typography.pxToRem(16),
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'wrap'
    }
  },

  title: {
    fontSize: 'clamp(2rem, 5vw, 2.875rem)',
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

  bylinePeople: {},

  bylinePerson: {
    '&:not(:first-of-type):not(:last-of-type)::before': {
      content: "', '"
    },
    '&:last-of-type:not(:only-child)::before': {
      content: "' and '"
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
    gap: theme.typography.pxToRem(8)
  }
}));
