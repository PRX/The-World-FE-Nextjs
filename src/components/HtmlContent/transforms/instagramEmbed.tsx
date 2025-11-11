/**
 * @file instagramEmebed.tsx
 *
 * Convert placeholder markup with instagram embed component.
 */
import React from 'react';
import InstagramEmbed from 'react-instagram-embed';
import { DomElement } from 'htmlparser2';

export const instagramEmbed = (node: DomElement) => {
  let url: string | null;

  switch (true) {
    case node.type === 'tag' &&
      node.name === 'div' &&
      'data-oembed-url' in node.attribs &&
      /\/\/instagram\.com\//.test(node.attribs['data-oembed-url']):
      url = node.attribs['data-oembed-url'];
      break;

    case node.type === 'tag' &&
      node.name === 'blockquote' &&
      'class' in node.attribs &&
      /instagram-media/.test(node.attribs.class):
      url = node.attribs['data-instgrm-permalink'];
      break;

    default:
      url = null;
      break;
  }

  if (url && process.env.FB_ACCESS_TOKEN) {
    return (
      <InstagramEmbed
        url={url}
        clientAccessToken={process.env.FB_ACCESS_TOKEN}
      />
    );
  }

  return undefined;
};
