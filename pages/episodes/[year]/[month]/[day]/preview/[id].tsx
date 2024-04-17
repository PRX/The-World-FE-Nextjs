/**
 * @file pages/episodes/[year]/[month]/[day]/[slug].tsx
 *
 * Episode page.
 */

import { Episode } from '@components/pages/Episode';
import { EpisodeIdType, IContentComponentProxyProps } from '@interfaces';
import { wrapper } from '@store/configureStore';
import { fetchAppData } from '@store/actions/fetchAppData';
import { fetchEpisodeData } from '@store/actions/fetchEpisodeData';

const EpisodePage = ({ data }: IContentComponentProxyProps) => (
  <Episode data={data} isPreview />
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
            fetchEpisodeData(id, EpisodeIdType.DatabaseId, authToken),
            store.dispatch<any>(fetchAppData(cookies))
          ]);

          if (data) {
            return {
              props: {
                type: 'post--episode',
                id: data.id,
                data
              }
            };
          }
        }

        return { notFound: true };
      }
  );

export default EpisodePage;
