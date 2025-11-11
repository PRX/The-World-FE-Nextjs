/**
 * @file TrackInfo.style.ts
 * Styles and theme for TrackInfo.
 */

import { alpha } from '@mui/material/styles';
import { makeStyles } from 'tss-react/mui';

export const styleOptions = {
  thumbHeight: 48
};

export const useTrackInfoStyles = makeStyles<{
  hasLink: boolean;
  hasImage: boolean;
}>()((theme, { hasLink, hasImage }) => ({
  root: {
    position: 'relative',
    overflow: 'hidden',
    padding: theme.typography.pxToRem(16),
    ...(hasLink && {
      '&:hover': {
        transition: theme.transitions.create('background-color', {
          duration: theme.transitions.duration.shortest,
          easing: theme.transitions.easing.sharp
        }),
        backgroundColor: alpha(theme.palette.primary.main, 0.1)
      }
    })
  },
  layout: {
    display: 'grid',
    gap: theme.typography.pxToRem(12),
    alignItems: 'center',
    justifyContent: 'center',
    ...(hasImage && {
      gridTemplateColumns: `min-content auto`
    })
  },
  image: {
    backgroundColor: theme.palette.grey[200],
    lineHeight: 0,
    objectFit: 'cover',
    aspectRatio: 16 / 9
  },
  text: {
    display: 'grid',
    alignContent: 'center'
  },
  title: {
    fontSize: '1rem',
    whiteSpace: 'nowrap',
    lineHeight: 1
  },
  info: {
    whiteSpace: 'nowrap',
    lineHeight: 1
  },
  infoItem: {
    '& + &': {
      '&::before': {
        content: "'\u2022'",
        marginInline: theme.typography.pxToRem(4)
      }
    }
  },
  link: {
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
    textIndent: '-2000vw'
  }
}));
