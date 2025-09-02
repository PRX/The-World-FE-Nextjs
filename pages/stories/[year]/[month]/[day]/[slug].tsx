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
import { generateShareLinks } from '@lib/generate/social';
import getDateAgeInSeconds from '@lib/math/time/getDateAgeInSeconds';

const StoryPage = ({ data }: IContentComponentProxyProps) => (
  <Story data={data} />
);

export const getServerSideProps =
  wrapper.getServerSideProps<IContentComponentProxyProps>(
    (store) =>
      async ({ res, req, params }) => {
        const slug =
          params?.slug &&
          (typeof params.slug === 'string' ? params.slug : params.slug[0]);

        if (slug) {
          const [data] = await Promise.all([
            fetchStoryData(slug, PostIdType.Slug),
            store.dispatch<any>(fetchAppData(req.cookies))
          ]);

          if (data) {
            const { link, title, date } = data;
            const shareLinks =
              link != null ? generateShareLinks(link, title) : undefined;

            if (date) {
              const ageInSeconds = getDateAgeInSeconds(date);
              const maxAge =
                ageInSeconds > 60 * 60 * 24 * 7 ? ageInSeconds : 60 * 60; // Cache for 1 hour for the first week.

              if (process.env.NODE_ENV !== 'production') {
                // eslint-disable-next-line no-console
                console.log('Cache-Control s-maxage:', maxAge);
              }

              res.setHeader(
                'Cache-Control',
                `public, s-maxage=${maxAge} state-while-revalidate=3600`
              );
            }

            return {
              props: {
                type: 'post--story',
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

export default StoryPage;
