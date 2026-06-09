import { replaceElement } from "@/app/(main)/_components/ContentBody/replacers";
import { has } from "lodash";

/**
 * @file removeLegacyEntityEmbed.ts
 * Remove placeholder div elements for legacy entity embeds.
 */
export const removeLegacyEntityEmbed = replaceElement("div", (el) => {
  if (has(el.attribs, "data-entity-type")) {
    // biome-ignore lint/complexity/noUselessFragments: See docs: https://github.com/remarkablemark/html-react-parser?tab=readme-ov-file#replace-and-remove-element
    return <></>;
  }

  return undefined;
});
