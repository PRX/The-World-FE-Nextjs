/**
 * @file Duration.tsx
 * Component for displaying formatted time.
 */

import React from 'react';
import { MetaTags } from '@interfaces';

export interface IOpenGraphProps {
  data: MetaTags;
}

export const OpenGraph = ({ data }: IOpenGraphProps) => {
  const {
    opengraphType,
    opengraphTitle,
    opengraphUrl,
    opengraphDescription,
    opengraphImage
  } = data;
  return (
    <>
      <meta
        property="fb:admins"
        content={process.env.FB_ADMINS}
        key="fb:admins"
      />
      <meta
        property="fb:app_id"
        content={process.env.FB_APP_ID}
        key="fb:app_id"
      />
      <meta
        property="og:site_name"
        content="The World from PRX"
        key="og:site_name"
      />
      <meta
        property="og:ttl"
        content="86400"
        key="og:ttl"
      />
      {opengraphType && (
        <meta property="og:type" content={opengraphType} key="og:type" />
      )}
      {opengraphTitle && (
        <meta property="og:title" content={opengraphTitle} key="og:title" />
      )}
      {opengraphUrl && (
        <meta property="og:url" content={opengraphUrl} key="og:url" />
      )}
      {opengraphDescription && (
        <meta
          property="og:description"
          content={opengraphDescription}
          key="og:description"
        />
      )}
      {opengraphImage?.sourceUrl && (
        <>
          <meta
            property="og:image"
            content={opengraphImage.sourceUrl}
            key="og:image"
          />
          {opengraphImage.mediaDetails?.width && (
            <meta
              property="og:image:width"
              content={`${opengraphImage.mediaDetails.width}`}
              key="og:image:width"
            />
          )}
          {opengraphImage.mediaDetails?.height && (
            <meta
              property="og:image:height"
              content={`${opengraphImage.mediaDetails.height}`}
              key="og:image:height"
            />
          )}
        </>
      )}
    </>
  );
};
