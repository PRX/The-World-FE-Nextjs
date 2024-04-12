/**
 * @file StoryCardGrid.default.ts
 * Component for story card links grid.
 */

import type React from 'react';
import type { PostStory, Maybe } from '@interfaces';
// import type { ILink } from '@interfaces/link';
import type {
  IPlayAudioButtonProps,
  IAddAudioButtonProps
} from '@components/Player/components';
import type { IAudioData } from '@components/Player/types';
import { useEffect, useState } from 'react';
import 'moment-timezone';
import dynamic from 'next/dynamic';
import Image from 'next/legacy/image';
import { useRouter } from 'next/router';
// import { parse } from 'url';
import {
  Box,
  BoxProps,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  LinearProgress,
  Typography
  // CardActions,
  // Link as MuiLink,
  // List,
  // ListItem,
  // ListItemText,
} from '@mui/material';
import { Label } from '@mui/icons-material';
import { ContentLink } from '@components/ContentLink';
import { storyCardGridStyles } from './StoryCardGrid.styles';

const Moment = dynamic(() => import('react-moment')) as any;

const PlayAudioButton = dynamic(() =>
  import('@components/Player/components').then((mod) => mod.PlayAudioButton)
) as React.FC<IPlayAudioButtonProps>;

const AddAudioButton = dynamic(() =>
  import('@components/Player/components').then((mod) => mod.AddAudioButton)
) as React.FC<IAddAudioButtonProps>;

export interface StoryCardGridProps extends BoxProps {
  data: Maybe<PostStory>[];
}

export const StoryCardGrid = ({ data, ...other }: StoryCardGridProps) => {
  const router = useRouter();
  const [loadingUrl, setLoadingUrl] = useState<string>();
  const { classes, cx } = storyCardGridStyles();
  const imageWidth = [
    ['max-width: 600px', '100px'],
    ['max-width: 960px', '50vw'],
    ['max-width: 1280px', '300px'],
    [null, '400px']
  ];
  const sizes = imageWidth.map(([q, w]) => (q ? `(${q}) ${w}` : w)).join(', ');

  // const renderLink = ({ title: linkTitle, url }: ILink) => {
  //   const oUrl = parse(url, true, true);
  //   const LinkComponent = oUrl.host ? MuiLink : ContentLink;
  //   const attrs = oUrl.host
  //     ? {
  //         href: url
  //       }
  //     : {
  //         data: {
  //           metatags: { canonical: `/${url}` }
  //         }
  //       };

  //   return (
  //     <ListItem button component={LinkComponent} key={url} {...attrs}>
  //       <ListItemText>{linkTitle}</ListItemText>
  //     </ListItem>
  //   );
  // };

  useEffect(() => {
    const handleRouteChangeStart = (url: string) => {
      setLoadingUrl(url);
    };
    const handleRouteChangeEnd = () => {
      setLoadingUrl(undefined);
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeEnd);
    router.events.on('routeChangeError', handleRouteChangeEnd);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeEnd);
      router.events.off('routeChangeError', handleRouteChangeEnd);
    };
  }, [router.events]);

  return (
    <Box className={classes.root} {...other}>
      {data.map((item, index) => {
        if (!item) return null;

        const {
          link,
          id,
          title,
          date,
          featuredImage,
          additionalMedia,
          additionalDates,
          primaryCategory
        } = item;
        const image = featuredImage?.node;
        const { broadcastDate } = additionalDates || {};
        const { audio } = additionalMedia || {};
        const pathname = link && new URL(link).pathname;
        const isLoading = pathname === loadingUrl;
        const audioProps = {
          title,
          queuedFrom: 'Card Controls',
          ...(image?.sourceUrl && { imageUrl: image.sourceUrl }),
          linkResource: item
        } as Partial<IAudioData>;

        return (
          link && (
            <Card classes={{ root: classes.MuiCardRoot }} square key={id}>
              <CardActionArea
                component="div"
                classes={{ root: classes.MuiCardActionAreaRoot }}
              >
                <CardMedia classes={{ root: classes.MuiCardMediaRoot }}>
                  {image?.sourceUrl && (
                    <Image
                      src={image.sourceUrl}
                      alt={image.altText || ''}
                      layout="fill"
                      objectFit="cover"
                      sizes={sizes}
                      priority={index <= 1}
                    />
                  )}
                  {audio && (
                    <PlayAudioButton
                      classes={{ root: classes.audioPlayButton }}
                      id={audio.id}
                      fallbackProps={audioProps}
                    />
                  )}
                  <LinearProgress
                    className={cx(classes.loadingBar, {
                      isLoading
                    })}
                    color="secondary"
                    aria-label="Progress Bar"
                  />
                </CardMedia>
                <CardContent classes={{ root: classes.MuiCardContentRoot }}>
                  <Box className={classes.heading}>
                    <Typography
                      variant="h5"
                      component="h2"
                      gutterBottom
                      className={classes.title}
                    >
                      {title}
                    </Typography>
                    {audio && (
                      <Box className={classes.audio}>
                        <AddAudioButton
                          id={audio.id}
                          fallbackProps={audioProps}
                        />
                      </Box>
                    )}
                  </Box>
                  <Box className={classes.info}>
                    <Typography className={classes.date} component="span">
                      <Moment
                        format="MMMM D, YYYY"
                        tz="America/New_York"
                        {...(broadcastDate && { parse: 'YYYY-MM-DD' })}
                      >
                        {broadcastDate || date}
                      </Moment>
                    </Typography>
                    {primaryCategory && (
                      <Typography
                        className={classes.primaryCategory}
                        variant="overline"
                        noWrap
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
                  <ContentLink url={link} className={classes.link} />
                </CardContent>
              </CardActionArea>
              {/* {!!(crossLinks && crossLinks.length) && (
              <CardActions>
                <List>{crossLinks.map((link: ILink) => renderLink(link))}</List>
              </CardActions>
            )} */}
            </Card>
          )
        );
      })}
    </Box>
  );
};
