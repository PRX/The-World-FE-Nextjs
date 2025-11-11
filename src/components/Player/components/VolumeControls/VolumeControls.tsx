/**
 * @file VolumeControls.tsx
 * Play progress bar control.
 */

import React, { useCallback, useContext } from 'react';
import {
  Box,
  BoxProps,
  IconButton,
  IconButtonProps,
  Slider,
  Tooltip
} from '@mui/material';
import {
  VolumeDownSharp,
  VolumeMuteSharp,
  VolumeOffSharp,
  VolumeUpSharp
} from '@mui/icons-material';
import { PlayerContext } from '../../contexts';
import { useVolumeControlsStyles } from './VolumeControls.styles';

export interface IVolumeControlsProps extends BoxProps {
  muteButtonProps?: Partial<IconButtonProps>;
}

export const VolumeControls: React.FC<IVolumeControlsProps> = ({
  className,
  muteButtonProps,
  ...other
}: IVolumeControlsProps) => {
  const { audioElm, state, setVolume, toggleMute } = useContext(PlayerContext);
  const { volume, muted } = state;
  const { classes: styles, cx } = useVolumeControlsStyles();
  const rootClassName = cx(styles.root, className);
  const iconClasses = {
    root: styles.iconRoot
  };
  let VolumeIcon = VolumeUpSharp;

  if (volume === 0) {
    VolumeIcon = VolumeMuteSharp;
  } else if (volume < 0.5) {
    VolumeIcon = VolumeDownSharp;
  }

  /**
   * Update player progress visuals.
   */
  const updateVolume = useCallback(
    (newVolume?: number) => {
      const { volume: v } = audioElm || {};
      const updatedVolume = newVolume || newVolume === 0 ? newVolume : v;

      setVolume(updatedVolume || volume);
    },
    [audioElm, setVolume]
  );

  /**
   * Update volume based on slider position.
   */
  const handleSliderChange = (e: Event, newValue: number | number[]) => {
    updateVolume(newValue as number);
  };

  const handleMuteClick = () => {
    toggleMute();
  };

  if (!audioElm) return null;

  return (
    <Box {...other} className={rootClassName}>
      <Slider
        className={styles.track}
        max={1}
        step={0.01}
        value={volume}
        onChange={handleSliderChange}
        aria-label="Volume Slider"
      />

      <Tooltip title={muted ? 'Unmute' : 'Mute'} placement="top" arrow>
        <IconButton {...muteButtonProps} onClick={handleMuteClick}>
          {muted ? (
            <VolumeOffSharp classes={iconClasses} />
          ) : (
            <VolumeIcon classes={iconClasses} />
          )}
        </IconButton>
      </Tooltip>
    </Box>
  );
};
