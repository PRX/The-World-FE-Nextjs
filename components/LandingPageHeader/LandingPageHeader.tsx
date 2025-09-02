/**
 * @file Sidebar.tsx
 * Component for sidebar elements.
 */

import type { Maybe, MediaItem } from '@interfaces';
import React from 'react';
import Image from 'next/legacy/image';
import { Box, Container, Typography, ThemeProvider } from '@mui/material';
import {
  landingPageHeaderStyles,
  landingPageHeaderTheme
} from './LandingPageHeader.styles';

export interface ILandingPageHeaderProps {
  image?: Maybe<MediaItem>;
  logo?: Maybe<MediaItem>;
  title?: Maybe<string>;
  subhead?: Maybe<string>;
}

export const LandingPageHeader = ({
  image,
  logo,
  title,
  subhead
}: ILandingPageHeaderProps) => {
  const { classes, cx } = landingPageHeaderStyles();
  return (
    <ThemeProvider theme={landingPageHeaderTheme}>
      <Box
        className={cx(classes.root, {
          [classes.withImage]: !!image?.sourceUrl
        })}
      >
        {image?.sourceUrl && (
          <Image
            alt={image.altText || ''}
            src={image.sourceUrl}
            layout="fill"
            objectFit="cover"
            priority
            quality={85}
          />
        )}
        <Box className={classes.content}>
          <Container fixed className={classes.header}>
            {logo?.sourceUrl && (
              <Box className={classes.logo}>
                <Image
                  src={logo.sourceUrl}
                  alt={logo.altText || `Logo for ${title}`}
                  objectFit="cover"
                  width={200}
                  height={200}
                />
              </Box>
            )}
            <Box className={classes.text}>
              <Typography variant="h1">{title}</Typography>
              {subhead && (
                <Typography variant="subtitle1" component="p">
                  {subhead}
                </Typography>
              )}
            </Box>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};
