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

export type TwDatavizMessageData = {
  type: 'TwDatavizUpdateHeight';
  payload: number;
};

export const DatavizEmbed = ({
  title,
  height,
  frameborder,
  style,
  class: className,
  ...iframeAttribs
}: IDatavizEmbedProps) => {
  const [iframeHeight, setIframeHeight] = useState(height);

  function handleMessage(event: MessageEvent<TwDatavizMessageData>) {
    console.log(event);
    if (event.data.type === 'TwDatavizUpdateHeight' && event.data.payload) {
      setIframeHeight(event.data.payload);
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
