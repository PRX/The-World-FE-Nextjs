/**
 * @file pages/preview/[id].tsx
 *
 * Preview Page drafts.
 */

import type { Page } from '@interfaces';
import { useEffect, useState } from 'react';
import { Page as PagePage } from '@components/pages/Page';
import { PreviewPlaceholder } from '@components/PreviewPlaceholder';
import { GET_PAGE } from '@lib/fetch';

const PagePreviewPage = () => {
  const [data, setData] = useState<Page>();

  useEffect(() => {
    function handlePostMessage(e: MessageEvent<{ page: Page }>) {
      if (!e.data.page) return;

      const { page } = e.data;
      setData(page);
    }

    window.addEventListener('message', handlePostMessage);

    return () => {
      window.removeEventListener('message', handlePostMessage);
    };
  }, []);

  useEffect(() => {
    window.parent.postMessage(
      {
        query: GET_PAGE
      },
      '*'
    );
  }, []);

  if (!data) {
    return <PreviewPlaceholder />;
  }

  return <PagePage data={data} isPreview />;
};

export default PagePreviewPage;
