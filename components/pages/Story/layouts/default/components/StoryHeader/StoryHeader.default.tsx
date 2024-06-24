/**
 * @file StoryHeader.ts
 * Component for default story header.
 */

import type React from 'react';
import type {
  PostStory,
  Post_Additionaldates as PostAdditionalDates,
  Contributor,
  Post_Additionalmedia as PostAdditionalMedia
} from '@interfaces';
import type { IAudioControlsProps } from '@components/Player/components';
import type { IAudioData } from '@components/Player/types';
import { ContentLink } from '@components/ContentLink';
import dynamic from 'next/dynamic';
import { Box, Typography } from '@mui/material';
import { storyHeaderStyles } from './StoryHeader.default.styles';

const Moment = dynamic(() => {
  import('moment-timezone');
  return import('react-moment');
}) as any;

const AudioControls = dynamic(() =>
  import('@components/Player/components').then((mod) => mod.AudioControls)
) as React.FC<IAudioControlsProps>;

interface Props {
  data: PostStory;
}

export const StoryHeader = ({ data }: Props) => {
  const {
    title,
    date,
    additionalMedia,
    additionalDates,
    primaryCategory,
    programs,
    contributors
  } = data;
  const { audio } = additionalMedia as PostAdditionalMedia;
  const { updatedDate } = additionalDates as PostAdditionalDates;
  const program = programs?.nodes[0];
  const bylines: [string, Contributor[]][] = [];
  const audioProps = {
    title,
    queuedFrom: 'Page Header Controls',
    linkResource: data
  } as Partial<IAudioData>;
  const { classes } = storyHeaderStyles();

  if (contributors?.nodes.length) {
    bylines.push(['By', contributors.nodes]);
  }

  return (
    <Box component="header" className={classes.root} mt={4} mb={2}>
      {primaryCategory?.link && (
        <Box mb={2}>
          <ContentLink
            className={classes.categoryLink}
            url={primaryCategory.link}
          >
            {primaryCategory.name}
          </ContentLink>
        </Box>
      )}
      <Box mb={3}>
        <Typography className={classes.title} variant="h1">
          {title}
        </Typography>
      </Box>
      <Box className={classes.heading} mb={2}>
        <Box className={classes.info}>
          {program?.link && (
            <ContentLink url={program.link} className={classes.programLink}>
              {program.name}
            </ContentLink>
          )}
          {date && (
            <Typography
              variant="subtitle1"
              component="div"
              className={classes.date}
            >
              <Moment format="MMMM D, YYYY" tz="America/New_York">
                {date}
              </Moment>
            </Typography>
          )}
          {updatedDate && (
            <Typography
              variant="subtitle1"
              component="div"
              className={classes.date}
            >
              {' '}
              Updated on{' '}
              <Moment format="MMM. D, YYYY · h:mm A z" tz="America/New_York">
                {updatedDate}
              </Moment>
            </Typography>
          )}
          {bylines && (
            <ul className={classes.byline}>
              {bylines.map(([creditTitle, people]) => (
                <li className={classes.bylineItem} key={creditTitle}>
                  {creditTitle}{' '}
                  <Box className={classes.bylinePeople} component="span">
                    {people.map((person) => (
                      <Box
                        className={classes.bylinePerson}
                        component="span"
                        key={person.id}
                      >
                        <ContentLink
                          className={classes.bylineLink}
                          url={person.link}
                        >
                          {person.name}
                        </ContentLink>
                      </Box>
                    ))}
                  </Box>
                </li>
              ))}
            </ul>
          )}
        </Box>
        {audio && (
          <Box className={classes.audio}>
            <AudioControls
              id={audio.id}
              fallbackProps={audioProps}
              key={audio.id}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};
