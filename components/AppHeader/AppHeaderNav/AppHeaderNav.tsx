/**
 * @file AppHeaderNav.tsx
 * Component for app header nav.
 */

import type {
  ButtonColors,
  IButtonWithUrl,
  IconButtonColors,
  RootState
} from '@interfaces';
import { useEffect, useState } from 'react';
import { useStore } from 'react-redux';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { ThemeProvider } from '@mui/styles';
import { FavoriteSharp } from '@mui/icons-material';
import { isLocalUrl } from '@lib/parse/url';
import { handleButtonClick } from '@lib/routing';
import { getAppDataMenu } from '@store/reducers';
import { appHeaderNavTheme, appHeaderNavStyles } from './AppHeaderNav.styles';

const iconComponentMap = new Map();
iconComponentMap.set('heart', FavoriteSharp);

const renderIcon = (icon: string) => {
  const IconComponent = iconComponentMap.get(icon);
  return IconComponent ? <IconComponent /> : null;
};

export const AppHeaderNav = () => {
  const store = useStore<RootState>();
  const state = store.getState();
  const [supportsAnimationTimeline, setSupportsAnimationTimeline] =
    useState(false);
  const headerNav = getAppDataMenu(state, 'headerNav');
  const { classes, cx } = appHeaderNavStyles();
  const menuItems = headerNav
    ?.filter((v): v is IButtonWithUrl => !!v.url)
    .map(({ url, ...other }) => ({
      ...other,
      url: new URL(url, 'https://theworld.org')
    }))
    .map(({ service, ...other }) => {
      if (!service) return other;

      const servicesOptions = new Map([
        [
          'prx:give',
          {
            icon: 'heart',
            color: 'secondary',
            sticky: supportsAnimationTimeline
          }
        ]
      ]);
      const options = servicesOptions.get(service);

      return {
        ...other,
        ...options,
        service
      };
    });

  const renderMenuItem = ({
    key,
    color,
    icon,
    name,
    url,
    sticky,
    attributes,
    itemLinkClass = ''
  }) => (
    <span className={cx({ [classes.sticky]: sticky })} key={key}>
      <Button
        sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
        component="a"
        href={isLocalUrl(url.href) ? url.pathname || '/' : url.href}
        onClick={handleButtonClick(url)}
        variant={
          /\bbtn-(text|link)\b/.test(itemLinkClass) ? 'text' : 'contained'
        }
        color={(color as ButtonColors) || 'primary'}
        disableRipple
        disableElevation
        {...(icon && { startIcon: renderIcon(icon) })}
        {...attributes}
      >
        {name}
      </Button>
      {icon ? (
        <IconButton
          sx={{ display: { sm: 'none', xs: 'inline-flex' } }}
          component="a"
          href={url.href}
          onClick={handleButtonClick(url)}
          aria-label={name}
          color={(color as IconButtonColors) || 'default'}
          size="small"
          disableRipple
          {...attributes}
        >
          {renderIcon(icon)}
        </IconButton>
      ) : (
        <Button
          sx={{ display: { sm: 'none', xs: 'inline-flex' } }}
          component="a"
          href={url.href}
          onClick={handleButtonClick(url)}
          variant="text"
          color={(color as ButtonColors) || 'primary'}
          size="small"
          disableRipple
          disableElevation
          {...attributes}
          {...(icon && {
            startIcon: renderIcon(icon)
          })}
        >
          {name}
        </Button>
      )}
    </span>
  );

  useEffect(() => {
    setSupportsAnimationTimeline(CSS.supports('animation-timeline', 'view()'));
  }, []);

  if (!menuItems?.length) return null;

  return (
    <ThemeProvider theme={appHeaderNavTheme}>
      {menuItems.map(renderMenuItem)}
    </ThemeProvider>
  );
};
