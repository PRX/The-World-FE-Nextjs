/**
 * @file TwitterCard.tsx
 * Component for displaying formatted time.
 */

import React from 'react';
import { MetaTags } from '@interfaces';

export interface ITwitterCardProps {
  data: MetaTags;
}

export const TwitterCard = ({ data }: ITwitterCardProps) => {
  const { twitterTitle, twitterDescription, twitterImage } = data;
  return (
    <>
      <meta
        name="twitter:account_id"
        content={process.env.TWITTER_ACCOUNT_ID}
      />
      <meta name="twitter:card" content="summary_large_image" />
      {twitterTitle && <meta name="twitter:title" content={twitterTitle} />}
      {twitterDescription && (
        <meta name="twitter:description" content={twitterDescription} />
      )}
      {twitterImage?.sourceUrl && (
        <meta name="twitter:image" content={twitterImage.sourceUrl} />
      )}
    </>
  );
};
