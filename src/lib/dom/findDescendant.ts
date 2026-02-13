/**
 * @file findDescendant.ts
 * Search a dom tree for a node that matches some criteria.
 */

import { type DOMNode, Element } from "html-react-parser";

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
  node: DOMNode,
  func: (N: DOMNode) => false | DOMNode,
): false | DOMNode => {
  if (!(node instanceof Element)) return false;

  const { children } = node;
  let found = func(node);

  if (!found && node.children?.length) {
    found = children.reduce(
      (acc: false | DOMNode, n) => acc || findDescendant(n as DOMNode, func),
      false,
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
  node: DOMNode,
  // eslint-disable-next-line no-unused-vars
  func: (N: DOMNode) => false | DOMNode,
  allFound?: Set<DOMNode>,
) => {
  if (!(node instanceof Element)) return node;

  const { children } = node;
  const found = allFound || new Set<DOMNode>();

  if (func(node)) {
    found.add(node);
  }

  children?.forEach((n) => {
    findDescendants(n as DOMNode, func, found);
  });

  return found.size > 0 && found;
};
