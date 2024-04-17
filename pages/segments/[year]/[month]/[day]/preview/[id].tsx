/**
 * @file pages/stories/[year]/[month]/[day]/[slug].tsx
 *
 * Segment page.
 */

import { Segment } from '@components/pages/Segment';
import { IContentComponentProxyProps, SegmentIdType } from '@interfaces';
import { wrapper } from '@store/configureStore';
import { fetchAppData } from '@store/actions/fetchAppData';
import { fetchSegmentData } from '@store/actions/fetchSegmentData';

const SegmentPage = ({ data }: IContentComponentProxyProps) => (
  <Segment data={data} isPreview />
);

export const getServerSideProps =
  wrapper.getServerSideProps<IContentComponentProxyProps>(
    (store) =>
      async ({ req, params }) => {
        const id =
          params?.id &&
          (typeof params.id === 'string' ? params.id : params.id[0]);
        const { 'tw-can_preview': authToken, ...cookies } = req?.cookies || {};

        if (id) {
          const [data] = await Promise.all([
            fetchSegmentData(id, SegmentIdType.DatabaseId, authToken),
            store.dispatch<any>(fetchAppData(cookies))
          ]);

          if (data) {
            return {
              props: {
                type: 'post--segment',
                id: data.id,
                data
              }
            };
          }
        }

        return { notFound: true };
      }
  );

export default SegmentPage;
