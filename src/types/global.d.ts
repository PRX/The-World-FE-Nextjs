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
          // videoid?: string;
          // autoplay?: boolean | string;
          // controls?: boolean | string;
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
