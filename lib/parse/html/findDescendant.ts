/**
 * @file findDescendant.ts
 * Search a dom tree for a node that matches some criteria.
 */
import { DomElement } from 'htmlparser2';

/**
 * Crawl node's descendant tree, passing each node to the matching function.
 *
 * @param node
 *      DomElement node to start search.
 * @param func
 *      Function to determine if node is a match, and return it.
 *      Return `false` otherwise.
 */
export const findDescendant = (
  node: DomElement,
  // eslint-disable-next-line no-unused-vars
  func: (N: DomElement) => false | DomElement
): false | DomElement => {
  const { children } = node;
  let found = func(node);

  if (!found && children?.length) {
    found = children.reduce(
      (acc: boolean | DomElement, n: DomElement) =>
        acc || findDescendant(n, func),
      false
    );
  }

  return found;
};

/**
 * Crawl node's descendant tree, passing each node to the matching function.
 * Adds matches to a Set, returning false if no matches
 *
 * @param node
 *      DomElement node to start search.
 * @param func
 *      Function to determine if node is a match, and return it.
 *      Return `false` otherwise.
 * @param allFound
 *      Set to collect matches in.
 */
export const findDescendants = (
  node: DomElement,
  // eslint-disable-next-line no-unused-vars
  func: (N: DomElement) => false | DomElement,
  allFound?: Set<DomElement>
) => {
  const { children } = node;
  const found = allFound || new Set<DomElement>();

  if (func(node)) {
    found.add(node);
  }

  children?.forEach((n: DomElement) => findDescendants(n, func, found));

  return found.size > 0 && found;
};
