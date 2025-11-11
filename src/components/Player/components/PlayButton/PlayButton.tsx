/**
 * @file PlayButton.tsx
 * Play button component to toggle playing state of player.
 */

import React, { useContext } from 'react';
import { IconButtonProps, Tooltip } from '@mui/material';
import { PauseSharp, PlayArrowSharp } from '@mui/icons-material';
import { PlayerContext } from '@components/Player/contexts/PlayerContext';
import IconButton from '@mui/material/IconButton';
import { usePlayButtonStyles } from './PlayButton.styles';

export interface IPlayButtonProps extends IconButtonProps {}

export const PlayButton = ({ className, ...other }: IPlayButtonProps) => {
  const { state, togglePlayPause } = useContext(PlayerContext);
  const { playing } = state;
  const tooltipTitle = playing ? 'Pause' : 'Play';
  const { classes: styles, cx } = usePlayButtonStyles({
    playing
  });
  const rootClassNames = cx(styles.root, className);
  const iconClasses = {
    root: styles.iconRoot
  };

  const handleClick = () => {
    togglePlayPause();
  };

  return (
    <Tooltip title={tooltipTitle} placement="top" arrow>
      <IconButton
        {...other}
        className={rootClassNames}
        onClick={handleClick}
        disableRipple
      >
        {!playing && <PlayArrowSharp classes={iconClasses} />}
        {playing && <PauseSharp classes={iconClasses} />}
      </IconButton>
    </Tooltip>
  );
};
