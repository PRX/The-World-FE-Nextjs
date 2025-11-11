/**
 * @file AddAudioButton.tsx
 * Play button component to toggle playing state of player.
 */

import { type MouseEventHandler, useContext, useEffect, useState } from 'react';
import { useStore } from 'react-redux';
import { CircularProgress, NoSsr, Tooltip } from '@mui/material';
import IconButton, { type IconButtonProps } from '@mui/material/IconButton';
import { PlaylistAddSharp, PlaylistAddCheckSharp } from '@mui/icons-material';
import { type IAudioData } from '@components/Player/types';
import type {
  RootState,
  MediaItem,
  PostStory,
  Segment,
  Episode
} from '@interfaces';
import { PlayerContext } from '@components/Player/contexts/PlayerContext';
import { parseAudioData } from '@lib/parse/audio/audioData';
import { fetchAudioData } from '@store/actions/fetchAudioData';
import { getDataByResource } from '@store/reducers';
import { useAddAudioButtonStyles } from './AddAudioButton.styles';

export interface IAddAudioButtonProps extends IconButtonProps {
  id: string;
  fallbackProps?: Partial<IAudioData>;
}

export const AddAudioButton = ({
  className,
  classes,
  id,
  fallbackProps,
  ...other
}: IAddAudioButtonProps) => {
  const store = useStore<RootState>();
  const [audio, setAudio] = useState<MediaItem>();
  const [audioData, setAudioData] = useState<IAudioData>();
  const [loading, setLoading] = useState(false);
  const {
    state: playerState,
    addTrack,
    removeTrack
  } = useContext(PlayerContext);
  const { tracks } = playerState;
  const [isQueued, setIsQueued] = useState(false);
  const tooltipTitle = isQueued ? 'Remove From Playlist' : 'Add to Playlist';
  const { classes: styles, cx } = useAddAudioButtonStyles({
    isQueued,
    loading
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

  const handleAddClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    if (audioData) addTrack(audioData);
  };

  const handleRemoveClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    if (audioData) removeTrack(audioData);
  };

  const handleLoadClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    (async () => {
      setLoading(true);
      const ar = (await store.dispatch<any>(fetchAudioData(id))) as
        | MediaItem
        | undefined;

      if (!ar) return;

      const linkResource = ar.parent?.node as PostStory | Segment | Episode;
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
        addTrack(ad);
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
    const track = (tracks || []).find(({ guid }) => guid === id);
    if (track) {
      if (!audioData) setAudioData(track);
      setIsQueued(true);
    } else {
      setIsQueued(false);
    }
  }, [id, tracks, audioData]);

  return (
    <NoSsr>
      {audioData ? (
        <Tooltip title={tooltipTitle} placement="top" arrow>
          {!isQueued ? (
            <IconButton
              className={rootClassNames}
              classes={iconButtonClasses}
              disableRipple
              {...other}
              onClick={handleAddClick}
            >
              <PlaylistAddSharp classes={iconClasses} />
            </IconButton>
          ) : (
            <IconButton
              className={rootClassNames}
              classes={iconButtonClasses}
              disableRipple
              {...other}
              onClick={handleRemoveClick}
              data-queued
            >
              <PlaylistAddCheckSharp classes={iconClasses} />
            </IconButton>
          )}
        </Tooltip>
      ) : (
        <Tooltip title={tooltipTitle} placement="top" arrow>
          <IconButton
            className={rootClassNames}
            classes={iconButtonClasses}
            disableRipple
            {...other}
            onClick={handleLoadClick}
            {...(loading && { 'data-loading': true })}
          >
            {!loading ? (
              <PlaylistAddSharp classes={iconClasses} />
            ) : (
              <CircularProgress classes={progressClasses} size="1em" />
            )}
          </IconButton>
        </Tooltip>
      )}
    </NoSsr>
  );
};
