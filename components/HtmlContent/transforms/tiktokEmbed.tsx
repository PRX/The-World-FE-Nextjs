/**
 * @file twitterEmbed.tsx
 *
 * Convert placeholder markup with twitter embed component.
 */

import { TikTokEmbed } from '@components/TikTokEmbed';
import type { DomElement } from 'htmlparser2';

export const tiktokEmbed = (node: DomElement) => {
  if (
    node.type === 'tag' &&
    node.name === 'blockquote' &&
    'class' in node.attribs &&
    /tiktok-embed/.test(node.attribs.class)
  ) {
    const url = node.attribs.cite;
    const id = node.attribs['data-video-id'];

    if (url) {
      return (
        <TikTokEmbed
          url={url}
          videoId={id}
          key={`${node.attribs.key}-twitter-${id}`}
        />
      );
    }
  }

  return undefined;
};
