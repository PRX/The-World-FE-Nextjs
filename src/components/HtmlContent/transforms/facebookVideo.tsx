/**
 * @file facebookVideo.ts
 *
 * Transform for rendering facebook post embeds.
 */
import React from 'react';
import { FacebookProvider, EmbeddedVideo } from 'react-facebook';
import { DomElement } from 'htmlparser2';

export const facebookVideo = (node: DomElement) => {
  let embedUrl: string | null;

  switch (true) {
    case node.type === 'tag' &&
      node.name === 'div' &&
      'data-oembed-url' in node.attribs &&
      /\/\/facebook\.com\/[^/]+\/videos\//.test(
        node.attribs['data-oembed-url']
      ):
      [embedUrl] = node.attribs['data-oembed-url'].split('?');
      break;

    case node.type === 'tag' &&
      node.name === 'div' &&
      'class' in node.attribs &&
      /fb-video/.test(node.attribs.class):
      embedUrl = node.attribs['data-href'];
      break;

    default:
      embedUrl = null;
      break;
  }

  if (embedUrl && process.env.FB_APP_ID) {
    return (
      <FacebookProvider appId={process.env.FB_APP_ID}>
        <EmbeddedVideo href={embedUrl} />
      </FacebookProvider>
    );
  }

  return undefined;
};
