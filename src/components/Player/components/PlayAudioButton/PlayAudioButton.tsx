/**
 * @file PlayAudioButton.tsx
 * Play button component to toggle playing state of player.
 */

import { type MouseEventHandler, useContext, useEffect, useState } from 'react';
import type {
  Episode,
  MediaItem,
  PostStory,
  RootState,
  Segment
} from '@interfaces';
import { type IAudioData } from '@components/Player/types';
import { useStore } from 'react-redux';
import { CircularProgress, NoSsr, Tooltip } from '@mui/material';
import IconButton, { type IconButtonProps } from '@mui/material/IconButton';
import { PauseSharp, PlayArrowSharp, VolumeUpSharp } from '@mui/icons-material';
import { PlayerContext } from '@components/Player/contexts/PlayerContext';
import { parseAudioData } from '@lib/parse/audio/audioData';
import { fetchAudioData } from '@store/actions/fetchAudioData';
import { getDataByResource } from '@store/reducers';
import { playAudioButtonStyles } from './PlayAudioButton.styles';

export interface IPlayAudioButtonProps extends IconButtonProps {
  id: string;
  fallbackProps?: Partial<IAudioData>;
}

export const PlayAudioButton = ({
  className,
  classes,
  id,
  fallbackProps,
  ...other
}: IPlayAudioButtonProps) => {
  const store = useStore<RootState>();
  const [audio, setAudio] = useState<MediaItem>();
  const [audioData, setAudioData] = useState<IAudioData>();
  const [loading, setLoading] = useState(false);

  const {
    state: playerState,
    playAudio,
    togglePlayPause
  } = useContext(PlayerContext);
  const { playing, currentTrackIndex = 0, tracks = [] } = playerState;
  const currentTrack = tracks[currentTrackIndex];
  const [audioIsPlaying, setAudioIsPlaying] = useState(
    playing && !!audioData && currentTrack?.guid === audioData?.guid
  );
  const tooltipTitle = audioIsPlaying ? 'Pause' : 'Play';
  const { classes: styles, cx } = playAudioButtonStyles({
    audioIsPlaying
  });
  const rootClassNames = cx(styles.root, className);
  const iconButtonClasses = {
    root: styles.iconButtonRoot,
    ...classes
  };
  const iconClasses = {
    root: styles.iconRoot
  };
  const progressClasses = {
    colorPrimary: styles.circularProgressPrimary
  };

  const handlePlayClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();

    if (audioData && audioData.guid !== currentTrack?.guid) {
      playAudio(audioData);
    } else {
      togglePlayPause();
    }
  };

  const handleLoadClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    (async () => {
      setLoading(true);
      const ar = (await store.dispatch<any>(fetchAudioData(id))) as
        | MediaItem
        | undefined;

      if (!ar) return;

      const linkResource = ar.parent?.node as
        | PostStory
        | Segment
        | Episode
        | undefined;
      const linkResourceImage = linkResource?.featuredImage?.node;
      const linkResourceImageUrl =
        linkResourceImage?.sourceUrl || linkResourceImage?.mediaItemUrl;
      const ad = parseAudioData(
        ar,
        linkResource
          ? {
              ...fallbackProps,
              ...(linkResource.title && { title: linkResource.title }),
              ...(linkResourceImageUrl && { imageUrl: linkResourceImageUrl }),
              linkResource
            }
          : fallbackProps
      );

      setLoading(false);
      setAudio(ar);

      if (ad) {
        playAudio(ad);
      }
    })();
  };

  useEffect(() => {
    const ar = getDataByResource<MediaItem>(
      store.getState(),
      'file--audio',
      id
    );
    setAudio(ar);
  }, [id, store]);

  useEffect(() => {
    if (audio) {
      const ad = parseAudioData(audio, fallbackProps);
      setAudioData(ad);
    }
  }, [audio, fallbackProps]);

  useEffect(() => {
    if (currentTrack?.guid === (audioData?.guid || id)) {
      if (!audioData && currentTrack) setAudioData(currentTrack);
      setAudioIsPlaying(playing);
    } else {
      setAudioIsPlaying(false);
    }
  }, [id, playing, audioData, currentTrack]);

  useEffect(() => {
    const track = (tracks || []).find(({ guid }) => guid === id);
    if (track && !audioData) setAudioData(track);
  }, [id, tracks, audioData]);

  return (
    <NoSsr>
      <Tooltip title={tooltipTitle} placement="top" arrow>
        {audio || audioData ? (
          <IconButton
            className={rootClassNames}
            classes={iconButtonClasses}
            disableRipple
            {...other}
            onClick={handlePlayClick}
            {...(audioIsPlaying && { 'data-playing': true })}
          >
            {!audioIsPlaying && <PlayArrowSharp classes={iconClasses} />}
            {audioIsPlaying && (
              <>
                <VolumeUpSharp classes={iconClasses} />
                <PauseSharp classes={iconClasses} />
              </>
            )}
          </IconButton>
        ) : (
          <IconButton
            className={rootClassNames}
            classes={iconButtonClasses}
            disableRipple
            {...other}
            onClick={handleLoadClick}
            {...(loading && { 'data-loading': true })}
          >
            {!loading ? (
              <PlayArrowSharp classes={iconClasses} />
            ) : (
              <CircularProgress classes={progressClasses} size="1em" />
            )}
          </IconButton>
        )}
      </Tooltip>
    </NoSsr>
  );
};
