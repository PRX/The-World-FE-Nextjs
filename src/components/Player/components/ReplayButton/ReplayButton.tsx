/**
 * @file PlayButton.tsx
 * Play button component to toggle playing state of player.
 */

import React, { useContext } from 'react';
import { IconButtonProps, Tooltip } from '@mui/material';
import { Replay5Sharp } from '@mui/icons-material';
import { PlayerContext } from '@components/Player/contexts/PlayerContext';
import IconButton from '@mui/material/IconButton';
import { useReplayButtonStyles } from './ReplayButton.styles';

export interface IReplayButtonProps extends IconButtonProps {}

export const ReplayButton = ({ className, ...other }: IReplayButtonProps) => {
  const { replay } = useContext(PlayerContext);
  const { classes: styles, cx } = useReplayButtonStyles();
  const rootClassNames = cx(styles.root, className);
  const iconClasses = {
    root: styles.iconRoot
  };

  const handleClick = () => {
    replay();
  };

  return (
    <Tooltip title="Replay Last 5 Seconds" placement="top" arrow>
      <IconButton
        {...other}
        className={rootClassNames}
        onClick={handleClick}
        disableRipple
      >
        <Replay5Sharp classes={iconClasses} />
      </IconButton>
    </Tooltip>
  );
};
