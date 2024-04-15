/**
 * @file pages/stories/[year]/[month]/[day]/[slug].tsx
 *
 * Story page.
 */

import { PostIdType, type IContentComponentProxyProps } from '@interfaces';
import { Story } from '@components/pages/Story';
import { fetchAppData } from '@store/actions/fetchAppData';
import { wrapper } from '@store/configureStore';
import { fetchStoryData } from '@store/actions/fetchStoryData';

const StoryPage = ({ data }: IContentComponentProxyProps) => (
  <Story data={data} />
);

export const getServerSideProps =
  wrapper.getServerSideProps<IContentComponentProxyProps>(
    (store) =>
      async ({ req, params }) => {
        const id =
          params?.id &&
          parseInt(
            typeof params.id === 'string' ? params.id : params.id[0],
            10
          );
        const { 'tw-can_preview': authToken, ...cookies } = req?.cookies || {};

        if (id) {
          const [data] = await Promise.all([
            fetchStoryData(id, PostIdType.DatabaseId, authToken),
            store.dispatch<any>(fetchAppData(cookies))
          ]);

          if (data) {
            return {
              props: {
                type: 'post--story',
                id: data.id,
                data
              }
            };
          }
        }

        return { notFound: true };
      }
  );

export default StoryPage;
