/**
 * @file StoryHeader.ts
 * Component for default story header.
 */

import type React from 'react';
import type { IAudioControlsProps } from '@components/Player/components';
import type { IAudioData } from '@components/Player/types';
import type {
  Episode,
  Episode_Episodedates as EpisodeEpisodeDates,
  Episode_Episodeaudio as EpisodeEpisodeAudio
} from '@interfaces';
import dynamic from 'next/dynamic';
import { Box, Typography } from '@mui/material';
import { ContentLink } from '@components/ContentLink';
import { DateTime } from '@components/DateTime';
import { episodeHeaderStyles } from './EpisodeHeader.styles';

const AudioControls = dynamic(() =>
  import('@components/Player/components').then((mod) => mod.AudioControls)
) as React.FC<IAudioControlsProps>;

interface Props {
  data: Episode;
}

export const EpisodeHeader = ({ data }: Props) => {
  const { title, date, episodeDates, featuredImage, episodeAudio, programs } =
    data;
  const { broadcastDate } = episodeDates as EpisodeEpisodeDates;
  const { audio } = episodeAudio as EpisodeEpisodeAudio;
  const audioProps = {
    title,
    queuedFrom: 'Page Header Controls',
    ...(featuredImage?.node.sourceUrl && {
      imageUrl: featuredImage.node.sourceUrl
    })
  } as Partial<IAudioData>;
  const program = programs?.nodes[0];
  const { classes } = episodeHeaderStyles();

  return (
    <Box component="header" className={classes.root} mt={4} mb={2}>
      <Box mb={3}>
        <Typography variant="h1" className={classes.title}>
          {title}
        </Typography>
      </Box>
      <Box className={classes.meta} mb={2}>
        <Box className={classes.info}>
          {program && (
            <ContentLink url={program.link} className={classes.programLink}>
              {program.name}
            </ContentLink>
          )}
          <DateTime
            className={classes.date}
            date={broadcastDate || date}
            options={{
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }}
          />
        </Box>
        {audio && (
          <Box className={classes.audio}>
            <AudioControls id={audio.id} fallbackProps={audioProps} />
          </Box>
        )}
      </Box>
    </Box>
  );
};
