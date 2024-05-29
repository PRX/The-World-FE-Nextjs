/**
 * @file Sidebar.tsx
 * Component for sidebar elements.
 */

import type React from 'react';
import type {
  PostStory,
  Post_Additionaldates as PostAdditionalDates,
  Contributor,
  Post_Additionalmedia as PostAdditionalMedia,
  MediaItem
} from '@interfaces';
import type { IAudioControlsProps } from '@components/Player/components';
import type { IAudioData } from '@components/Player/types';
import { ContentLink } from '@components/ContentLink';
import Image from 'next/legacy/image';
import dynamic from 'next/dynamic';
import 'moment-timezone';
import { Box, Container, Typography, ThemeProvider } from '@mui/material';
import { HtmlContent } from '@components/HtmlContent';
import { ImageCredit } from '@components/ImageCredit';
import {
  storyHeaderStyles,
  storyHeaderTheme
} from './StoryHeader.feature.styles';

const Moment = dynamic(() => import('react-moment')) as any;

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
    excerpt,
    featuredImage,
    additionalMedia,
    additionalDates,
    primaryCategory,
    programs,
    contributors
  } = data;
  const { audio } = additionalMedia as PostAdditionalMedia;
  const { updatedDate } = additionalDates as PostAdditionalDates;
  const image = featuredImage?.node;
  const program = programs?.nodes[0];
  const bylines: [string, Contributor[]][] = [];
  const audioProps = {
    title,
    queuedFrom: 'Page Header Controls',
    ...(image?.sourceUrl && { imageUrl: image.sourceUrl }),
    linkResource: data
  } as Partial<IAudioData>;
  const { caption, imageFields } = image || {};
  const { mediaCredit } = imageFields || {};
  const hasCaption = !!caption?.length;
  const hasCredit = !!mediaCredit?.length;
  const hasFooter = hasCaption || hasCredit;
  const { classes, cx } = storyHeaderStyles();

  if (contributors?.nodes.length) {
    bylines.push(['By', contributors.nodes]);
  }

  return (
    <ThemeProvider theme={storyHeaderTheme}>
      <Box
        component="header"
        className={cx(classes.root, { [classes.withImage]: !!featuredImage })}
      >
        {image?.mediaItemUrl && (
          <Box className={classes.imageWrapper}>
            <Image
              alt={image.altText || ''}
              className={cx('image')}
              src={image.mediaItemUrl}
              layout="fill"
              objectFit="cover"
              priority
            />
          </Box>
        )}
        <Box className={classes.content}>
          <Container fixed className={classes.header}>
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
              <Typography variant="h1">{title}</Typography>
              {excerpt && (
                <Typography component="div" className={classes.teaser}>
                  <HtmlContent html={excerpt} />
                </Typography>
              )}
            </Box>
            <Box mb={2} display="flex" alignItems="center">
              <Box className={classes.info} flexGrow={1}>
                {program?.link && (
                  <ContentLink
                    url={program.link}
                    className={classes.programLink}
                  >
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
                    variant="subtitle2"
                    component="div"
                    className={classes.date}
                  >
                    {' '}
                    Updated on{' '}
                    <Moment
                      format="MMM. D, YYYY · h:mm A z"
                      tz="America/New_York"
                    >
                      {updatedDate}
                    </Moment>
                  </Typography>
                )}
                {!!bylines.length && (
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
                                url={person.link || ''}
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
                    variant="feature"
                  />
                </Box>
              )}
            </Box>
          </Container>
        </Box>
      </Box>
      {hasFooter && (
        <Container fixed className={classes.footer}>
          {hasCaption && (
            <Typography className={classes.caption} variant="caption">
              <HtmlContent html={caption} />
            </Typography>
          )}
          {hasCredit && (
            <ImageCredit className={classes.credit} data={image as MediaItem} />
          )}
        </Container>
      )}
    </ThemeProvider>
  );
};
