/**
 * @file pages/episodes/[year]/[month]/[day]/preview/[id].tsx
 *
 * Episode preview page.
 */

import type { Episode } from '@interfaces';
import { useEffect, useState } from 'react';
import { Episode as EpisodePage } from '@components/pages/Episode';
import { PreviewPlaceholder } from '@components/PreviewPlaceholder';
import { GET_EPISODE } from '@lib/fetch';

const EpisodePreviewPage = () => {
  const [data, setData] = useState<Episode>();

  useEffect(() => {
    function handlePostMessage(e: MessageEvent<{ episode: Episode }>) {
      const { episode } = e.data;
      setData(episode);
    }

    window.addEventListener('message', handlePostMessage);

    return () => {
      window.removeEventListener('message', handlePostMessage);
    };
  }, []);

  useEffect(() => {
    window.parent.postMessage(
      {
        query: GET_EPISODE
      },
      '*'
    );
  }, []);

  if (!data) {
    return <PreviewPlaceholder />;
  }

  return <EpisodePage data={data} isPreview />;
};

export default EpisodePreviewPage;
