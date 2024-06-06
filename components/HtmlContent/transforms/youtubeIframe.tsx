/**
 * @file youtubeIframe.tsx
 *
 * Update YourTube embed iframe element attributes.
 */
import React from 'react';
import { DomElement } from 'htmlparser2';

export const youtubeIframe = (node: DomElement) => {
  const rgxYoutube = /((m|www)\.)?youtube(-nocookie)?\.com|youtu.be/;

  if (
    node.type === 'tag' &&
    node.name === 'iframe' &&
    rgxYoutube.test(node.attribs.src || '')
  ) {
    const {
      src,
      title,
      frameborder,
      referrerpolicy,
      allowfullscreen,
      ...rest
    } = node.attribs;
    const sanitizedSrc = [
      // Ensure src URL has https protocol.
      (s: string) =>
        !/^https?:\/\//i.test(s) ? s.replace(/^([^/]*\/\/)?/, 'https://') : s
    ].reduce<string>((a, fn) => fn(a), src);
    const url = new URL(sanitizedSrc);

    if (url.hostname.endsWith('.com') && !url.hostname.includes('-nocookie')) {
      url.hostname = url.hostname.replace('.com', '-nocookie.com');
    }

    // Remove inline styles.
    delete rest.style;

    const attributes = {
      ...rest,
      src: url.toString(),
      frameBorder: frameborder,
      referrerPolicy: referrerpolicy,
      allowFullScreen: allowfullscreen,
      tabIndex: -1
    } as React.IframeHTMLAttributes<HTMLIFrameElement>;

    return <iframe {...attributes} title={title} />;
  }

  return undefined;
};
