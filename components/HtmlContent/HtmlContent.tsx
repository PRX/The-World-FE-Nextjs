/**
 * @file HtmlContent.tsx
 * Component for rendering HTML content.
 */

import { type ReactElement } from 'react';
import { type DomElement } from 'htmlparser2';
import type { Maybe } from '@interfaces';
import ReactHtmlParser, { type Transform } from 'react-html-parser';
import {
  anchorToLink,
  audioDescendant,
  datawrapperEmbed,
  facebookPost,
  facebookVideo,
  fbRootRemove,
  fixBlockInParagraph,
  fixNestedSpans,
  instagramEmbed,
  scriptRemove,
  twitterEmbed,
  videoSourceDescendant
} from './transforms';

export interface IHtmlContentProps {
  html?: Maybe<string>;
  transforms?: ((
    // eslint-disable-next-line no-unused-vars
    N: DomElement,
    // eslint-disable-next-line no-unused-vars
    F: Transform,
    // eslint-disable-next-line no-unused-vars
    I: number
  ) => ReactElement | void | null)[];
}

export const HtmlContent = ({ html, transforms = [] }: IHtmlContentProps) => {
  if (!html) return null;

  const cleanHtml = (dirtyHtml: string) =>
    [
      (h: string) =>
        h.replace(/\r?\n|\r/g, '').replace(/<[^>/]+>(\s|&nbsp;)*<\/[^>]+>/g, '')
    ].reduce((acc, func) => func(acc), dirtyHtml);

  const transform = (node: DomElement, index: number) =>
    [
      fixNestedSpans,
      fixBlockInParagraph,
      // Transform to add `key` attribute to all tag nodes.
      (n: DomElement) => {
        if (n.type === 'tag') {
          // eslint-disable-next-line no-param-reassign
          n.attribs.key = `${n.parent?.attribs.key || 'root'}_${
            n.name
          }:${index}`;
        }
      },
      ...transforms,
      anchorToLink,
      audioDescendant,
      datawrapperEmbed,
      facebookPost,
      facebookVideo,
      fbRootRemove,
      instagramEmbed,
      scriptRemove,
      twitterEmbed,
      videoSourceDescendant
    ].reduce(
      (acc, func) => (acc || acc === null ? acc : func(node, transform, index)),
      undefined
    );

  return (
    <>
      {ReactHtmlParser(cleanHtml(html), {
        transform: transform as Transform
      })}
    </>
  );
};
