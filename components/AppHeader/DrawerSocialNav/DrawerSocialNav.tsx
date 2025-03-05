/**
 * @file DrawerSocialNav.tsx
 * Component for app drawer social nav.
 */

import type { IButtonWithUrl, RootState } from '@interfaces';
import { useStore } from 'react-redux';
import { IconButton, SvgIcon, Toolbar } from '@mui/material';
import { isLocalUrl } from '@lib/parse/url';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFacebook,
  faInstagram,
  faXTwitter,
  faLinkedin,
  faFlipboard,
  faWhatsapp,
  faBluesky,
  faTiktok
} from '@fortawesome/free-brands-svg-icons';
import { getAppDataMenu } from '@store/reducers';
import { drawerTopNavStyles } from './DrawerSocialNav.styles';

const iconComponentMap = new Map();
[
  ['facebook', <FontAwesomeIcon icon={faFacebook} aria-label="Facebook" />],
  ['instagram', <FontAwesomeIcon icon={faInstagram} aria-label="Instagram" />],
  ['twitter', <FontAwesomeIcon icon={faXTwitter} aria-label="Twitter" />],
  ['linkedin', <FontAwesomeIcon icon={faLinkedin} aria-label="LinkedIn" />],
  ['flipboard', <FontAwesomeIcon icon={faFlipboard} aria-label="Flipboard" />],
  ['whatsapp', <FontAwesomeIcon icon={faWhatsapp} aria-label="WhatsApp" />],
  ['bluesky', <FontAwesomeIcon icon={faBluesky} aria-label="Bluesky" />],
  ['tiktok', <FontAwesomeIcon icon={faTiktok} aria-label="TikTok" />]
].forEach(([key, icon]) => {
  iconComponentMap.set(key, icon);
});

const renderIcon = (icon: string, label: string) => {
  const IconComponent = iconComponentMap.get(icon);

  return (IconComponent && <SvgIcon>{IconComponent}</SvgIcon>) || label;
};

export const DrawerSocialNav = () => {
  const store = useStore<RootState>();
  const state = store.getState();
  const drawerSocialNav = getAppDataMenu(state, 'drawerSocialNav');
  const { classes } = drawerTopNavStyles();

  return (
    (drawerSocialNav && (
      <Toolbar className={classes.root}>
        {drawerSocialNav
          .filter((v): v is IButtonWithUrl => !!v.url)
          .map(({ url, ...other }) => ({
            ...other,
            url: new URL(url, 'https://theworld.org')
          }))
          .map(({ service, ...other }) => {
            if (!service) return other;

            const options = {
              ...(iconComponentMap.has(service) && { icon: service })
            };

            return {
              ...options,
              ...other,
              service
            };
          })
          .map(({ name, url, icon, key, title, attributes }) => (
            <IconButton
              color="inherit"
              href={isLocalUrl(url.href) ? url.pathname || '/' : url.href}
              target="_blank"
              rel="noopener noreferrer"
              key={key}
              disableRipple
              {...attributes}
            >
              {icon ? renderIcon(icon, title || name) : title || name}
            </IconButton>
          ))}
      </Toolbar>
    )) ||
    null
  );
};
