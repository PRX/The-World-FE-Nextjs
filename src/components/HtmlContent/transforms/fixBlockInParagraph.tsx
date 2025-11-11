/**
 * @file audioDescendant.tsx
 *
 * Unwrap paragraph content that contain a paragraph.
 */
import type { JSX } from 'react';
import type { DomElement } from 'htmlparser2';
import { convertNodeToElement, type Transform } from 'react-html-parser';
import { findDescendant } from '@lib/parse/html';

export const fixBlockInParagraph = (node: DomElement, transform: Transform) => {
  const isParagraph = node.type === 'tag' && node.name === 'p';
  const blockTags = ['blockquote', 'div', 'figure', 'table', 'ul'];
  const blockDescendant = findDescendant(node, (n: DomElement) => {
    if (n.type === 'tag' && blockTags.includes(n.name)) {
      return n;
    }
    return false;
  });

  if (isParagraph && blockDescendant) {
    const children: JSX.Element[] = [];
    let pChildren: JSX.Element[] = [];

    node.children
      .map((n: DomElement) => {
        if (n.type === 'text') {
          return (n.data as string)?.trim().length ? n : null;
        }
        return n;
      })
      .filter((v: DomElement | null) => !!v)
      .forEach((n: DomElement, i: number) => {
        if (n.type === 'tag' && blockTags.includes(n.name)) {
          // Add stored paragraph children to output children and reset store.
          if (pChildren.length) {
            children.push(<p>{[...pChildren]}</p>);
            pChildren = [];
          }
          // Append rendered block element to output children.
          children.push(convertNodeToElement(n, i, transform));
        } else {
          // Store rendered paragraph child.
          pChildren.push(convertNodeToElement(n, i, transform));
        }
      });

    // Add any remaining stored children to output children.
    if (pChildren.length) {
      children.push(<p>{[...pChildren]}</p>);
    }

    return <>{children.map((c) => c)}</>;
  }

  return undefined;
};
