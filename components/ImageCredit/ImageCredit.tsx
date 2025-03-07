/**
 * @file ImageCredit.ts
 * Component for image credit.
 */

import type { MediaItem } from '@interfaces';
import { Typography } from '@mui/material';
import { isLocalUrl } from '@lib/parse/url';
import { ContentLink } from '@components/ContentLink';
import { imageCreditStyles } from './ImageCredit.styles';

export type ImageCreditProps = {
  data: MediaItem;
  className?: string;
};

export const ImageCredit = ({ data, className }: ImageCreditProps) => {
  const { imageFields } = data;
  const { mediaCredit, mediaCreditUrl } = imageFields || {};
  const mediaCreditUrlIsLocal = !!mediaCreditUrl && isLocalUrl(mediaCreditUrl);
  const { classes, cx } = imageCreditStyles();

  if (!mediaCredit) return null;

  return (
    <Typography className={cx(classes.root, className)} variant="caption">
      {!mediaCreditUrl && mediaCredit}
      {mediaCreditUrl && mediaCreditUrlIsLocal && (
        <ContentLink
          className={classes.link}
          href={mediaCreditUrl}
          target="_blank"
          rel="noreferrer"
        >
          {mediaCredit}
        </ContentLink>
      )}
      {mediaCreditUrl && !mediaCreditUrlIsLocal && (
        <a
          className={classes.link}
          href={mediaCreditUrl}
          target="_blank"
          rel="noreferrer"
        >
          {mediaCredit}
        </a>
      )}
    </Typography>
  );
};
