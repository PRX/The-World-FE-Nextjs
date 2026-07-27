"use client";

/**
 * @file Player.tsx
 * Higher order component for Audio Player
 */

import type React from "react";
import type { IPlayerState, PlayerAudio, PlayerTrack } from "./types";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import { usePlausible } from "next-plausible";
import { PlayerContext } from "./contexts";
import { PlayerActionTypes } from "./state";
import { playerInitialState, playerStateReducer } from "./state/Player.reducer";

export type PlayerProps = React.PropsWithChildren & Partial<IPlayerState>;

export type KeyboardEventWithTarget = KeyboardEvent & {
  target: EventTarget;
};

export const Player = ({ children, ...initialState }: PlayerProps) => {
  const plausible = usePlausible();
  const el = useRef<HTMLAudioElement>(null);
  const [state, dispatch] = useReducer(playerStateReducer, {
    ...playerInitialState,
    ...initialState,
  });
  const { tracks = [], playing, currentTrackIndex = 0, standalone } = state;
  const currentTrack = tracks?.[currentTrackIndex] || ({} as PlayerAudio);
  const currentTrackDurationSeconds = currentTrack.duration || 0;
  const { mediaType } = currentTrack;
  const isAudioTrack = mediaType === "audio";
  const { url } = isAudioTrack ? currentTrack : {};

  const boundedTime = useCallback(
    (time: number) =>
      Math.min(
        Math.max(0.00001, time),
        el.current?.duration || currentTrackDurationSeconds,
      ),
    [currentTrackDurationSeconds],
  );

  const boundedVolume = useCallback(
    (newVolume: number) => Math.min(Math.max(0, newVolume), 1),
    [],
  );

  const play = useCallback(() => {
    dispatch({
      type: PlayerActionTypes.PLAYER_PLAY,
    });
  }, []);

  const playTrackAt = useCallback((index: number) => {
    dispatch({
      type: PlayerActionTypes.PLAYER_PLAY_TRACK,
      payload: index,
    });
  }, []);

  const playTrack = useCallback(
    (trackData: PlayerTrack) => {
      const audioTrackIndex = (tracks || []).findIndex(
        ({ id }) => id === trackData.id,
      );
      const notQueued = audioTrackIndex === -1;

      if (notQueued) {
        // Plausible: Queued
        plausible("App Player: Queued", {
          props: {
            Title: trackData.title,
            "Queued From": trackData.queuedFrom,
          },
        });
      }
      dispatch({
        type: PlayerActionTypes.PLAYER_PLAY_AUDIO,
        payload: trackData,
      });
    },
    [plausible, tracks],
  );

  const pause = useCallback(() => {
    dispatch({
      type: PlayerActionTypes.PLAYER_PAUSE,
    });
  }, []);

  const togglePlayPause = useCallback(() => {
    dispatch({
      type: PlayerActionTypes.PLAYER_TOGGLE_PLAYING,
    });
  }, []);

  const enableAutoplay = useCallback(() => {
    dispatch({
      type: PlayerActionTypes.PLAYER_AUTOPLAY_ENABLE,
    });
  }, []);

  const disableAutoplay = useCallback(() => {
    dispatch({
      type: PlayerActionTypes.PLAYER_AUTOPLAY_DISABLE,
    });
  }, []);

  const toggleAutoplay = useCallback(() => {
    dispatch({
      type: PlayerActionTypes.PLAYER_TOGGLE_AUTOPLAY,
    });
  }, []);

  const seekTo = useCallback(
    (time: number) => {
      if (el.current) {
        el.current.currentTime = boundedTime(time);
      }
    },
    [boundedTime],
  );

  const seekBy = useCallback(
    (seconds: number) => {
      seekTo((el.current?.currentTime || 0) + seconds);
    },
    [seekTo],
  );

  const seekToRelative = useCallback(
    (ratio: number) => {
      seekTo((el.current?.duration || currentTrackDurationSeconds) * ratio);
    },
    [currentTrackDurationSeconds, seekTo],
  );

  const replay = useCallback(() => {
    seekBy(-5);
  }, [seekBy]);

  const forward = useCallback(() => {
    seekBy(30);
  }, [seekBy]);

  const setTrack = useCallback((index: number) => {
    dispatch({
      type: PlayerActionTypes.PLAYER_UPDATE_CURRENT_TRACK_INDEX,
      payload: index,
    });
  }, []);

  const setTracks = useCallback((newTracks: PlayerAudio[]) => {
    dispatch({
      type: PlayerActionTypes.PLAYER_UPDATE_TRACKS,
      payload: newTracks,
    });
  }, []);

  const addTrack = useCallback(
    (newTrack: PlayerAudio) => {
      // Plausible: Queued
      plausible("App Player: Queued", {
        props: {
          Title: newTrack.title,
          "Queued From": newTrack.queuedFrom,
        },
      });

      dispatch({
        type: PlayerActionTypes.PLAYER_ADD_TRACK,
        payload: newTrack,
      });
    },
    [plausible],
  );

  const removeTrack = useCallback((track: PlayerAudio) => {
    dispatch({
      type: PlayerActionTypes.PLAYER_REMOVE_TRACK,
      payload: track,
    });
  }, []);

  const clearPlaylist = useCallback(() => {
    dispatch({
      type: PlayerActionTypes.PLAYER_REMOVE_ALL_TRACKS,
    });
  }, []);

  const previousTrack = useCallback(() => {
    dispatch({
      type: PlayerActionTypes.PLAYER_PREVIOUS_TRACK,
    });
  }, []);

  const nextTrack = useCallback(() => {
    dispatch({
      type: PlayerActionTypes.PLAYER_NEXT_TRACK,
    });
  }, []);

  const volumeUp = useCallback(() => {
    const bv = boundedVolume((el.current ? el.current.volume : 0.8) + 0.05);

    if (el.current) {
      el.current.volume = bv;
    }

    return el.current?.volume || bv;
  }, [boundedVolume]);

  const volumeDown = useCallback(() => {
    const bv = boundedVolume((el.current ? el.current.volume : 0.8) - 0.05);

    if (el.current) {
      el.current.volume = bv;
    }

    return el.current?.volume || bv;
  }, [boundedVolume]);

  const setVolume = useCallback(
    (newVolume: number) => {
      const bv = boundedVolume(newVolume);

      if (el.current) {
        el.current.volume = bv;
      }

      return el.current ? el.current.volume : bv;
    },
    [boundedVolume],
  );

  const toggleMute = useCallback(() => {
    if (el.current) el.current.muted = !el.current.muted;
    return !!el.current?.muted;
  }, []);

  const isQueued = useCallback(
    (id: string) => {
      return !!tracks.find((track) => track.id === id);
    },
    [tracks],
  );

  const isCurrentTrack = useCallback(
    (id: string) => {
      return currentTrack?.id === id;
    },
    [currentTrack],
  );

  const isPlaying = useCallback(
    (id: string) => {
      return isCurrentTrack(id) && playing;
    },
    [isCurrentTrack, playing],
  );

  const updateMediaSession = useCallback(() => {
    const artworkSrc = currentTrack.imageUrl;
    if (navigator && "mediaSession" in navigator) {
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: currentTrack.title,
        artist: currentTrack.info
          ?.map((v) => {
            try {
              return Temporal.PlainDate.from(v).toLocaleString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              });
            } catch (_e) {
              return v;
            }
          })
          .join(" / "),
        ...(artworkSrc && {
          artwork: [
            {
              src: artworkSrc,
            },
          ],
        }),
      });
      navigator?.mediaSession.setActionHandler("play", () => {
        play();
      });
      navigator?.mediaSession.setActionHandler("pause", () => {
        pause();
      });
      navigator?.mediaSession.setActionHandler("seekto", (e) => {
        seekTo(e.seekTime || 0);
      });
      navigator?.mediaSession.setActionHandler("seekbackward", () => {
        replay();
      });
      navigator?.mediaSession.setActionHandler("seekforward", () => {
        forward();
      });

      if (tracks?.length > 1) {
        navigator?.mediaSession.setActionHandler("previoustrack", () => {
          previousTrack();
        });

        navigator?.mediaSession.setActionHandler("nexttrack", () => {
          nextTrack();
        });
      }
    }
  }, [
    currentTrack.imageUrl,
    currentTrack.info,
    currentTrack.title,
    forward,
    replay,
    seekTo,
    tracks?.length,
    nextTrack,
    pause,
    play,
    previousTrack,
  ]);

  const playerContextValue = useMemo(
    () => ({
      el,
      state,
      play,
      playTrackAt,
      playTrack,
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
      setVolume,
      isQueued,
      isCurrentTrack,
      isPlaying,
    }),
    [
      state,
      playTrack,
      seekTo,
      seekBy,
      replay,
      forward,
      seekToRelative,
      addTrack,
      setVolume,
      play,
      playTrackAt,
      pause,
      togglePlayPause,
      enableAutoplay,
      disableAutoplay,
      toggleAutoplay,
      toggleMute,
      setTrack,
      setTracks,
      removeTrack,
      clearPlaylist,
      previousTrack,
      nextTrack,
      isQueued,
      isCurrentTrack,
      isPlaying,
    ],
  );

  const startPlaying = useCallback(() => {
    el.current
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
    el.current?.pause();
  }, []);

  const loadAudio = useCallback((src: string, isPlaying: boolean) => {
    if (el.current && src !== el.current.src) {
      el.current.preload = isPlaying ? "auto" : "none";
      el.current.src = src;
    }
  }, []);

  const handlePlay = useCallback(() => {
    if (!playing) {
      dispatch({
        type: PlayerActionTypes.PLAYER_PLAY,
      });
    }
  }, [playing]);

  const handlePause = useCallback(() => {
    if (el.current && !el.current.ended) {
      dispatch({
        type: PlayerActionTypes.PLAYER_PAUSE,
      });
    }
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    // When audio data loads, start playing if we were playing before.
    if (playing) {
      // Plausible: Played
      plausible("App Player: Played", {
        props: {
          Title: currentTrack.title,
        },
      });
      startPlaying();
    }
  }, [currentTrack.title, plausible, playing, startPlaying]);

  const handleEnded = useCallback(() => {
    // Plausible: Completed
    plausible("App Player: Completed", {
      props: {
        Title: currentTrack.title,
      },
    });

    dispatch({
      type: PlayerActionTypes.PLAYER_COMPLETE_CURRENT_TRACK,
    });
  }, [currentTrack.title, plausible]);

  const handleHotkey = useCallback(
    (event: KeyboardEvent) => {
      const key = event.code || event.key;
      const hasModifier =
        event.altKey || event.shiftKey || event.ctrlKey || event.metaKey;
      const target = event.target as HTMLElement;
      const targetNodeName = target.nodeName;
      const targetRole = target.getAttribute("role");
      const fromInput = ["INPUT", "TEXTAREA"].includes(targetNodeName);

      // Bail if modifier key is pressed to allow browser shortcuts to function,
      // or event originated from a form input.
      if (hasModifier || fromInput) return;

      if (tracks.length) {
        event.preventDefault();
      }

      switch (key) {
        case "KeyA":
          toggleAutoplay();
          break;
        case "KeyS":
          if (el.current) {
            el.current.playbackRate = 3 - el.current.playbackRate;
          }
          break;
        case "KeyM":
          toggleMute();
          break;
        case "Space":
          // Only toggle playback when space key is not used on a button.
          if (targetNodeName !== "BUTTON") {
            togglePlayPause();
          }
          break;
        case "KeyK":
          togglePlayPause();
          break;
        case "KeyJ":
          seekBy(-10);
          break;
        case "KeyL":
          seekBy(10);
          break;
        case "ArrowLeft":
          if (!targetRole || ["slider"].includes(targetRole)) {
            seekBy(-5);
          }
          break;
        case "ArrowRight":
          if (!targetRole || ["slider"].includes(targetRole)) {
            seekBy(5);
          }
          break;
        case "Comma":
          if (!playing) {
            seekBy(-1 / 30);
          }
          break;
        case "Period":
          if (!playing) {
            seekBy(1 / 30);
          }
          break;
        case "Home":
          seekTo(0);
          break;
        case "End":
          seekToRelative(1);
          break;
        case "Digit1":
          seekToRelative(0.1);
          break;
        case "Digit2":
          seekToRelative(0.2);
          break;
        case "Digit3":
          seekToRelative(0.3);
          break;
        case "Digit4":
          seekToRelative(0.4);
          break;
        case "Digit5":
          seekToRelative(0.5);
          break;
        case "Digit6":
          seekToRelative(0.6);
          break;
        case "Digit7":
          seekToRelative(0.7);
          break;
        case "Digit8":
          seekToRelative(0.8);
          break;
        case "Digit9":
          seekToRelative(0.9);
          break;
        case "Digit0":
          seekTo(0);
          break;
        case "BracketLeft":
          previousTrack();
          break;
        case "BracketRight":
          nextTrack();
          break;
        case "Equal":
          volumeUp();
          break;
        case "Minus":
          volumeDown();
          break;
        default:
          break;
      }
    },
    [
      playing,
      seekBy,
      seekTo,
      seekToRelative,
      volumeDown,
      volumeUp,
      nextTrack,
      previousTrack,
      toggleAutoplay,
      toggleMute,
      togglePlayPause,
      tracks.length,
    ],
  );

  useEffect(() => {
    if (standalone) return;

    const playerStateJson = localStorage?.getItem("playerState");

    if (playerStateJson) {
      const payload = JSON.parse(playerStateJson) as IPlayerState;

      dispatch({
        type: PlayerActionTypes.PLAYER_HYDRATE,
        payload,
      });
    }
  }, [standalone]);

  useEffect(() => {
    if (!standalone && localStorage) {
      localStorage.setItem(
        "playerState",
        JSON.stringify({
          ...state,
          playing: false,
        }),
      );
    }
  }, [state, standalone]);

  useEffect(() => {
    // Setup event handlers on audio element.
    el.current?.addEventListener("play", handlePlay);
    el.current?.addEventListener("pause", handlePause);
    el.current?.addEventListener("loadedmetadata", handleLoadedMetadata);
    el.current?.addEventListener("ended", handleEnded);

    window.addEventListener("keydown", handleHotkey);

    return () => {
      // Cleanup event handlers between dependency changes.
      el.current?.removeEventListener("play", handlePlay);
      el.current?.removeEventListener("pause", handlePause);
      el.current?.removeEventListener("loadedmetadata", handleLoadedMetadata);
      el.current?.removeEventListener("ended", handleEnded);

      window.removeEventListener("keydown", handleHotkey);
    };
  }, [
    handleEnded,
    handleHotkey,
    handleLoadedMetadata,
    handlePause,
    handlePlay,
  ]);

  /**
   * Have to use `useLayoutEffect` so Safari can understand the `startPlay` call
   * is a result of a user interaction. `useEffect` seems to disconnect that inference.
   * See https://lukecod.es/2020/08/27/ios-cant-play-youtube-via-react-useeffect/
   * Solution was for video playback, but same issue seems to apply to audio.
   */
  useLayoutEffect(() => {
    if (!el.current) return;

    if (!playing) {
      pauseAudio();
    } else {
      startPlaying();
    }
  }, [pauseAudio, playing, startPlaying]);

  useEffect(() => {
    if (!url) return;
    loadAudio(url, playing);
  }, [url, playing, loadAudio]);

  useEffect(
    () => () => {
      // Pause audio when unmounting.
      pauseAudio();
    },
    [pauseAudio],
  );

  useEffect(() => {
    if (tracks.length) {
      document.dispatchEvent(
        new CustomEvent("player-open", {
          bubbles: true,
          cancelable: true,
        }),
      );
    } else {
      document.dispatchEvent(
        new CustomEvent("player-close", {
          bubbles: true,
          cancelable: true,
        }),
      );
    }
  }, [tracks.length]);

  return (
    <PlayerContext.Provider value={playerContextValue}>
      {/** biome-ignore lint/a11y/useMediaCaption: Captions coming soon. */}
      {isAudioTrack && <audio ref={el} />}
      {children}
    </PlayerContext.Provider>
  );
};
