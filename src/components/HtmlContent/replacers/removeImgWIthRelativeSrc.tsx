import { replaceElement } from "@/app/(main)/_components/ContentBody/replacers";

/**
 * @file removeImgWithRelativeSrc.ts
 * Remove img tags with relative src URL's.
 */
export const removeImgWIthRelativeSrc = replaceElement("img", (el) => {
  if (el.attribs.src.startsWith("/") && !el.attribs.src.startsWith("//:")) {
    // biome-ignore lint/complexity/noUselessFragments: See docs: https://github.com/remarkablemark/html-react-parser?tab=readme-ov-file#replace-and-remove-element
    return <></>;
  }

  return undefined;
});
