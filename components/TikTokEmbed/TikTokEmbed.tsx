/**
 * @file TikTokEmbed.tsx
 * Component for displaying formatted time.
 */

import { useEffect, useState } from 'react';

interface ITikTokEmbedProps {
  url: string;
  videoId: string;
}

export const TikTokEmbed = ({ url, videoId }: ITikTokEmbedProps) => {
  const [iframeDimensions, setIframeDimensions] = useState<{
    width: number;
    height: number;
  }>();
  const src = `https://www.tiktok.com/embed/v2/${videoId}?embedFrom=oembed`;

  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      if (!e.data.startsWith?.('{')) return;

      const data = JSON.parse(e.data);

      if (!data.signalSource || !data.height) return;

      const { width = 325, height } = data;

      setIframeDimensions({ width, height });
    }

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <blockquote className="tiktok-embed" cite={url} data-video-id={videoId}>
      <iframe
        name={`__tt_embed__v${videoId}`}
        title={`TikTok Video Embed - ${videoId}`}
        src={src}
        referrerPolicy="strict-origin-when-cross-origin"
        sandbox="allow-popups allow-popups-to-escape-sandbox allow-scripts allow-top-navigation-by-user-activation"
        {...(iframeDimensions && {
          style: {
            width: `${iframeDimensions.width}px`,
            height: `${iframeDimensions.height}px`
          }
        })}
      />
    </blockquote>
  );
};
