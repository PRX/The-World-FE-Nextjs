/**
 * @file Playlist.tsx
 * List of audio in tracks. Click item to play that track. Each track item
 * should include option to remove track. Drag tracks to reorder them.
 */

import React, { useContext, useEffect, useMemo } from 'react';
import { Box, BoxProps } from '@mui/material';
import { AnimatePresence, Reorder } from 'framer-motion';
import debounce from 'lodash/debounce';
import { PlayerContext } from '../../contexts';
import { IAudioData } from '../../types';
import { usePlaylistStyles } from './Playlist.styles';
import { PlaylistItem } from './PlaylistItem';

export interface IPlaylistProps extends BoxProps {}

export const Playlist: React.FC<IPlaylistProps> = ({
  className,
  ...other
}: IPlaylistProps) => {
  const { state: playerState, setTracks } = useContext(PlayerContext);
  const { tracks } = playerState;
  const { classes: styles, cx } = usePlaylistStyles();
  const rootClasses = cx(styles.root, className);

  const handleReorder = useMemo(
    () =>
      debounce(
        (newOrder: IAudioData[]) => {
          setTracks(newOrder);
        },
        100,
        {
          trailing: true
        }
      ),
    [setTracks]
  );

  useEffect(() => () => {
    handleReorder.cancel();
  });

  return tracks?.length ? (
    <Box {...other} className={rootClasses}>
      <Reorder.Group
        className={styles.list}
        layoutScroll
        as="nav"
        axis="y"
        values={tracks}
        onReorder={handleReorder}
      >
        <AnimatePresence>
          {tracks?.map(track => (
            <Reorder.Item as="div" value={track} key={track.guid}>
              <PlaylistItem audio={track} />
            </Reorder.Item>
          ))}
        </AnimatePresence>
      </Reorder.Group>
    </Box>
  ) : null;
};
