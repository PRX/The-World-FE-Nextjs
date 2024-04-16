/**
 * @file enhanceImage.ts
 * Converts img tags to Image components.
 */
import React from 'react';
import { DomElement } from 'htmlparser2';
import Image from 'next/image';

export type ImageWidth = [string | null, string];

export interface IImageWidthsFunc {
  // eslint-disable-next-line no-unused-vars
  (node: DomElement): ImageWidth[];
}

export const enhanceImage =
  (getImageWidths: IImageWidthsFunc) => (node: DomElement) => {
    const { type, name, attribs } = node;
    if (
      type === 'tag' &&
      name === 'img' &&
      !(attribs.width === '1' && attribs.height === '1') &&
      !/\.gif(?:\?|$)/.test(attribs.src)
    ) {
      const imageWidths = getImageWidths(node);
      const sizes = imageWidths
        .map(([q, w]) => (q ? `(${q}) ${w}` : w))
        .join(', ');
      const { class: className, width, height, src, alt, key } = attribs;
      const absoluteSrc = /^\/[^/]/.test(src)
        ? `https://theworld.org${src}`
        : src;
      let wrapperClass: string | undefined;

      switch (true) {
        case /\bfile-full-width\b/.test(className):
          wrapperClass = 'file-full-width-wrapper';
          break;

        case /\bfile-browser-width\b/.test(className):
          wrapperClass = 'file-browser-width-wrapper';
          break;

        default:
          break;
      }

      return wrapperClass ? (
        <div className={wrapperClass} key={key}>
          <Image
            className={className}
            src={absoluteSrc}
            alt={alt || ''}
            width={width || 16}
            height={height || 9}
            sizes={sizes}
          />
        </div>
      ) : (
        <Image
          className={className}
          src={absoluteSrc}
          alt={alt || ''}
          width={width || 16}
          height={height || 9}
          sizes={sizes}
          key={key}
        />
      );
    }

    return undefined;
  };
