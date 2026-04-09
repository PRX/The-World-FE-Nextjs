import type { ReplaceCallback } from "@/components/HtmlContent/types";
import type { Element } from "html-react-parser";
import { ElementType } from "htmlparser2";

export function replaceElement(
  elementName: string | string[],
  cb: ReplaceCallback<Element>,
): ReplaceCallback<Element> {
  return (domNode, index, options) => {
    const elementNames = Array.isArray(elementName)
      ? elementName
      : [elementName];
    const { type, name } = domNode;
    if (type !== ElementType.Tag || !elementNames.includes(name)) return;
    return cb(domNode, index, options);
  };
}
