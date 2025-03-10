/**
 * @file TrackInfo.tsx
 * Component to display info about the current track.
 */

import React, { useContext } from 'react';
import Image from 'next/legacy/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Typography } from '@mui/material';
import { sanitizeIso8601Date } from '@lib/sanitize';
import { ContentLink } from '@components/ContentLink';
import { DateTime } from '@components/DateTime';
import { Marquee } from '@components/Marquee';
import { PlayerContext } from '@components/Player/contexts/PlayerContext';
import { useTrackInfoStyles } from './TrackInfo.styles';

export interface ITrackInfoProps {
  className?: string;
}

export const TrackInfo = ({ className }: ITrackInfoProps) => {
  const { state } = useContext(PlayerContext);
  const { tracks, currentTrackIndex = 0 } = state;
  const currentTrack = tracks?.[currentTrackIndex];
  const { title, info, imageUrl, linkResource } = currentTrack || {};
  const thumbnailAspectRatio = 16 / 9;
  const thumbnailHeight = 48;
  const thumbnailWidth = thumbnailHeight * thumbnailAspectRatio;
  const { classes: styles, cx } = useTrackInfoStyles({
    hasLink: !!linkResource,
    hasImage: !!imageUrl
  });
  const rootClassNames = cx(styles.root, className);

  return (
    <Box className={rootClassNames}>
      <AnimatePresence initial={false} exitBeforeEnter>
        <motion.div
          className={styles.layout}
          key={currentTrack ? currentTrack.guid : 'empty'}
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}
          transition={{
            duration: 0.2
          }}
        >
          {imageUrl && (
            <Image
              className={styles.image}
              src={imageUrl}
              width={thumbnailWidth}
              height={thumbnailHeight}
              layout="fixed"
              alt={`Thumbnail for "${title}"`}
            />
          )}
          <Box className={styles.text}>
            <Marquee>
              <Typography
                className={styles.title}
                variant="h2"
                component="span"
              >
                {title}
              </Typography>
            </Marquee>
            {info?.length ? (
              <Marquee>
                <Typography
                  className={styles.info}
                  variant="subtitle1"
                  component="span"
                >
                  {info
                    .filter((t) => !!t)
                    .map((value) => {
                      const dateValue =
                        value instanceof Date
                          ? value
                          : new Date(sanitizeIso8601Date(value) || '');
                      const isDateValue =
                        value instanceof Date ||
                        !Number.isNaN(dateValue.getTime());

                      return isDateValue ? (
                        <DateTime
                          className={styles.infoItem}
                          date={dateValue}
                          options={{
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          }}
                          key={`${dateValue.toString()}`}
                        />
                      ) : (
                        <span className={styles.infoItem} key={value}>
                          {value}
                        </span>
                      );
                    })}
                </Typography>
              </Marquee>
            ) : null}
          </Box>
        </motion.div>
      </AnimatePresence>
      {linkResource && (
        <ContentLink url={linkResource.link} className={styles.link}>
          {linkResource.title}
        </ContentLink>
      )}
    </Box>
  );
};
