/**
 * @file SidebarEpisode.tsx
 * Component for story card links.
 */

import type { Episode, RootState } from '@interfaces';
import { useStore } from 'react-redux';
import { Card, CardActionArea, CardContent, Typography } from '@mui/material';
import { Headset, NavigateNext } from '@mui/icons-material';
import { ContentButton } from '@components/ContentButton';
import { ContentLink } from '@components/ContentLink';
import { DateTime } from '@components/DateTime';
import { AudioControls } from '@components/Player/components';
import { getSettingsTimeZone } from '@store/reducers';
import { sidebarEpisodeStyles } from './SidebarEpisode.styles';
import { SidebarHeader } from '../SidebarHeader';
import { SidebarFooter } from '../SidebarFooter';
import { SidebarList } from '../SidebarList';

export interface SidebarEpisodeProps {
  data: Episode;
  label?: string;
  collectionLink?: string;
  collectionLinkShallow?: boolean;
}

export const SidebarEpisode = ({
  data,
  label,
  collectionLink,
  collectionLinkShallow
}: SidebarEpisodeProps) => {
  const store = useStore<RootState>();
  const state = store.getState();
  const timeZone = getSettingsTimeZone(state);
  const { title, date, featuredImage, episodeDates, episodeAudio } = data;
  const image = featuredImage?.node;
  const imageUrl = image?.sourceUrl || image?.mediaItemUrl;
  const { audio } = episodeAudio || {};
  const { id: audioId, audioFields } = audio || {};
  const { segmentsList } = audioFields || {};
  const { broadcastDate } = episodeDates || {};
  const usedDateString = (broadcastDate && `${broadcastDate}T00:00:00`) || date;
  const episodeDate =
    usedDateString && typeof usedDateString !== 'undefined'
      ? new Date(usedDateString)
      : undefined;
  const { classes } = sidebarEpisodeStyles();

  return (
    <Card square elevation={1} className={classes.root}>
      <CardActionArea component="div">
        <SidebarHeader className={classes.header}>
          <Headset />
          <Typography variant="h2"> {label || 'Episode'}</Typography>
          {audioId && (
            <AudioControls
              className={classes.audio}
              id={audioId}
              fallbackProps={{
                ...(title && { title }),
                queuedFrom: 'Sidebar Episode Controls',
                ...(imageUrl && { imageUrl })
              }}
            />
          )}
        </SidebarHeader>
        <CardContent>
          <Typography
            variant="h5"
            component="p"
            gutterBottom
            className={classes.title}
            {...(episodeDate && {
              'aria-label': `Episode from ${episodeDate.toLocaleDateString(
                'en-US',
                {
                  ...(timeZone && { timeZone }),
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                }
              )}`
            })}
          >
            <DateTime
              date={usedDateString}
              options={{
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              }}
            />
          </Typography>
          <ContentLink url={data.link} className={classes.link}>
            {data.title}
          </ContentLink>
        </CardContent>
      </CardActionArea>
      {segmentsList && (
        <SidebarList
          disablePadding
          paginationProps={{
            pageSize: 15
          }}
          data={segmentsList.map((segment) => ({
            data: segment?.segmentContent?.audio?.parent?.node || segment,
            audio: segment?.segmentContent?.audio
          }))}
        />
      )}
      {collectionLink && (
        <SidebarFooter>
          <ContentButton
            url={collectionLink}
            shallow={collectionLinkShallow}
            variant="contained"
            color="primary"
            fullWidth
          >
            More Episodes <NavigateNext />
          </ContentButton>
        </SidebarFooter>
      )}
    </Card>
  );
};
