/**
 * @file ImageCredit.ts
 * Component for image credit.
 */

import type { MediaItem } from '@interfaces';
import Link from 'next/link';
import { Typography } from '@mui/material';
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
    <Typography className={cx(classes.root, className)} variant="caption">
      {!mediaCreditUrl && mediaCredit}
      {mediaCreditUrl && (
        <Link className={classes.link} href={mediaCreditUrl} target="_blank">
          {mediaCredit}{' '}
        </Link>
      )}
    </Typography>
  );
};
