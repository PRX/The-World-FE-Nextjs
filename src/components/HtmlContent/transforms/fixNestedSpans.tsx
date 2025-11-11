/**
 * @file audioDescendant.tsx
 *
 * Unwrap nested spans.
 */
import { convertNodeToElement, Transform } from 'react-html-parser';
import { DomElement } from 'htmlparser2';
import { findDescendant } from '@lib/parse/html';

export const fixNestedSpans = (
  node: DomElement,
  transform: Transform,
  index: number
) => {
  const isSpan = node.type === 'tag' && node.name === 'span';

  if (isSpan) {
    const validDescendant = findDescendant(node, (n: DomElement) => {
      if (
        n.children?.length > 1 ||
        Object.keys(n.attribs || {}).length ||
        n.type === 'text'
      ) {
        return n;
      }
      return false;
    });

    if (validDescendant) {
      return convertNodeToElement(validDescendant, index, transform);
    }
  }

  return undefined;
};
