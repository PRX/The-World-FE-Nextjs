/**
 * @file SpotifyPlayer.tsx
 * Component for displaying formatted time.
 */

import React from 'react';

interface ISpotifyPlayerProps {
  uri: string;
  size?: 'compact' | 'large';
  stretch?: boolean;
}

export const SpotifyPlayer = ({
  uri,
  size = 'compact',
  stretch
}: ISpotifyPlayerProps) => {
  const path = uri.split(':').slice(1).join('/');
  const url = `https://open.spotify.com/embed/${path}`;
  let height = '80';
  let width = '300';

  if (stretch) {
    width = '100%';
  }

  if (size === 'large') {
    height = '380';
  }

  return (
    <iframe
      title={uri}
      src={url}
      width={width}
      height={height}
      allow="encrypted-media"
      sandbox="allow-scripts"
      style={{ border: 'none' }}
    />
  );
};

SpotifyPlayer.defaultProps = {
  size: 'compact',
  stretch: false
};
