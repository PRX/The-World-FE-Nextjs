/**
 * @file TimeInfo.tsx
 * Playback time info text.
 */

import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Box, BoxProps } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { convertDurationToSeconds } from '@lib/convert/string/convertDurationToSeconds';
import { convertSecondsToDuration } from '@lib/convert/string/convertSecondsToDuration';
import { PlayerContext } from '../../contexts';
import { IAudioData } from '../../types';
import { useTimeInfoStyles } from './TimeInfo.styles';

export interface ITimeInfoProps extends BoxProps {}

export const TimeInfo: React.FC<ITimeInfoProps> = ({
  className,
  ...other
}: ITimeInfoProps) => {
  const { audioElm, state: playerState } = useContext(PlayerContext);
  const { classes: styles, cx } = useTimeInfoStyles();
  const {
    currentTrackIndex = 0,
    tracks,
    currentTime: playerCurrentTime
  } = playerState;
  const { duration: audioDuration } =
    tracks?.[currentTrackIndex] || ({} as IAudioData);
  const [currentTime, setCurrentTime] = useState(playerCurrentTime);
  const [duration, setDuration] = useState(
    convertDurationToSeconds(audioDuration || '00:00')
  );
  const playedDuration = convertSecondsToDuration(currentTime);
  const trackDuration = convertSecondsToDuration(duration);
  const timeInfo = `${playedDuration} / ${trackDuration}`;
  const rootClasses = cx(styles.root, className);

  /**
   * Update player progress visuals.
   */
  const updateProgress = useCallback(
    (seconds?: number) => {
      const { currentTime: ct, duration: d } = audioElm || {};
      const updatedPlayed = seconds || seconds === 0 ? seconds : ct;

      setCurrentTime(updatedPlayed || currentTime);
      setDuration(d || duration);
    },
    [audioElm]
  );

  /**
   * Update state when audio metadata is loaded.
   */
  const handleLoadedMetadata = useCallback(() => {
    updateProgress();
  }, [updateProgress]);

  /**
   * Updated state on interval tick.
   */
  const handleUpdate = useCallback(() => {
    updateProgress();
  }, [updateProgress]);

  /**
   * Update state when player state's currentTime changes.
   */
  useEffect(() => {
    if (playerCurrentTime !== null) {
      updateProgress(playerCurrentTime);
    }
  }, [playerCurrentTime, updateProgress]);

  /**
   * Setup audio element event handlers.
   */
  useEffect(() => {
    audioElm?.addEventListener('loadedmetadata', handleLoadedMetadata);
    audioElm?.addEventListener('timeupdate', handleUpdate);

    return () => {
      audioElm?.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audioElm?.removeEventListener('timeupdate', handleUpdate);
    };
  }, [audioElm, handleLoadedMetadata, handleUpdate]);

  return (
    <Box {...other} className={rootClasses}>
      <AnimatePresence initial={false} exitBeforeEnter>
        {duration ? (
          <motion.div
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
            {timeInfo}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </Box>
  );
};
