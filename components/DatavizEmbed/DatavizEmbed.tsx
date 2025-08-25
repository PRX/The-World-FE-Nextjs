/**
 * @file DatavizEmbed.tsx
 * Component for datawrapperEmbed elements.
 */

import type { DetailedHTMLProps, IframeHTMLAttributes } from 'react';
import { useEffect, useState } from 'react';

export interface IDatavizEmbedProps
  extends DetailedHTMLProps<
    IframeHTMLAttributes<HTMLIFrameElement>,
    HTMLIFrameElement
  > {
  frameborder?: string;
  class?: string;
}

export type TwDatavizMessageData = { tw: { dataviz: { height: number } } };

export const DatavizEmbed = ({
  title,
  height,
  frameborder,
  style,
  class: className,
  ...iframeAttribs
}: IDatavizEmbedProps) => {
  const [iframeHeight, setIframeHeight] = useState(height);

  function handleMessage(a: MessageEvent<TwDatavizMessageData>) {
    if (typeof a.data.tw?.dataviz?.height !== 'undefined') {
      const {
        dataviz: { height: newHeight }
      } = a.data.tw;
      setIframeHeight(newHeight);
    }
  }

  useEffect(() => {
    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <iframe
      title={title}
      style={{
        height: `${iframeHeight}px`,
        width: 0,
        minWidth: '100%',
        border: 'none'
      }}
      className={className}
      {...iframeAttribs}
    />
  );
};
