/**
 * @file StoryHeader.ts
 * Component for default story header.
 */

import type {
  Contributor,
  MediaItem,
  PostSegment,
  Segment_Segmentdates as SegmentSegmentDates
} from '@interfaces';
import type React from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/legacy/image';
import { Box, Typography } from '@mui/material';
import { ContentLink } from '@components/ContentLink';
import { DateTime } from '@components/DateTime';
import { HtmlContent } from '@components/HtmlContent';
import { ImageCredit } from '@components/ImageCredit';
import { IAudioControlsProps } from '@components/Player/components';
import { IAudioData } from '@components/Player/types';
import { audioHeaderStyles } from './SegmentHeader.styles';

const AudioControls = dynamic(() =>
  import('@components/Player/components').then((mod) => mod.AudioControls)
) as React.FC<IAudioControlsProps>;

interface Props {
  data: PostSegment;
}

export const AudioHeader = ({ data }: Props) => {
  const {
    title,
    contributors,
    programs,
    segmentDates,
    segmentContent,
    featuredImage
  } = data;
  const { audio } = segmentContent || {};
  const program = programs?.nodes[0];
  const { broadcastDate } = segmentDates as SegmentSegmentDates;
  const image = featuredImage?.node;
  const { caption, imageFields } = image || {};
  const { mediaCredit } = imageFields || {};
  const hasCaption = !!caption?.length;
  const hasCredit = !!mediaCredit?.length;
  const hasFooter = hasCaption || hasCredit;
  const audioProps = {
    queuedFrom: 'Page Header Controls',
    linkResource: data,
    ...(image?.mediaItemUrl && { imageUrl: image.mediaItemUrl })
  } as Partial<IAudioData>;
  const { classes, cx } = audioHeaderStyles();

  return (
    <>
      <Box
        className={cx(classes.root, { withImage: !!featuredImage })}
        mt={4}
        mb={2}
      >
        {image?.mediaItemUrl && (
          <Box className={classes.lede}>
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
              {audio && (
                <AudioControls id={audio.id} fallbackProps={audioProps} />
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      {hasFooter && (
        <Typography
          variant="caption"
          component="div"
          className={classes.footer}
        >
          {hasCaption && (
            <Box className={classes.caption}>
              <HtmlContent html={caption} />
            </Box>
          )}
          {hasCredit && <ImageCredit data={image as MediaItem} />}
        </Typography>
      )}
    </>
  );
};
