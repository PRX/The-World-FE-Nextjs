import type { Element } from "html-react-parser";
import { ElementType } from "htmlparser2";
import type { ReplaceCallback } from "../types";

export const removeUnsupportedElementTypes: ReplaceCallback = (domNode) => {
  const { type } = domNode as Element;
  // biome-ignore lint/complexity/noUselessFragments: See docs: https://github.com/remarkablemark/html-react-parser?tab=readme-ov-file#replace-and-remove-element
  if (![ElementType.Tag, ElementType.Text].includes(type)) return <></>;
};
