import type { HTMLReactParserOptions } from "html-react-parser";

export type ReplaceCallback<T = DOMNode> = (
  domNode: T,
  index: number,
  options: HTMLReactParserOptions,
  // biome-ignore lint/suspicious/noConfusingVoidType: Some replacers only modify the node and do should not return anything.
) => React.JSX.Element | string | null | boolean | object | undefined | void;
