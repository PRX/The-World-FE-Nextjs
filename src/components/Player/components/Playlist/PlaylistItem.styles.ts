/**
 * @file PlaylistItem.style.ts
 * Styles and theme for PlaylistItem.
 */

import { alpha } from '@mui/material/styles';
import { makeStyles } from 'tss-react/mui';

export const usePlaylistItemStyles = makeStyles<{
  isCurrentTrack: boolean;
  hasLink: boolean;
}>()((theme, { isCurrentTrack, hasLink }) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.typography.pxToRem(8),
    paddingInline: theme.typography.pxToRem(16),
    ...(isCurrentTrack && {
      backgroundColor: alpha(theme.palette.primary.main, 0.1)
    })
  },
  layout: {
    flexGrow: 1,
    position: 'relative',
    display: 'grid',
    gridTemplateColumns: 'min-content auto',
    gap: theme.typography.pxToRem(12),
    alignItems: 'center',
    justifyContent: 'start',
    padding: theme.typography.pxToRem(16),
    ...(hasLink && {
      '&:hover': {
        transition: theme.transitions.create('background-color', {
          duration: theme.transitions.duration.shortest,
          easing: theme.transitions.easing.sharp
        }),
        backgroundColor: alpha(theme.palette.primary.main, 0.1)
      }
    }),
    [theme.breakpoints.down('xs')]: {
      display: 'flex',
      paddingInlineStart: 0
    }
  },
  image: {
    backgroundColor: theme.palette.grey[200],
    lineHeight: 0,
    [theme.breakpoints.down('xs')]: {
      display: 'none'
    }
  },
  text: {
    display: 'grid',
    alignContent: 'center'
  },
  title: {
    display: '-webkit-box',
    fontSize: 'clamp(0.75rem, 5vw, 1rem)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    lineHeight: 1,
    lineClamp: 2,
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical'
  },
  info: {
    lineHeight: 1,
    overflow: 'hidden'
  },
  infoItem: {
    display: 'inline-block',
    whiteSpace: 'nowrap',
    marginInlineEnd: `calc(1ch + ${theme.typography.pxToRem(4)})`,
    '&::before': {
      content: "'\u2022'",
      marginInline: theme.typography.pxToRem(4)
    },
    marginInlineStart: `calc(-1ch - ${theme.typography.pxToRem(4)})`
  },
  link: {
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
    textIndent: '-2000vw'
  },
  controls: {
    fontSize: '1.5em',
    display: 'flex',
    alignItems: 'center',
    gap: theme.typography.pxToRem(4)
  },
  handle: {
    cursor: 'grab',
    [theme.breakpoints.down('xs')]: {
      display: 'none'
    }
  },
  iconButtonRoot: {
    borderRadius: '50%'
  }
}));
