/**
 * @file SidebarEpisode.tsx
 * Component for story card links.
 */

import type React from 'react';
import type { Episode } from '@interfaces';
import type { IAudioControlsProps } from '@components/Player/components';
import type { IAudioData } from '@components/Player/types';
import dynamic from 'next/dynamic';
import Image from 'next/legacy/image';
import {
  Box,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Divider,
  ListSubheader,
  Typography
} from '@mui/material';
import { EqualizerRounded } from '@mui/icons-material';
import { ThemeProvider } from '@mui/styles';
import { ContentLink } from '@components/ContentLink';
import { DateTime } from '@components/DateTime';
import { HtmlContent } from '@components/HtmlContent';
import { SidebarList } from '@components/Sidebar';
import { episodeCardStyles, episodeCardTheme } from './EpisodeCard.styles';

const AudioControls = dynamic(() =>
  import('@components/Player/components').then((mod) => mod.AudioControls)
) as React.FC<IAudioControlsProps>;

export interface EpisodeCardProps {
  data: Episode;
  priority?: boolean;
  hideProgramLink?: boolean;
}

export const EpisodeCard = ({
  data,
  priority,
  hideProgramLink
}: EpisodeCardProps) => {
  const {
    link,
    title,
    date,
    excerpt,
    featuredImage,
    episodeAudio,
    episodeDates,
    programs
  } = data;
  const image = featuredImage?.node;
  const imageUrl = image?.sourceUrl || image?.mediaItemUrl;
  const { audio } = episodeAudio || {};
  const { broadcastDate } = episodeDates || {};
  const audioProps = {
    title,
    queuedFrom: 'Card Controls',
    ...(imageUrl && { imageUrl }),
    linkResource: data
  } as Partial<IAudioData>;
  const { audioFields } = audio || {};
  const segments = audioFields?.segmentsList;
  const program = programs?.nodes[0];
  const showProgramLink = !!program && !hideProgramLink;
  const { classes } = episodeCardStyles();
  const imageWidth = [
    ['max-width: 600px', '100vw'],
    ['max-width: 960px', '568px'],
    [null, '808px']
  ];
  const sizes = imageWidth.map(([q, w]) => (q ? `(${q}) ${w}` : w)).join(', ');

  return (
    <ThemeProvider theme={episodeCardTheme}>
      <Card square elevation={1} classes={{ root: classes.MuiCardRoot }}>
        <CardActionArea component="div">
          {imageUrl && (
            <CardMedia classes={{ root: classes.MuiCardMediaRoot }}>
              <Image
                src={imageUrl}
                alt={image?.altText || ''}
                layout="fill"
                objectFit="cover"
                sizes={sizes}
                priority={priority}
              />
            </CardMedia>
          )}
          <CardContent classes={{ root: classes.MuiCardContentRoot }}>
            <Box className={classes.heading}>
              <Box>
                <Typography component="span" className={classes.info}>
                  {showProgramLink && (
                    <>
                      <ContentLink
                        className={classes.program}
                        url={program.link}
                      >
                        {program.name}
                      </ContentLink>
                      <Divider orientation="vertical" flexItem />
                    </>
                  )}
                  <DateTime
                    date={broadcastDate || date}
                    options={{
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    }}
                  />
                </Typography>
                <Typography
                  variant="h5"
                  component="h2"
                  gutterBottom
                  className={classes.title}
                >
                  {title}
                </Typography>
              </Box>
              {audio && (
                <Box className={classes.audio}>
                  <AudioControls id={audio.id} fallbackProps={audioProps} />
                </Box>
              )}
            </Box>
            <Typography variant="body1" component="div" color="textSecondary">
              {excerpt && (
                <Box className={classes.body}>
                  <HtmlContent html={excerpt} />
                </Box>
              )}
            </Typography>
            <ContentLink url={link} className={classes.link} />
          </CardContent>
        </CardActionArea>
        {segments && (
          <CardActions classes={{ root: classes.MuiCardActionsRoot }}>
            <SidebarList
              paginationProps={{
                pageSize: 15
              }}
              data={segments.map((segment) => ({
                data: segment?.segmentContent?.audio?.parent?.node || segment,
                audio: segment?.segmentContent?.audio
              }))}
              classes={{
                root: classes.MuiListRoot,
                padding: classes.MuiListPadding
              }}
              subheader={
                <ListSubheader component="header" className={classes.header}>
                  <Typography variant="h2">
                    <EqualizerRounded /> In this episode:
                  </Typography>
                </ListSubheader>
              }
            />
          </CardActions>
        )}
      </Card>
    </ThemeProvider>
  );
};
