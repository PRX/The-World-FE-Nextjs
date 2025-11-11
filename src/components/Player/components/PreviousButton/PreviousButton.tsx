/**
 * @file PreviousButton.tsx
 * Forward button component to skip play progress forward.
 */

import React, { useContext } from 'react';
import { IconButtonProps, Tooltip } from '@mui/material';
import { SkipPrevious } from '@mui/icons-material';
import { PlayerContext } from '@components/Player/contexts/PlayerContext';
import IconButton from '@mui/material/IconButton';
import { usePreviousButtonStyles } from './PreviousButton.styles';

export interface IPreviousButtonProps extends IconButtonProps {}

export const PreviousButton = ({
  className,
  ...other
}: IPreviousButtonProps) => {
  const { previousTrack, state } = useContext(PlayerContext);
  const { currentTrackIndex } = state;
  const disabled = !currentTrackIndex;
  const { classes: styles, cx } = usePreviousButtonStyles();
  const rootClassNames = cx(styles.root, className);
  const iconClasses = {
    root: styles.iconRoot
  };

  const handleClick = () => {
    previousTrack();
  };

  return (
    <Tooltip title="Previous" placement="top" arrow>
      <IconButton
        {...other}
        className={rootClassNames}
        disabled={disabled}
        onClick={handleClick}
        disableRipple
        {...(disabled && { component: 'span' })}
      >
        <SkipPrevious classes={iconClasses} />
      </IconButton>
    </Tooltip>
  );
};
