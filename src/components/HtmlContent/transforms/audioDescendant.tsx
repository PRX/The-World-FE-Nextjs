/**
 * @file audioDescendant.tsx
 *
 * Convert placeholder markup with twitter embed component.
 */
import React from "react";
import { DomElement } from "htmlparser2";
import { findDescendant } from "@/lib/parse/html";
import { AudioPlayer } from "@/components/AudioPlayer";

export const audioDescendant = (node: DomElement) => {
  const audioSource = findDescendant(node, (n: DomElement) => {
    if (n.type === "tag" && n.name === "audio" && "src" in n.attribs) {
      return n;
    }
    return false;
  });

  if (
    audioSource &&
    node.type === "tag" &&
    "class" in node.attribs &&
    /\b(?:file-audio|block-audio)\b/.test(node.attribs.class)
  ) {
    const {
      attribs: { src },
    } = audioSource;
    return <AudioPlayer data={src as string} key={node.attribs.key} />;
  }

  return undefined;
};
