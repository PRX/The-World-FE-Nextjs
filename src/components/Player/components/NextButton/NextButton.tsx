/**
 * @file NextButton.tsx
 * Forward button component to skip play progress forward.
 */

import React, { useContext } from 'react';
import clsx from 'clsx';
import { IconButtonProps, Tooltip } from '@mui/material';
import { SkipNextSharp } from '@mui/icons-material';
import { PlayerContext } from '@components/Player/contexts/PlayerContext';
import IconButton from '@mui/material/IconButton';
import { useNextButtonStyles } from './NextButton.styles';

export interface INextButtonProps extends IconButtonProps {}

export const NextButton = ({ className, ...other }: INextButtonProps) => {
  const { nextTrack, state } = useContext(PlayerContext);
  const { currentTrackIndex, tracks } = state;
  const disabled = tracks ? currentTrackIndex === tracks.length - 1 : true;
  const { classes: styles } = useNextButtonStyles();
  const rootClassNames = clsx(styles.root, className);
  const iconClasses = {
    root: styles.iconRoot
  };

  const handleClick = () => {
    nextTrack();
  };

  return (
    <Tooltip title="Next" placement="top" arrow>
      <IconButton
        {...other}
        className={rootClassNames}
        disabled={disabled}
        onClick={handleClick}
        disableRipple
        {...(disabled && { component: 'span' })}
      >
        <SkipNextSharp classes={iconClasses} />
      </IconButton>
    </Tooltip>
  );
};
