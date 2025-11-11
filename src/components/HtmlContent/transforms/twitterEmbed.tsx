/**
 * @file twitterEmebed.tsx
 *
 * Convert placeholder markup with twitter embed component.
 */
import React from 'react';
import { XEmbed } from 'react-social-media-embed';
import { DomElement } from 'htmlparser2';
import { findDescendant } from '@lib/parse/html';

const twitterEmbedUrlPattern =
  /(?:twitter|x)\.com\/[^/]+\/(?:status(?:es)?)\/(\w+)/;

export const twitterEmbed = (node: DomElement) => {
  let embedUrl: string | null;

  switch (true) {
    case node.type === 'tag' &&
      node.name === 'div' &&
      'data-oembed-url' in node.attribs &&
      /\/\/twitter\.com\//.test(node.attribs['data-oembed-url']):
      embedUrl = node.attribs['data-oembed-url'];
      break;

    case node.type === 'tag' &&
      node.name === 'blockquote' &&
      'class' in node.attribs &&
      /twitter-tweet/.test(node.attribs.class): {
      const link = findDescendant(node, (n: DomElement) => {
        if (
          n.type === 'tag' &&
          n.name === 'a' &&
          'href' in n.attribs &&
          twitterEmbedUrlPattern.test(n.attribs.href)
        ) {
          return n;
        }
        return false;
      });

      embedUrl = link && link.attribs.href;
      break;
    }

    default:
      embedUrl = null;
      break;
  }

  if (embedUrl) {
    const [, id] = embedUrl.match(twitterEmbedUrlPattern) || [];

    if (!id) return null;

    return <XEmbed url={embedUrl} key={`${node.attribs.key}-twitter-${id}`} />;
  }

  return undefined;
};
