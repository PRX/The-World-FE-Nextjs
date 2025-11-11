"use client";

import { PlayIcon } from "lucide-react";

export default function PlayBtn() {
  return (
    <button
      type="button"
      onClick={() => {
        document.dispatchEvent(
          new CustomEvent("player-open", {
            bubbles: true,
            cancelable: true,
          }),
        );
      }}
    >
      <PlayIcon />
    </button>
  );
}
