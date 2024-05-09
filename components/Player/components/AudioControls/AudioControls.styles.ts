/**
 * @file AudioControls.style.ts
 * Styles and theme for AudioControls.
 */

import { alpha } from '@mui/material/styles';
import { makeStyles } from 'tss-react/mui';

export const useAudioControlsStyles = makeStyles()((theme) => ({
  root: {
    position: 'relative',
    isolation: 'isolate',
    display: 'grid',
    gridAutoFlow: 'column',
    alignItems: 'center',
    fontSize: '1.5em',
    filter: 'url(#shadowed-goo)',
    transform: 'translateZ(0)',
    '& > *': {},
    '& > :first-of-type': {
      padding: '0.25em',
      fontSize: '1.5em'
    },
    '&[data-variant="minimal"]': {
      filter: 'none',
      backgroundColor: theme.palette.common.white,
      padding: '2px',
      borderRadius: '2em',
      overflow: 'hidden',
      fontSize: '1.25em',
      '& > *': {
        padding: '0.25em',
        fontSize: '1em',
        backgroundColor: 'transparent',
        color: theme.palette.text.secondary,
        '&:hover': {
          backgroundColor: alpha(theme.palette.primary.main, 0.3),
          color: theme.palette.text.primary
        }
      }
    },
    '&[data-variant="feature"]': {
      alignItems: 'end'
    }
  },

  playAudioButton: {
    '[data-variant="minimal"] &': {
      '&[data-playing]': {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        '&:hover': {
          backgroundColor: theme.palette.primary.light
        }
      }
    },
    '[data-variant="feature"] &': {
      padding: '0.25em',
      fontSize: '1.75em',
      border: `6px solid ${alpha(theme.palette.common.white, 0.5)}`
    }
  },

  addAudioButton: {
    '[data-variant="default"]': {},
    '[data-variant="minimal"] &': {
      '&[data-queued]': {
        color: theme.palette.success.main,
        '&:hover': {
          backgroundColor: alpha(theme.palette.success.main, 0.5)
        }
      }
    },
    '[data-variant="feature"] &': {
      position: 'relative',
      marginLeft: '-0.9em',
      fontSize: '.75em',
      border: `4px solid ${alpha(theme.palette.common.white, 0.5)}`,
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      '&:hover': {
        backgroundColor: theme.palette.primary.light
      },
      '&[data-queued]': {
        backgroundColor: theme.palette.success.main,
        color: theme.palette.success.contrastText,
        '&:hover': {
          backgroundColor: theme.palette.success.light
        }
      }
    }
  }
}));
