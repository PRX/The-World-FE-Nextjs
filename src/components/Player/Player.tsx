/**
 * @file Player.tsx
 * Higher order component for Audio Player
 */

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef
} from 'react';
import { useStore } from 'react-redux';
import { usePlausible } from 'next-plausible';
import { UiAction } from '@interfaces/state';
import { convertDurationToSeconds } from '@lib/convert/string/convertDurationToSeconds';
import { PlayerContext } from './contexts';
import { PlayerActionTypes } from './state';
import { IAudioData } from './types';
import { playerInitialState, playerStateReducer } from './state/Player.reducer';

export interface IPlayerProps extends React.PropsWithChildren<{}> {}

export interface KeyboardEventWithTarget extends KeyboardEvent {
  target: HTMLElement;
}

export const Player = ({ children }: IPlayerProps) => {
  const plausible = usePlausible();
  const store = useStore();
  const audioElm = useRef<HTMLAudioElement>(null);
  const [state, dispatch] = useReducer(playerStateReducer, {
    ...playerInitialState
  });
  const {
    tracks = [],
    playing,
    currentTrackIndex = 0,
    currentTime,
    muted,
    volume
  } = state;
  const currentTrack = tracks?.[currentTrackIndex] || ({} as IAudioData);
  const currentTrackDurationSeconds = useMemo(
    () => convertDurationToSeconds(currentTrack.duration),
    [currentTrack.duration]
  );
  const { url } = currentTrack;

  const boundedTime = useCallback(
    (time: number) =>
      Math.min(
        Math.max(0.00001, time),
        audioElm.current?.duration || currentTrackDurationSeconds
      ),
    [currentTrackDurationSeconds]
  );

  const boundedVolume = useCallback(
    (newVolume: number) => Math.min(Math.max(0, newVolume), 1),
    []
  );

  const play = () => {
    dispatch({
      type: PlayerActionTypes.PLAYER_PLAY
    });
  };

  const playTrack = (index: number) => {
    dispatch({
      type: PlayerActionTypes.PLAYER_PLAY_TRACK,
      payload: index
    });
  };

  const playAudio = useCallback(
    (audioData: IAudioData) => {
      const audioTrackIndex = (tracks || []).findIndex(
        ({ guid }) => guid === audioData.guid
      );
      const notQueued = audioTrackIndex === -1;

      if (notQueued) {
        // Plausible: Queued
        plausible('App Player: Queued', {
          props: {
            Title: audioData.title,
            'Queued From': audioData.queuedFrom
          }
        });
      }
      dispatch({
        type: PlayerActionTypes.PLAYER_PLAY_AUDIO,
        payload: audioData
      });
    },
    [plausible, tracks]
  );

  const pause = () => {
    dispatch({
      type: PlayerActionTypes.PLAYER_PAUSE
    });
  };

  const togglePlayPause = () => {
    dispatch({
      type: PlayerActionTypes.PLAYER_TOGGLE_PLAYING
    });
  };

  const enableAutoplay = () => {
    dispatch({
      type: PlayerActionTypes.PLAYER_AUTOPLAY_ENABLE
    });
  };

  const disableAutoplay = () => {
    dispatch({
      type: PlayerActionTypes.PLAYER_AUTOPLAY_DISABLE
    });
  };

  const toggleAutoplay = () => {
    dispatch({
      type: PlayerActionTypes.PLAYER_TOGGLE_AUTOPLAY
    });
  };

  const seekTo = useCallback(
    (time: number) => {
      dispatch({
        type: PlayerActionTypes.PLAYER_UPDATE_CURRENT_TIME,
        payload: boundedTime(time)
      });
    },
    [boundedTime]
  );

  const seekBy = useCallback(
    (seconds: number) => {
      seekTo((audioElm.current?.currentTime || 0) + seconds);
    },
    [seekTo]
  );

  const seekToRelative = useCallback(
    (ratio: number) => {
      seekTo(
        (audioElm.current?.duration || currentTrackDurationSeconds) * ratio
      );
    },
    [currentTrackDurationSeconds, seekTo]
  );

  const replay = useCallback(() => {
    seekBy(-5);
  }, [seekBy]);

  const forward = useCallback(() => {
    seekBy(30);
  }, [seekBy]);

  const setTrack = (index: number) => {
    dispatch({
      type: PlayerActionTypes.PLAYER_UPDATE_CURRENT_TRACK_INDEX,
      payload: index
    });
  };

  const setTracks = (newTracks: IAudioData[]) => {
    dispatch({
      type: PlayerActionTypes.PLAYER_UPDATE_TRACKS,
      payload: newTracks
    });
  };

  const addTrack = useCallback(
    (newTrack: IAudioData) => {
      // Plausible: Queued
      plausible('App Player: Queued', {
        props: {
          Title: newTrack.title,
          'Queued From': newTrack.queuedFrom
        }
      });

      dispatch({
        type: PlayerActionTypes.PLAYER_ADD_TRACK,
        payload: newTrack
      });
    },
    [plausible]
  );

  const removeTrack = (track: IAudioData) => {
    dispatch({
      type: PlayerActionTypes.PLAYER_REMOVE_TRACK,
      payload: track
    });
  };

  const clearPlaylist = () => {
    dispatch({
      type: PlayerActionTypes.PLAYER_REMOVE_ALL_TRACKS
    });
  };

  const previousTrack = () => {
    dispatch({
      type: PlayerActionTypes.PLAYER_PREVIOUS_TRACK
    });
  };

  const nextTrack = () => {
    dispatch({
      type: PlayerActionTypes.PLAYER_NEXT_TRACK
    });
  };

  const volumeUp = useCallback(() => {
    dispatch({
      type: PlayerActionTypes.PLAYER_UPDATE_VOLUME,
      payload: boundedVolume((audioElm.current?.volume || state.volume) + 0.05)
    });
  }, [boundedVolume]);

  const volumeDown = useCallback(() => {
    dispatch({
      type: PlayerActionTypes.PLAYER_UPDATE_VOLUME,
      payload: boundedVolume((audioElm.current?.volume || state.volume) - 0.05)
    });
  }, [boundedVolume]);

  const setVolume = useCallback(
    (newVolume: number) => {
      dispatch({
        type: PlayerActionTypes.PLAYER_UPDATE_VOLUME,
        payload: boundedVolume(newVolume)
      });
    },
    [boundedVolume]
  );

  const toggleMute = () => {
    dispatch({
      type: PlayerActionTypes.PLAYER_TOGGLE_MUTED
    });
  };

  const updateMediaSession = useCallback(() => {
    const artworkSrc = currentTrack.imageUrl;
    if (navigator && 'mediaSession' in navigator) {
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: currentTrack.title,
        artist: currentTrack.subtitle,
        ...(artworkSrc && {
          artwork: [
            {
              src: artworkSrc
            }
          ]
        })
      });
      navigator?.mediaSession.setActionHandler('play', () => {
        play();
      });
      navigator?.mediaSession.setActionHandler('pause', () => {
        pause();
      });
      navigator?.mediaSession.setActionHandler('seekto', (e) => {
        seekTo(e.seekTime);
      });
      navigator?.mediaSession.setActionHandler('seekbackward', () => {
        replay();
      });
      navigator?.mediaSession.setActionHandler('seekforward', () => {
        forward();
      });

      if (tracks?.length > 1) {
        navigator?.mediaSession.setActionHandler('previoustrack', () => {
          previousTrack();
        });

        navigator?.mediaSession.setActionHandler('nexttrack', () => {
          nextTrack();
        });
      }
    }
  }, [
    currentTrack.imageUrl,
    currentTrack.subtitle,
    currentTrack.title,
    forward,
    replay,
    seekTo,
    tracks?.length
  ]);

  const playerContextValue = useMemo(
    () => ({
      audioElm: audioElm.current,
      state,
      play,
      playTrack,
      playAudio,
      pause,
      togglePlayPause,
      enableAutoplay,
      disableAutoplay,
      toggleAutoplay,
      toggleMute,
      seekTo,
      seekBy,
      replay,
      forward,
      seekToRelative,
      setTrack,
      setTracks,
      addTrack,
      removeTrack,
      clearPlaylist,
      previousTrack,
      nextTrack,
      setVolume
    }),
    [
      state,
      playAudio,
      seekTo,
      seekBy,
      replay,
      forward,
      seekToRelative,
      addTrack,
      setVolume
    ]
  );

  const startPlaying = useCallback(() => {
    audioElm.current
      ?.play()
      .then(() => {
        updateMediaSession();
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.error(e);
      });
  }, [updateMediaSession]);

  const pauseAudio = useCallback(() => {
    audioElm.current?.pause();
  }, []);

  const loadAudio = (src: string, isPlaying: boolean) => {
    if (audioElm.current && src !== audioElm.current.src) {
      audioElm.current.preload = isPlaying ? 'auto' : 'none';
      audioElm.current.src = src;
    }
  };

  const handlePlay = useCallback(() => {
    if (!playing) {
      dispatch({
        type: PlayerActionTypes.PLAYER_PLAY
      });
    }
  }, [playing]);

  const handlePause = useCallback(() => {
    if (audioElm.current && !audioElm.current.ended) {
      dispatch({
        type: PlayerActionTypes.PLAYER_PAUSE
      });
    }
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    // When audio data loads, update duration and current time, then start
    // playing if we were playing before.
    dispatch({
      type: PlayerActionTypes.PLAYER_UPDATE_CURRENT_DURATION,
      payload: audioElm.current?.duration || currentTrackDurationSeconds
    });

    if (playing) {
      // Plausible: Played
      plausible('App Player: Played', {
        props: {
          Title: currentTrack.title
        }
      });
      startPlaying();
    }
  }, [currentTrack.title, plausible, playing, startPlaying]);

  const handleEnded = useCallback(() => {
    // Plausible: Completed
    plausible('App Player: Completed', {
      props: {
        Title: currentTrack.title
      }
    });

    dispatch({
      type: PlayerActionTypes.PLAYER_COMPLETE_CURRENT_TRACK
    });
  }, [currentTrack.title, plausible]);

  const handleHotkey = useCallback(
    (event: KeyboardEventWithTarget) => {
      const key = event.code || event.key;
      const hasModifier =
        event.altKey || event.shiftKey || event.ctrlKey || event.metaKey;
      const fromInput = ['INPUT', 'TEXTAREA'].includes(event.target.nodeName);

      // Bail if modifier key is pressed to allow browser shortcuts to function,
      // or event originated from a form input.
      if (hasModifier || fromInput) return;

      switch (key) {
        case 'KeyA':
          toggleAutoplay();
          break;
        case 'KeyS':
          if (audioElm.current) {
            audioElm.current.playbackRate = 3 - audioElm.current.playbackRate;
          }
          break;
        case 'KeyM':
          toggleMute();
          break;
        case 'Space':
          // Only toggle playback when space key is not used on a button.
          if (event.target.nodeName !== 'BUTTON') {
            togglePlayPause();
          }
          break;
        case 'KeyK':
          togglePlayPause();
          break;
        case 'KeyJ':
          seekBy(-10);
          break;
        case 'KeyL':
          seekBy(10);
          break;
        case 'ArrowLeft':
          seekBy(-5);
          break;
        case 'ArrowRight':
          seekBy(5);
          break;
        case 'Comma':
          if (!playing) {
            seekBy(-1 / 30);
          }
          break;
        case 'Period':
          if (!playing) {
            seekBy(1 / 30);
          }
          break;
        case 'Home':
          seekTo(0);
          break;
        case 'End':
          seekToRelative(1);
          break;
        case 'Digit1':
          seekToRelative(0.1);
          break;
        case 'Digit2':
          seekToRelative(0.2);
          break;
        case 'Digit3':
          seekToRelative(0.3);
          break;
        case 'Digit4':
          seekToRelative(0.4);
          break;
        case 'Digit5':
          seekToRelative(0.5);
          break;
        case 'Digit6':
          seekToRelative(0.6);
          break;
        case 'Digit7':
          seekToRelative(0.7);
          break;
        case 'Digit8':
          seekToRelative(0.8);
          break;
        case 'Digit9':
          seekToRelative(0.9);
          break;
        case 'Digit0':
          seekTo(0);
          break;
        case 'BracketLeft':
          previousTrack();
          break;
        case 'BracketRight':
          nextTrack();
          break;
        case 'Equal':
          volumeUp();
          break;
        case 'Minus':
          volumeDown();
          break;
        default:
          break;
      }
    },
    [audioElm, playing, seekBy, seekTo, seekToRelative, volumeDown, volumeUp]
  );

  useEffect(() => {
    const playerStateJson = localStorage?.getItem('playerState');

    if (playerStateJson) {
      dispatch({
        type: PlayerActionTypes.PLAYER_HYDRATE,
        payload: JSON.parse(playerStateJson)
      });
    }
  }, []);

  useEffect(() => {
    if (localStorage) {
      localStorage.setItem(
        'playerState',
        JSON.stringify({
          ...state,
          playing: false
        })
      );
    }
  }, [state]);

  useEffect(() => {
    if (tracks.length) {
      store.dispatch<UiAction>({
        type: 'UI_PLAYER_OPEN'
      });
    } else {
      store.dispatch<UiAction>({
        type: 'UI_PLAYER_CLOSE'
      });
    }
  }, [store, tracks.length]);

  useEffect(() => {
    // Setup event handlers on audio element.
    audioElm.current?.addEventListener('play', handlePlay);
    audioElm.current?.addEventListener('pause', handlePause);
    audioElm.current?.addEventListener('loadedmetadata', handleLoadedMetadata);
    audioElm.current?.addEventListener('ended', handleEnded);

    window.addEventListener('keydown', handleHotkey);

    return () => {
      // Cleanup event handlers between dependency changes.
      audioElm.current?.removeEventListener('play', handlePlay);
      audioElm.current?.removeEventListener('pause', handlePause);
      audioElm.current?.removeEventListener(
        'loadedmetadata',
        handleLoadedMetadata
      );
      audioElm.current?.removeEventListener('ended', handleEnded);

      window.removeEventListener('keydown', handleHotkey);
    };
  }, [
    handleEnded,
    handleHotkey,
    handleLoadedMetadata,
    handlePause,
    handlePlay
  ]);

  /**
   * Have to use `useLayoutEffect` so Safari can understand the `startPlay` call
   * is a result of a user interaction. `useEffect` seems to disconnect that inference.
   * See https://lukecod.es/2020/08/27/ios-cant-play-youtube-via-react-useeffect/
   * Solution was for video playback, but same issue seems to apply to audio.
   */
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useLayoutEffect(() => {
      if (!audioElm.current) return;

      if (!playing) {
        pauseAudio();
      } else {
        startPlaying();
      }
    }, [pauseAudio, playing, startPlaying]);
  }

  useEffect(() => {
    if (audioElm.current) audioElm.current.muted = muted;
  }, [muted]);

  useEffect(() => {
    if (audioElm.current)
      audioElm.current.volume = volume || audioElm.current.volume;
  }, [volume]);

  useEffect(() => {
    if (audioElm.current) audioElm.current.currentTime = currentTime;
  }, [currentTime]);

  useEffect(() => {
    loadAudio(url, playing);
  }, [url, playing]);

  useEffect(
    () => () => {
      // Pause audio when unmounting.
      pauseAudio();
    },
    [pauseAudio]
  );

  return (
    <PlayerContext.Provider value={playerContextValue}>
      <audio ref={audioElm} />
      {children}
    </PlayerContext.Provider>
  );
};
