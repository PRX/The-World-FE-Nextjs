/**
 * @file videoSourceDescendant.tsx
 *
 * Convert placeholder markup with twitter embed component.
 */
import React from 'react';
import { DomElement } from 'htmlparser2';
import { findDescendant } from '@lib/parse/html';
import { makeVimeoEmbedUrl, makeYoutubeEmbedUrl } from '@lib/parse/url';

export const videoSourceDescendant = (node: DomElement) => {
  const rgxYoutube = /((m|www)\.)?youtube(-nocookie)?\.com|youtu.be/;
  const rgxVimeo = /vimeo\.com/;
  const videoSource = findDescendant(node, (n: DomElement) => {
    if (
      n.type === 'tag' &&
      n.name === 'div' &&
      'data-oembed-url' in n.attribs &&
      (rgxYoutube.test(n.attribs['data-oembed-url']) ||
        rgxVimeo.test(n.attribs['data-oembed-url']))
    ) {
      return n;
    }
    if (n.type === 'tag' && n.name === 'video' && 'src' in n.attribs) {
      return n;
    }
    if (n.type === 'tag' && n.name === 'source' && 'src' in n.attribs) {
      return n;
    }
    return false;
  });

  if (videoSource) {
    const videoUrl = (
      videoSource.attribs.src ||
      videoSource.attribs['data-oembed-url'] ||
      ''
    ).replace(/^\s+|\s+$/, '');
    let src: string | null;

    switch (true) {
      case rgxYoutube.test(videoUrl):
        src = makeYoutubeEmbedUrl(videoUrl);
        break;

      case rgxVimeo.test(videoUrl):
        src = makeVimeoEmbedUrl(videoUrl);
        break;

      default:
        src = null;
        break;
    }

    if (src) {
      return (
        <div className="media-youtube-video" key={node.attribs.key}>
          <iframe
            title={src}
            allow="encrypted-media; accelerometer; gyroscope; picture-in-picture"
            allowFullScreen
            sandbox="allow-scripts"
            src={src}
            tabIndex={-1}
          />
        </div>
      );
    }
  }

  return undefined;
};
