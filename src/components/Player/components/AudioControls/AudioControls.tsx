/**
 * @file AudioControls.tsx
 * Play button component to toggle playing state of player.
 */

import React from 'react';
import { Box, BoxProps } from '@mui/material';
import { IAudioData } from '@components/Player/types';
import { useAudioControlsStyles } from './AudioControls.styles';
import { PlayAudioButton } from '../PlayAudioButton';
import { AddAudioButton } from '../AddAudioButton';

export interface IAudioControlsProps extends BoxProps {
  id: string;
  fallbackProps?: Partial<IAudioData>;
  variant?: 'default' | 'minimal' | 'feature';
  size?: 'small' | 'medium' | 'large';
}

export const AudioControls = ({
  id,
  fallbackProps,
  className,
  variant = 'default',
  size = 'medium',
  ...other
}: IAudioControlsProps) => {
  const { classes, cx } = useAudioControlsStyles();
  const rootClasses = cx(classes.root, className);

  return (
    <Box
      {...other}
      className={rootClasses}
      data-variant={variant}
      data-size={size}
    >
      <PlayAudioButton
        className={classes.playAudioButton}
        id={id}
        fallbackProps={fallbackProps}
      />
      <AddAudioButton
        className={classes.addAudioButton}
        id={id}
        fallbackProps={fallbackProps}
      />
    </Box>
  );
};
