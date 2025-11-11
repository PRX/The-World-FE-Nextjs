/**
 * @file ForwardButton.tsx
 * Forward button component to skip play progress forward.
 */

import React, { useContext } from 'react';
import { IconButtonProps, Tooltip } from '@mui/material';
import { Forward30Sharp } from '@mui/icons-material';
import { PlayerContext } from '@components/Player/contexts/PlayerContext';
import IconButton from '@mui/material/IconButton';
import { useForwardButtonStyles } from './ForwardButton.styles';

export interface IForwardButtonProps extends IconButtonProps {}

export const ForwardButton = ({ className, ...other }: IForwardButtonProps) => {
  const { forward } = useContext(PlayerContext);
  const { classes: styles, cx } = useForwardButtonStyles();
  const rootClassNames = cx(styles.root, className);
  const iconClasses = {
    root: styles.iconRoot
  };

  const handleClick = () => {
    forward();
  };

  return (
    <Tooltip title="Skip Ahead 30 Seconds" placement="top" arrow>
      <IconButton
        {...other}
        className={rootClassNames}
        onClick={handleClick}
        disableRipple
      >
        <Forward30Sharp classes={iconClasses} />
      </IconButton>
    </Tooltip>
  );
};
