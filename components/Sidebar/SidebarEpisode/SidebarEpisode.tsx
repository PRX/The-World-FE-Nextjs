/**
 * @file SidebarEpisode.tsx
 * Component for story card links.
 */

import type { Episode } from '@interfaces';
import 'moment-timezone';
import dynamic from 'next/dynamic';
import { Card, CardActionArea, CardContent, Typography } from '@mui/material';
import { Headset, NavigateNext } from '@mui/icons-material';
import { ContentButton } from '@components/ContentButton';
import { ContentLink } from '@components/ContentLink';
import { AudioControls } from '@components/Player/components';
import { sidebarEpisodeStyles } from './SidebarEpisode.styles';
import { SidebarHeader } from '../SidebarHeader';
import { SidebarFooter } from '../SidebarFooter';
import { SidebarList } from '../SidebarList';

const Moment = dynamic(() => import('react-moment')) as any;

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
  const { title, date, featuredImage, episodeDates, episodeAudio } = data;
  const image = featuredImage?.node;
  const imageUrl = image?.sourceUrl || image?.mediaItemUrl;
  const { audio } = episodeAudio || {};
  const { id: audioId, audioFields } = audio || {};
  const { segmentsList } = audioFields || {};
  const { broadcastDate } = episodeDates || {};
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
          >
            <Moment
              format="dddd, MMMM D, YYYY"
              tz="America/New_York"
              {...(broadcastDate && { parse: 'YYYY-MM-DD' })}
            >
              {broadcastDate || date}
            </Moment>
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
