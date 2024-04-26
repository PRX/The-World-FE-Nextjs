/**
 * @file pages/stories/[year]/[month]/[day]/preview/[id].tsx
 *
 * Segment preview page.
 */

import type { Segment } from '@interfaces';
import { useEffect, useState } from 'react';
import { Segment as SegmentPage } from '@components/pages/Segment';
import { PreviewPlaceholder } from '@components/PreviewPlaceholder';
import { GET_SEGMENT } from '@lib/fetch';

const SegmentPreviewPage = () => {
  const [data, setData] = useState<Segment>();

  useEffect(() => {
    function handlePostMessage(e: MessageEvent<{ segment: Segment }>) {
      const { segment } = e.data;
      setData(segment);
    }

    window.addEventListener('message', handlePostMessage);

    return () => {
      window.removeEventListener('message', handlePostMessage);
    };
  }, []);

  useEffect(() => {
    window.parent.postMessage(
      {
        query: GET_SEGMENT
      },
      '*'
    );
  }, []);

  if (!data) {
    return <PreviewPlaceholder />;
  }

  return <SegmentPage data={data} isPreview />;
};

export default SegmentPreviewPage;
