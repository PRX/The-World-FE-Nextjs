/**
 * @file StoryCard.tsx
 * Component for story card links.
 */

import type React from 'react';
import type {
  // ILink,
  PostStory
} from '@interfaces';
import type { IAudioControlsProps } from '@components/Player/components';
import type { IAudioData } from '@components/Player/types';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/legacy/image';
import { useRouter } from 'next/router';
// import { parse } from 'url';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  LinearProgress,
  Typography
  // CardActions,
  // Link as MuiLink,
  // List,
  // ListItemText,
  // ListItemButton
} from '@mui/material';
import { Label } from '@mui/icons-material';
import { ThemeProvider } from '@mui/styles';
import { ContentLink } from '@components/ContentLink';
import { DateTime } from '@components/DateTime';
import { HtmlContent } from '@components/HtmlContent';
import { useStoryCardStyles, storyCardTheme } from './StoryCard.styles';

const AudioControls = dynamic(() =>
  import('@components/Player/components').then((mod) => mod.AudioControls)
) as React.FC<IAudioControlsProps>;

export interface StoryCardProps {
  data: PostStory;
  feature?: boolean;
  short?: boolean;
  priority?: boolean;
}

export const StoryCard = ({
  data,
  feature,
  short,
  priority
}: StoryCardProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    link,
    title,
    date,
    excerpt,
    featuredImage,
    primaryCategory,
    additionalMedia
  } = data;
  const image = featuredImage?.node;
  const { audio } = additionalMedia || {};
  const audioProps = {
    title,
    queuedFrom: 'Card Controls',
    ...(image?.sourceUrl && { imageUrl: image.sourceUrl }),
    linkResource: data
  } as Partial<IAudioData>;
  const pathname = link && new URL(link).pathname;
  const { classes, cx } = useStoryCardStyles();
  const imageWidth = [
    ['max-width: 600px', '100vw'],
    ['max-width: 960px', '552px'],
    ['max-width: 1280px', '600px'],
    [null, '820px']
  ];
  const sizes = imageWidth.map(([q, w]) => (q ? `(${q}) ${w}` : w)).join(', ');

  // const renderLink = ({ title: linkTitle, url }: ILink) => {
  //   const oUrl = parse(url, true, true);
  //   const LinkComponent = oUrl.host ? MuiLink : ContentLink;
  //   const other = oUrl.host
  //     ? {
  //         href: url
  //       }
  //     : {
  //         data: {
  //           metatags: { canonical: `/${url}` }
  //         }
  //       };

  //   return (
  //     <ListItemButton component={LinkComponent} key={url} {...other}>
  //       <ListItemText>{linkTitle}</ListItemText>
  //     </ListItemButton>
  //   );
  // };

  useEffect(() => {
    const handleRouteChangeStart = (url: string) => {
      setIsLoading(url === pathname);
    };
    const handleRouteChangeEnd = () => {
      setIsLoading(false);
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeEnd);
    router.events.on('routeChangeError', handleRouteChangeEnd);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeEnd);
      router.events.off('routeChangeError', handleRouteChangeEnd);
    };
  }, [pathname, router.events]);

  if (!data.link) return null;

  return (
    <ThemeProvider theme={storyCardTheme}>
      <Card
        square
        elevation={1}
        className={cx({
          feature: feature || !image,
          short,
          isLoading
        })}
      >
        <CardActionArea
          classes={{ root: classes.MuiCardActionAreaRoot }}
          component="div"
        >
          {image?.sourceUrl ? (
            <CardMedia classes={{ root: classes.MuiCardMediaRoot }}>
              <Image
                src={image.sourceUrl}
                alt={image.altText || ''}
                layout="fill"
                objectFit="cover"
                sizes={sizes}
                priority={priority}
              />
              <LinearProgress
                className={classes.loadingBar}
                color="secondary"
                aria-label="Progress Bar"
              />
            </CardMedia>
          ) : (
            <LinearProgress
              className={classes.loadingBar}
              color="secondary"
              aria-label="Progress Bar"
            />
          )}
          <CardContent classes={{ root: classes.MuiCardContentRoot }}>
            <Box className={classes.heading}>
              <Box>
                <Typography
                  variant="h5"
                  component="h2"
                  gutterBottom
                  className={classes.title}
                >
                  {title}
                </Typography>
                <Box className={classes.info}>
                  <Typography component="span" className={classes.date}>
                    <DateTime
                      date={date}
                      options={{
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      }}
                    />
                  </Typography>
                  {primaryCategory && (
                    <Typography
                      variant="overline"
                      className={classes.primaryCategory}
                    >
                      <Label color="secondary" />
                      {primaryCategory.link ? (
                        <ContentLink
                          className={classes.primaryCategoryLink}
                          title={primaryCategory.name || ''}
                          url={primaryCategory.link}
                        >
                          {primaryCategory.name}
                        </ContentLink>
                      ) : (
                        <span>{primaryCategory.name}</span>
                      )}
                    </Typography>
                  )}
                </Box>
              </Box>
              {audio && (
                <Box className={classes.audio}>
                  <AudioControls id={audio.id} fallbackProps={audioProps} />
                </Box>
              )}
            </Box>
            {excerpt && (
              <Typography
                className={classes.excerpt}
                variant="body1"
                component="div"
                color="textSecondary"
              >
                <HtmlContent html={excerpt} />
              </Typography>
            )}
          </CardContent>
          <ContentLink url={data.link} className={classes.link} />
        </CardActionArea>
        {/* {feature && !!(crossLinks && crossLinks.length) && (
          <CardActions>
            <List>{crossLinks.map((link: ILink) => renderLink(link))}</List>
          </CardActions>
        )} */}
      </Card>
    </ThemeProvider>
  );
};
