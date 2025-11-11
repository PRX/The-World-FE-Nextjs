/**
 * @file PlayerProgress.tsx
 * Play progress bar control.
 */

import React, {
  CSSProperties,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState
} from 'react';
import { convertDurationToSeconds } from '@lib/convert/string/convertDurationToSeconds';
import { convertSecondsToDuration } from '@lib/convert/string/convertSecondsToDuration';
import { PlayerContext } from '../../contexts';
import {
  PlayerActionTypes,
  playerProgressInitialState,
  playerProgressStateReducer
} from '../../state';
import { IAudioData } from '../../types';
import { usePlayerProgressStyles } from './PlayerProgress.styles';

export interface IPlayerProgressProps {
  updateFrequency?: number;
}

export interface IPlayerProgressCssProps extends React.CSSProperties {
  '--progress': number;
  '--track-width'?: string;
}

export const PlayerProgress: React.FC<IPlayerProgressProps> = ({
  updateFrequency = 500
}: IPlayerProgressProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const updateInterval = useRef<any>();
  const { audioElm, state: playerState, seekTo } = useContext(PlayerContext);
  const [loaded, setLoaded] = useState(0);
  const [state, dispatch] = useReducer(
    playerProgressStateReducer,
    playerProgressInitialState
  );
  const { classes } = usePlayerProgressStyles();
  const { scrubPosition, played, playedSeconds, duration } = state;
  const {
    currentTrackIndex = 0,
    tracks,
    currentTime: playerCurrentTime,
    currentDuration: playerCurrentDuration
  } = playerState;
  const { duration: trackDuration } =
    tracks?.[currentTrackIndex] || ({} as IAudioData);
  const totalDurationSeconds =
    duration ||
    playerCurrentDuration ||
    convertDurationToSeconds(trackDuration || '00:00');
  const progress =
    scrubPosition ||
    (played !== Infinity && played) ||
    (playedSeconds || playerCurrentTime) / totalDurationSeconds ||
    0;
  const progressDuration = convertSecondsToDuration(
    Math.round(totalDurationSeconds * progress)
  );

  /**
   * Update scrub position on the progress track.
   * @param position Ratio of pointer horizontal location relative to
   * progress track.
   */
  const updateScrubPosition = useCallback((e: PointerEvent) => {
    if (!trackRef.current) return;

    const rect = trackRef.current.getBoundingClientRect();
    const position = Math.max(0, Math.min(e.offsetX / rect.width, 1));

    dispatch({
      type: PlayerActionTypes.PLAYER_UPDATE_SCRUB_POSITION,
      payload: position
    });
  }, []);

  /**
   * Update player progress visuals.
   */
  const updateProgress = useCallback(
    (seconds?: number) => {
      const { currentTime: ct = 0, duration: d } = audioElm || {};
      const updatedPlayed = seconds || seconds === 0 ? seconds : ct;

      dispatch({
        type: PlayerActionTypes.PLAYER_UPDATE_PROGRESS,
        payload: {
          duration: d || duration,
          playedSeconds: updatedPlayed,
          played: updatedPlayed / (d || totalDurationSeconds)
        }
      });
    },
    [audioElm, duration, totalDurationSeconds]
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
   * Handle pointer move event on progress track.
   * @param e Pointer Event
   */
  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      updateScrubPosition(e);
    },
    [updateScrubPosition]
  );

  /**
   * Handle pointer down event on progress track.
   * @param e Pointer Event
   */
  const handlePointerDown = useCallback(
    (e: PointerEvent) => {
      if (!trackRef.current) return;

      trackRef.current.addEventListener('pointermove', handlePointerMove);
      trackRef.current.setPointerCapture(e.pointerId);
      trackRef.current.dataset.scrubbing = 'scrubbing';

      updateScrubPosition(e);
    },
    [handlePointerMove, updateScrubPosition]
  );

  /**
   * Handle pointer up event on progress track.
   * @param e Pointer Event
   */
  const handlePointerUp = useCallback(() => {
    seekTo((scrubPosition || played) * totalDurationSeconds);

    dispatch({
      type: PlayerActionTypes.PLAYER_UPDATE_PROGRESS_TO_SCRUB_POSITION
    });

    if (trackRef.current) {
      trackRef.current.removeEventListener('pointermove', handlePointerMove);
      delete trackRef.current.dataset.scrubbing;
    }
  }, [totalDurationSeconds, handlePointerMove, scrubPosition, seekTo]);

  /**
   * Interval handler to update loaded progress.
   */
  const handleUpdateLoaded = useCallback(() => {
    if (!audioElm) return;

    const { buffered } = audioElm;
    const newLoaded = buffered.length ? buffered.end(0) / audioElm.duration : 0;

    setLoaded(newLoaded);
  }, [audioElm]);

  useEffect(() => {
    const playerStateJson = localStorage?.getItem('playerProgressState');

    if (playerStateJson) {
      dispatch({
        type: PlayerActionTypes.PLAYER_HYDRATE,
        payload: JSON.parse(playerStateJson)
      });
    }
  }, []);

  useEffect(() => {
    if (localStorage) {
      localStorage.setItem('playerProgressState', JSON.stringify(state));
    }
  }, [state]);

  /**
   * Update state when player state's currentTime changes.
   */
  useEffect(() => {
    if (playerCurrentTime !== null) {
      updateProgress(playerCurrentTime);
    }
  }, [playerCurrentTime, updateProgress]);

  /**
   * Setup update interval.
   */
  useEffect(() => {
    clearInterval(updateInterval.current);

    updateInterval.current = setInterval(handleUpdateLoaded, updateFrequency);

    return () => {
      clearInterval(updateInterval.current);
    };
  }, [updateFrequency, handleUpdate, handleUpdateLoaded]);

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

  /**
   * Setup progress track event handlers.
   */
  useEffect(() => {
    const refElm = trackRef.current;
    refElm?.addEventListener('pointerdown', handlePointerDown);
    refElm?.addEventListener('pointerup', handlePointerUp);

    return () => {
      refElm?.removeEventListener('pointerdown', handlePointerDown);
      refElm?.removeEventListener('pointerup', handlePointerUp);
    };
  }, [handlePointerDown, handlePointerUp]);

  if (!audioElm) return null;

  return (
    <div
      className={classes.root}
      style={{ '--progress': progress, '--loaded': loaded } as CSSProperties}
      ref={trackRef}
    >
      <span className={classes.handle} data-text={progressDuration} />
    </div>
  );
};
