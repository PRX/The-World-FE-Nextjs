/**
 * @file PlaylistItem.tsx
 * Component to display track info in a playlist.
 */

import React, { useContext } from 'react';
import Image from 'next/legacy/image';
import { Box, BoxProps, IconButton, Tooltip, Typography } from '@mui/material';
import { DeleteSharp, DragHandleSharp } from '@mui/icons-material';
import { ContentLink } from '@components/ContentLink';
import { DateTime } from '@components/DateTime';
import { PlayerContext } from '@components/Player/contexts/PlayerContext';
import { IAudioData } from '@components/Player/types';
import { sanitizeIso8601Date } from '@lib/sanitize';
import { usePlaylistItemStyles } from './PlaylistItem.styles';
import { PlayAudioButton } from '../PlayAudioButton';

export interface IPlaylistItemProps extends BoxProps {
  audio: IAudioData;
}

export const PlaylistItem = ({
  audio,
  className,
  ...other
}: IPlaylistItemProps) => {
  const { state, removeTrack } = useContext(PlayerContext);
  const { tracks, currentTrackIndex = 0 } = state;
  const currentTrack = tracks?.[currentTrackIndex];
  const { guid: currentTrackGuid } = currentTrack || {};
  const { guid, title, imageUrl, info, linkResource } = audio;
  const isCurrentTrack = currentTrackGuid === guid;
  const thumbnailAspectRatio = 16 / 9;
  const thumbnailHeight = 48;
  const thumbnailWidth = thumbnailHeight * thumbnailAspectRatio;
  const { classes: styles, cx } = usePlaylistItemStyles({
    isCurrentTrack,
    hasLink: !!linkResource
  });
  const rootClassNames = cx(styles.root, className);
  const iconButtonClasses = {
    root: styles.iconButtonRoot
  };

  const handleRemoveTrackClick = () => {
    removeTrack(audio);
  };

  return (
    <Box {...other} className={rootClassNames}>
      <Box className={styles.handle}>
        <DragHandleSharp />
      </Box>
      <Box className={styles.layout}>
        <Box className={styles.image}>
          {imageUrl ? (
            <Image
              className={styles.image}
              src={imageUrl}
              width={thumbnailWidth}
              height={thumbnailHeight}
              layout="fixed"
              objectFit="cover"
              alt={`Thumbnail for "${title}"`}
            />
          ) : null}
        </Box>

        <Box className={styles.text}>
          <Typography className={styles.title} variant="h2" component="span">
            {title}
          </Typography>
          {info?.length ? (
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
                    value instanceof Date || !Number.isNaN(dateValue.getTime());

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
          ) : null}
        </Box>
        {linkResource && (
          <ContentLink url={linkResource.link} className={styles.link}>
            {linkResource.title}
          </ContentLink>
        )}
      </Box>
      <Box className={styles.controls}>
        <PlayAudioButton id={audio.guid} />
        <Tooltip title="Remove From Playlist" placement="top" arrow>
          <IconButton
            classes={iconButtonClasses}
            onClick={handleRemoveTrackClick}
          >
            <DeleteSharp />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};
