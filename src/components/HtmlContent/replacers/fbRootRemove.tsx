import { replaceElement } from "@/app/(main)/_components/ContentBody/replacers";

/**
 * @file fbRootRemove.ts
 * Remove fb-root div tags.
 */
export const fbRootRemove = replaceElement("div", (el) => {
  if (el.attribs.id === "fb-root") {
    // biome-ignore lint/complexity/noUselessFragments: See docs: https://github.com/remarkablemark/html-react-parser?tab=readme-ov-file#replace-and-remove-element
    return <></>;
  }

  return undefined;
});
