/**
 * @file EmbedModalContent.tsx
 * Component to display info about the current track.
 */

import React, { forwardRef, useContext, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Button, IconButton, Skeleton } from '@mui/material';
import {
  CheckSharp,
  CloseSharp,
  SelectAllSharp,
  WarningSharp
} from '@mui/icons-material';
import { PlayerContext } from '@components/Player/contexts/PlayerContext';
import { useEmbedModalContentStyles } from './EmbedModalContent.styles';

export interface IEmbedModalContentProps {
  className?: string;
  onClose?(): void;
}

export const EmbedModalContent = forwardRef<any, IEmbedModalContentProps>(
  ({ className, onClose, ...other }: IEmbedModalContentProps, ref) => {
    const { state } = useContext(PlayerContext);
    const { tracks = [], currentTrackIndex = 0 } = state;
    const currentTrack = tracks[currentTrackIndex];
    const { title, linkResource } = currentTrack || {};
    const { id: embedUrlId } = linkResource || {};
    const embedCode = `<iframe title="TheWorld.org Embedded Audio Player - ${title}" src="https://theworld.org/embed/audio/${embedUrlId}" frameborder="0" height="50" width="100%" style="margin-block: 1rem"></iframe>`;
    const [{ copied, failed }, setState] = useState({
      copied: false,
      failed: false
    });
    const EmbedCodeCopyIcon =
      (copied && CheckSharp) || (failed && WarningSharp) || SelectAllSharp;
    const EmbedCodeCopyIconTitle =
      (copied && 'Copied to clipboard!') ||
      (failed && 'Could not copy to clipboard.') ||
      'Copy code to clipboard.';
    const { classes: styles, cx } = useEmbedModalContentStyles();
    const rootClassNames = cx(styles.root, className);
    const iconClasses = {
      root: styles.iconRoot
    };

    const handleClose = () => {
      if (onClose) onClose();
    };

    const handleCopy = (text: string, result: boolean) =>
      setState({
        copied: result,
        failed: !result
      });

    return (
      <div ref={ref} {...other} className={rootClassNames}>
        <div className={styles.preview}>
          <Skeleton animation={false} />
          <Skeleton animation={false} />
          <Skeleton animation={false} />
          <Skeleton animation={false} width="75%" />
          <iframe
            title="Embedded Audio Player Preview"
            frameBorder="0"
            src={`/embed/audio/${embedUrlId}`}
            height="50"
            width="100%"
            style={{ marginBlock: '1rem' }}
          />
          <Skeleton animation={false} />
          <Skeleton animation={false} />
          <Skeleton animation={false} />
          <Skeleton animation={false} width="75%" />
        </div>
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.title}>Embed Audio</div>
            <IconButton onClick={handleClose}>
              <CloseSharp classes={iconClasses} />
            </IconButton>
          </div>
          <div className={styles.content}>
            <code id="embed-code" className={styles.code}>
              {embedCode}
            </code>
          </div>
          <div className={styles.actions}>
            <CopyToClipboard text={embedCode} onCopy={handleCopy}>
              <Button
                startIcon={<EmbedCodeCopyIcon />}
                title={EmbedCodeCopyIconTitle}
              >
                Copy
              </Button>
            </CopyToClipboard>
          </div>
        </div>
      </div>
    );
  }
);
