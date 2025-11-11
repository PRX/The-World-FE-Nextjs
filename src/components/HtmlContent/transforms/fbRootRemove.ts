/**
 * @file fbRootRemove.ts
 * Remove fb-root div tags.
 */
import { DomElement } from 'htmlparser2';

export const fbRootRemove = (node: DomElement) => {
  if (
    node.type === 'tag' &&
    node.name === 'div' &&
    node.attribs.id === 'fb-root'
  ) {
    return null;
  }

  return undefined;
};
