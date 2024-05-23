/**
 * @file pages/stories/[year]/[month]/[day]/preview/[id].tsx
 *
 * Story preview page.
 */

import type { Post } from '@interfaces';
import { useEffect, useState } from 'react';
import { Story } from '@components/pages/Story';
import { GET_STORY_POST } from '@lib/fetch';
import { PreviewPlaceholder } from '@components/PreviewPlaceholder';

const StoryPreviewPage = () => {
  const [data, setData] = useState<Post>();

  useEffect(() => {
    function handlePostMessage(e: MessageEvent<{ post: Post }>) {
      if (!e.data.post) return;

      const { post } = e.data;
      setData(post);
    }

    window.addEventListener('message', handlePostMessage);

    return () => {
      window.removeEventListener('message', handlePostMessage);
    };
  }, []);

  useEffect(() => {
    window.parent.postMessage(
      {
        query: GET_STORY_POST
      },
      '*'
    );
  }, []);

  if (!data) {
    return <PreviewPlaceholder />;
  }

  return <Story data={data} isPreview />;
};

export default StoryPreviewPage;
