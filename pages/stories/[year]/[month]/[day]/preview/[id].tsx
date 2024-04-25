/**
 * @file pages/stories/[year]/[month]/[day]/[slug].tsx
 *
 * Story page.
 */

import type { Post } from '@interfaces';
import { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { Story } from '@components/pages/Story';
import { GET_STORY_POST } from '@lib/fetch';

const StoryPreviewPage = () => {
  const [data, setData] = useState<Post>();

  useEffect(() => {
    function handlePostMessage(e: MessageEvent<{ post: Post }>) {
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
    return (
      <Box
        sx={{
          display: 'grid',
          justifyItems: 'center',
          alignContent: 'center',
          rowGap: '2rem',
          minHeight: '90vh'
        }}
      >
        <CircularProgress />
        <Typography variant="h4">Loading Preview Content...</Typography>
      </Box>
    );
  }

  return <Story data={data} isPreview />;
};

// export const getServerSideProps =
//   wrapper.getServerSideProps<IContentComponentProxyProps>(
//     (store) =>
//       async ({ req, params }) => {
//         const id =
//           params?.id &&
//           (typeof params.id === 'string' ? params.id : params.id[0]);

//         if (id) {
//           const [data] = await Promise.all([
//             fetchStoryData(id, PostIdType.DatabaseId, authToken),
//             store.dispatch<any>(fetchAppData(cookies))
//           ]);

//           if (data) {
//             return {
//               props: {
//                 type: 'post--story',
//                 id: data.id,
//                 data
//               }
//             };
//           }
//         }

//         return { notFound: true };
//       }
//   );

export default StoryPreviewPage;
