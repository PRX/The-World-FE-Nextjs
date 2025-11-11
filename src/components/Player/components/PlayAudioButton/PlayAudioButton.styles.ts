/**
 * @file PlayAudioButton.style.ts
 * Styles and theme for PlayAudioButton.
 */

import { makeStyles } from 'tss-react/mui';

export const playAudioButtonStyles = makeStyles<{ audioIsPlaying: boolean }>()(
  (theme, { audioIsPlaying }) => ({
    root: {
      display: 'grid',
      '& > *': {
        gridRow: '1 / -1',
        gridColumn: '1 / -1',
        transition: theme.transitions.create('opacity', {
          duration: theme.transitions.duration.shortest,
          easing: theme.transitions.easing.sharp
        })
      },
      ...(audioIsPlaying && {
        '& > :first-of-type': {
          opacity: 0.99999
        },
        '& > :last-of-type': {
          opacity: 0
        },
        '&:hover > :first-of-type': {
          opacity: 0
        },
        '&:hover > :last-of-type': {
          opacity: 0.99999
        }
      })
    },
    circularProgressPrimary: {
      color: 'inherit'
    },
    iconButtonRoot: {
      borderRadius: '50%',
      padding: '0.35em',
      ...(!audioIsPlaying && {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        '&:hover': {
          backgroundColor: theme.palette.primary.light
        }
      }),
      ...(audioIsPlaying && {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        '&:hover': {
          backgroundColor: theme.palette.primary.light
        }
      })
    },
    iconButtonLabel: {
      display: 'grid',
      '& > *': {
        gridRow: '1 / -1',
        gridColumn: '1 / -1',
        transition: theme.transitions.create('opacity', {
          duration: theme.transitions.duration.shortest,
          easing: theme.transitions.easing.sharp
        })
      }
    },
    iconRoot: {
      fontSize: 'inherit',
      fill: 'currentColor',
      margin: 0
    }
  })
);
