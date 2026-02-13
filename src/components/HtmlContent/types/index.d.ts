import type { HTMLReactParserOptions } from "html-react-parser";

export type ReplaceCallback<T = DOMNode> = (
  domNode: T,
  index: number,
  options: HTMLReactParserOptions,
) => React.JSX.Element | string | null | boolean | object | undefined;
