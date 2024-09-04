/**
 * @file SegmentCard.tsx
 * Component for story card links.
 */

import type { Segment } from '@interfaces';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  LinearProgress,
  Typography
} from '@mui/material';
import PlayCircleOutlineRounded from '@mui/icons-material/PlayCircleOutlineRounded';
import { ContentLink } from '@components/ContentLink';
import { DateTime } from '@components/DateTime';
import { segmentCardStyles } from './SegmentCard.styles';

export interface SegmentCardProps {
  data: Segment;
}

export const SegmentCard = ({ data }: SegmentCardProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { link, title, date, segmentDates } = data;
  const { broadcastDate } = segmentDates || {};
  const cardDate = broadcastDate || date;
  const cardTitle = title;
  const CardIcon = PlayCircleOutlineRounded;
  const pathname = link && new URL(link).pathname;
  const { classes, cx } = segmentCardStyles({ isLoading });

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

  return (
    <Card
      square
      elevation={1}
      className={cx(classes.root, {
        [classes.isLoading]: isLoading
      })}
    >
      <CardActionArea classes={{ root: classes.MuiCardActionAreaRoot }}>
        {CardIcon && (
          <CardMedia classes={{ root: classes.MuiCardMediaRoot }}>
            <CardIcon style={{ fontSize: '5rem' }} />
            <LinearProgress
              className={classes.loadingBar}
              color="secondary"
              aria-label="Progress Bar"
            />
          </CardMedia>
        )}
        <CardContent classes={{ root: classes.MuiCardContentRoot }}>
          {cardDate && (
            <Typography
              variant="subtitle2"
              component="span"
              color="textSecondary"
              noWrap
            >
              <DateTime
                date={cardDate}
                options={{
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                }}
              />
            </Typography>
          )}
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            className={classes.title}
          >
            {cardTitle}
          </Typography>
        </CardContent>
        <ContentLink url={link} className={classes.link} />
      </CardActionArea>
    </Card>
  );
};
