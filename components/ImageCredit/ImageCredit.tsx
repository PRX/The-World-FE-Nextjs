/**
 * @file ImageCredit.ts
 * Component for image credit.
 */

import type { MediaItem } from '@interfaces';
import Link from 'next/link';
import { Box } from '@mui/material';
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

  return (
    <Box className={cx(classes.root, className)}>
      {!mediaCreditUrl && mediaCredit}
      {mediaCreditUrl && (
        <Link className={classes.link} href={mediaCreditUrl} target="_blank">
          {mediaCredit}{' '}
        </Link>
      )}
    </Box>
  );
};
