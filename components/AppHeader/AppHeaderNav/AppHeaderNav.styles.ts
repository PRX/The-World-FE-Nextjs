/**
 * @file AppHeaderNav.style.ts
 * Styles for AppHeaderNav.
 */

import { keyframes } from 'tss-react';
import { makeStyles } from 'tss-react/mui';
import { alpha, createTheme, Theme } from '@mui/material/styles';

export const appHeaderNavTheme = (theme: Theme) =>
  createTheme(theme, {
    components: {
      MuiButton: {
        styleOverrides: {
          text: {
            color: theme.palette.primary.contrastText,
            fontWeight: theme.typography.fontWeightBold,
            '&:hover, &:focus-visible': {
              backgroundColor: alpha(theme.palette.primary.contrastText, 0.1)
            }
          }
        }
      }
    }
  });

export const appHeaderNavStyles = makeStyles()((theme) => {
  const stickyOffsetY = theme.spacing(2);
  const stickyOffsetX = theme.spacing(2);
  const headerNavStickyConstantProps = `
      --sticky-box-shadow: ${theme.shadows[4]};
      --sticky-icon-button-scale: 2;
      position: fixed;
      top: 0;
      right: 0;
      padding-inline: ${stickyOffsetX};
      padding-block: ${stickyOffsetY};
      z-index: ${theme.zIndex.fab};
  `;
  const headerNavSticky = keyframes`
    1% {
      ${headerNavStickyConstantProps}
      --sticky-bg-opacity: 0;
      translate: 0 calc((300% + ${stickyOffsetY} * 2) * -1);
    }

    100% {
      ${headerNavStickyConstantProps}
      --sticky-bg-opacity: 1;
      translate: 0 0;
    }
`;

  return {
    root: {
      '@property --sticky-bg-opacity': {
        syntax: '"<number>"',
        inherits: 'true',
        initialValue: 0
      }
    },
    sticky: {
      '--sticky-bg-opacity': 0,
      '--sticky-box-shadow': 'none',
      '--sticky-icon-button-scale': 1,
      isolation: 'isolate',
      animation: `${headerNavSticky} ease both`,
      'animation-timeline': 'view()',
      'animation-range-start': 'exit 100px',
      'animation-range-end': 'exit 400px',
      '& > :not(.MuiIconButton-root)': {
        boxShadow: 'var(--sticky-box-shadow)'
      },
      '& > .MuiIconButton-root': {
        scale: 'var(--sticky-icon-button-scale)'
      },
      '&::before': {
        pointerEvents: 'none',
        content: "''",
        opacity: 'var(--sticky-bg-opacity)',
        position: 'absolute',
        inset: '0 0 -200% -200%',
        zIndex: -1,
        backgroundImage: `radial-gradient(farthest-side at top right, ${alpha(
          theme.palette.background.paper,
          0.6
        )} 30%, transparent)`
      }
    }
  };
});
