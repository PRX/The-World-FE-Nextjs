/**
 * @file pages/preview/[id].tsx
 *
 * Preview Page drafts.
 */

import { Page } from '@components/pages/Page';
import { PageIdType, IContentComponentProxyProps } from '@interfaces';
import { wrapper } from '@store/configureStore';
import { fetchAppData } from '@store/actions/fetchAppData';
import { fetchPageData } from '@store/actions/fetchPageData';
import { generateShareLinks } from '@lib/generate/social';

const EpisodePage = ({ data }: IContentComponentProxyProps) => (
  <Page data={data} />
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
            fetchPageData(id, PageIdType.DatabaseId, authToken),
            store.dispatch<any>(fetchAppData(cookies))
          ]);

          if (data) {
            const { link, title } = data;
            const shareLinks =
              link != null ? generateShareLinks(link, title) : undefined;

            return {
              props: {
                type: 'post--episode',
                id: data.id,
                ...(shareLinks && { shareLinks }),
                data
              }
            };
          }
        }

        return { notFound: true };
      }
  );

export default EpisodePage;
