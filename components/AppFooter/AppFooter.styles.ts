/**
 * @file AppFooter.style.ts
 * Styles for AppFooter.
 */

import { makeStyles } from 'tss-react/mui';

export const appFooterStyles = makeStyles()((theme) => ({
  root: {
    textAlign: 'center'
  },

  container: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gridRowGap: theme.typography.pxToRem(16),
    justifyItems: 'center',

    padding: theme.typography.pxToRem(32),

    '& > p': {
      margin: 0
    }
  },

  twLogo: {
    width: '100%',
    maxWidth: theme.typography.pxToRem(250),
    height: 'auto',
    fill: theme.palette.grey.A200
  },

  prxLogo: {
    width: '100%',
    maxWidth: theme.typography.pxToRem(167),
    height: 'auto'
  },

  gbhLogo: {
    width: '100%',
    maxWidth: theme.typography.pxToRem(104),
    height: 'auto'
  },

  link: {
    color: theme.palette.primary.main,
    '&:is(a)': {
      textDecoration: 'none',
      display: 'block',
      minHeight: '48px',
      minWidth: '48px',
      '&:hover': {
        textDecoration: 'underline'
      }
    },
    '&:visited': {
      color: theme.palette.primary.main
    }
  },

  logos: {
    textAlign: 'center'
  },

  logosTitle: {
    marginTop: 0,
    marginBottom: theme.typography.pxToRem(12),
    fontStyle: 'italic',

    '&::after': {
      content: '":"'
    }
  },

  logoLink: {
    display: 'block'
  },

  logo: {
    height: '100%'
  },

  fundedBy: {},

  fundedByMuiOl: {
    display: 'flex',
    flexDirection: 'column',
    listStyleType: 'none',
    margin: 0,
    padding: 0,
    gridTemplateColumns: `1fr`,
    gridGap: theme.typography.pxToRem(8),
    justifyContent: 'center',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      maxWidth: `${theme.breakpoints.values.md}px`,
      '&:has(li:nth-of-type(4))': {
        maxWidth: `608px` // 2 logos + gap
      }
    }
  },

  fundedByMuiLi: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: '300px',
    height: '100px',
    background: theme.palette.common.white,
    paddingInline: theme.spacing(3),
    lineHeight: 0,
    border: `1px solid ${theme.palette.grey[300]}`,
    [theme.breakpoints.up('md')]: {
      width: '300px',
      height: '100px'
    }
  },

  sponsoredBy: {},

  sponsoredByMuiOl: {
    display: 'grid',
    flexDirection: 'column',
    listStyleType: 'none',
    margin: 0,
    padding: 0,
    gridTemplateColumns: `1fr`,
    gridGap: theme.typography.pxToRem(8),
    justifyContent: 'center'
  },

  sponsoredByMuiLi: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: '300px',
    height: '100px',
    background: theme.palette.common.white,
    border: `1px solid ${theme.palette.grey[300]}`,
    [theme.breakpoints.up('md')]: {
      width: '300px',
      height: '100px'
    }
  },

  footerNav: {},

  footerNavMuiOl: {
    justifyContent: 'center'
  },

  copyright: {}
}));
