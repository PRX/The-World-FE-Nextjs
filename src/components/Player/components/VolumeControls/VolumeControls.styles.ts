/**
 * @file VolumeControls.style.ts
 * Styles and theme for VolumeControls.
 */

import { makeStyles } from 'tss-react/mui';

export const useVolumeControlsStyles = makeStyles()(theme => ({
  root: {
    display: 'grid',
    gridTemplateColumns: '1fr min-content',
    gap: theme.typography.pxToRem(8),
    alignItems: 'center',
    width: '150px',
    '--track-opacity': 0,
    '&:hover': {
      '--track-opacity': 1
    }
  },
  track: {
    transition: theme.transitions.create('opacity', {
      duration: theme.transitions.duration.short,
      easing: theme.transitions.easing.sharp
    }),
    '@media (hover: hover)': {
      opacity: 'var(--track-opacity)'
    }
  },
  iconRoot: {
    fontSize: 'inherit'
  }
}));
