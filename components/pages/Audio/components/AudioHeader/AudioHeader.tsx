/**
 * @file StoryHeader.ts
 * Component for default story header.
 */

import type {
  Contributor,
  PostSegment,
  Segment_Segmentdates as SegmentSegmentDates
} from '@interfaces';
import type React from 'react';
import dynamic from 'next/dynamic';
import { Box, Typography } from '@mui/material';
import { ContentLink } from '@components/ContentLink';
import { DateTime } from '@components/DateTime';
import { IAudioControlsProps } from '@components/Player/components';
import { IAudioData } from '@components/Player/types';
import { audioHeaderStyles } from './AudioHeader.styles';

const AudioControls = dynamic(() =>
  import('@components/Player/components').then((mod) => mod.AudioControls)
) as React.FC<IAudioControlsProps>;

interface Props {
  data: PostSegment;
}

export const AudioHeader = ({ data }: Props) => {
  const { title, id, contributors, programs, segmentDates } = data;
  const program = programs?.nodes[0];
  const { broadcastDate } = segmentDates as SegmentSegmentDates;
  const audioProps = {
    title,
    queuedFrom: 'Page Header Controls',
    linkResource: data
  } as Partial<IAudioData>;
  const { classes } = audioHeaderStyles();

  return (
    <Box className={classes.root} mt={4} mb={2}>
      <Box mb={3}>
        <Typography variant="h1" className={classes.title}>
          {title}
        </Typography>
      </Box>
      <Box className={classes.meta} mb={2}>
        <Box className={classes.info}>
          {program?.link && (
            <ContentLink url={program.link} className={classes.programLink}>
              {program.name}
            </ContentLink>
          )}
          <DateTime
            date={broadcastDate}
            options={{
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            }}
          />
          {!!contributors?.nodes.length && (
            <ul className={classes.byline}>
              {contributors.nodes.map(
                (person: Contributor) =>
                  person?.link && (
                    <li className={classes.bylineItem} key={person.id}>
                      <ContentLink
                        className={classes.bylineLink}
                        url={person.link}
                      >
                        {person.name}
                      </ContentLink>
                    </li>
                  )
              )}
            </ul>
          )}
        </Box>
        <Box className={classes.audio}>
          <AudioControls id={id as string} fallbackProps={audioProps} />
        </Box>
      </Box>
    </Box>
  );
};
