/**
 * @file PlayerProgress.style.ts
 * Styles and theme for PlayerProgress.
 */

import { alpha } from '@mui/material/styles';
import { makeStyles } from 'tss-react/mui';

const trackSize = 5;

export const usePlayerProgressStyles = makeStyles<void, 'root'>()(
  (theme, _params, classes) => ({
    root: {
      display: 'grid',
      position: 'relative',
      height: theme.typography.pxToRem(trackSize),
      backgroundColor: alpha(theme.palette.background.paper, 0.3),
      cursor: 'pointer',
      '&::before': {
        content: "''",
        transition: theme.transitions.create('width', {
          duration: theme.transitions.duration.short,
          easing: theme.transitions.easing.easeOut
        }),
        position: 'absolute',
        top: 0,
        left: 0,
        width: 'calc(var(--loaded, 0) * 100%)',
        height: '100%',
        backgroundColor: alpha(theme.palette.secondary.light, 0.3)
      },
      '&::after': {
        content: "''",
        transition: theme.transitions.create('width', {
          duration: theme.transitions.duration.short,
          easing: theme.transitions.easing.sharp
        }),
        position: 'absolute',
        top: 0,
        left: 0,
        width: 'calc(var(--progress, 0) * 100%)',
        height: '100%',
        backgroundColor: theme.palette.secondary.main
      }
    },
    handle: {
      transition: theme.transitions.create(['scale', 'box-shadow', 'opacity'], {
        duration: theme.transitions.duration.short,
        easing: theme.transitions.easing.easeInOut
      }),
      position: 'absolute',
      top: 0,
      left: 'calc(var(--progress, 0) * 100%)',
      width: theme.typography.pxToRem(trackSize),
      height: theme.typography.pxToRem(trackSize),
      transform: 'translateX(-25%)',
      backgroundColor: theme.palette.secondary.main,
      borderRadius: '50%',
      boxShadow: theme.shadows[0],
      opacity: 0,
      '&::before': {
        transition: theme.transitions.create(['opacity'], {
          duration: theme.transitions.duration.short,
          easing: theme.transitions.easing.easeInOut
        }),
        display: 'inline-block',
        content: 'attr(data-text)',
        position: 'absolute',
        left: '50%',
        bottom: 0,
        transform: 'translate(-50%, 10%) scale(0.3)',
        opacity: 0,
        paddingInline: theme.typography.pxToRem(8),
        backgroundColor: theme.palette.secondary.main,
        border: `3px solid ${theme.palette.secondary.light}`,
        borderRadius: '3rem',
        boxShadow: theme.shadows[2],
        color: theme.palette.secondary.contrastText,
        pointerEvents: 'none'
      },
      [`.${classes.root}:hover &, .${classes.root}[data-scrubbing] &`]: {
        scale: '3',
        boxShadow: theme.shadows[2],
        opacity: 0.9999,
        '&::before': {
          opacity: 0.9999
        }
      }
    }
  })
);
