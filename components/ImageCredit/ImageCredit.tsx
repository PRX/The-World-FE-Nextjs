/**
 * @file ImageCredit.ts
 * Component for image credit.
 */

import type { MediaItem } from '@interfaces';
import { Box } from '@mui/material';
import { ContentLink } from '@components/ContentLink';
import { imageCreditStyles } from './ImageCredit.styles';

export type ImageCreditProps = {
  data: MediaItem;
  className?: string;
};

export const ImageCredit = ({ data, className }: ImageCreditProps) => {
  const { imageFields } = data;
  const { mediaCredit, mediaCreditUrl } = imageFields || {};
  const { classes, cx } = imageCreditStyles();

  if (!mediaCredit) return null;

  if (!mediaCreditUrl) return <span>{mediaCredit}</span>;

  return (
    <Box className={cx(classes.root, className)}>
      {!mediaCreditUrl && mediaCredit}
      {mediaCreditUrl && (
        <ContentLink
          className={classes.link}
          url={mediaCreditUrl}
          target="_blank"
        >
          {mediaCredit}{' '}
        </ContentLink>
      )}
    </Box>
  );
};
