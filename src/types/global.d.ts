import "react";

declare module "*.css";

declare module "*.svg" {
  import React = require("react");

  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}

declare module "next-logger";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "youtube-video": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLMediaElement> & {
          src: string;
          width?: string;
          height?: string;
          controls?: boolean;
          config?: {
            cc_lang_pref?: string;
            cc_load_policy?: 0 | 1;
            color?: "red" | "white";
            disablekb?: 0 | 1;
            enablejsapi?: 0 | 1;
            end?: number;
            fs?: 0 | 1;
            hl?: string;
            iv_load_policy?: 1 | 3;
            origin?: string;
            playlist?: string;
            rel?: 0 | 1;
            start?: number;
            widget_referrer?: string;
            referrerpolicy?: string;
          };
        },
        HTMLMediaElement
      >;
    }
  }
}

declare global {
  interface Uint8Array<ArrayBuffer> {
    toBase64(
      options?:
        | {
            alphabet?: "base64" | "base64url" | undefined;
            omitPadding?: boolean | undefined;
          }
        | undefined,
    ): string;
  }
  interface Uint8ArrayConstructor {
    fromBase64(
      string: string,
      options?:
        | {
            alphabet?: "base64" | "base64url" | undefined;
            lastChunkHandling?:
              | "loose"
              | "strict"
              | "stop-before-partial"
              | undefined;
          }
        | undefined,
    ): Uint8Array<ArrayBuffer>;
  }
}

export {};
