import type { Element } from "html-react-parser";

export function getElementAlignment(el: Element) {
  const classes = el.attribs.class.split(" ");
  const isAlignFull = classes.some((c) => ["alignfull"].includes(c));
  const isAlignWide = classes.some((c) => ["alignwide"].includes(c));
  const isAlignCenter = classes.some((c) => ["aligncenter"].includes(c));
  const isAlignLeft = classes.some((c) =>
    ["alignleft", "media-wysiwyg-align-left", "media-image_on_left"].includes(
      c,
    ),
  );
  const isAlignRight = classes.some((c) =>
    [
      "alignright",
      "media-wysiwyg-align-right",
      "media-image_on_right",
    ].includes(c),
  );
  const isFloated = isAlignLeft || isAlignRight;
  const alignment =
    (isAlignFull && "full") ||
    (isAlignWide && "wide") ||
    (isAlignCenter && "center") ||
    (isAlignLeft && "left") ||
    (isAlignRight && "right") ||
    "default";

  return {
    alignment,
    isAlignCenter,
    isAlignFull,
    isAlignWide,
    isAlignLeft,
    isAlignRight,
    isFloated,
  };
}
