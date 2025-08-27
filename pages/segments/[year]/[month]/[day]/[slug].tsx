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
import { generateShareLinks } from '@lib/generate/social';
import getDateAgeInSeconds from '@lib/math/time/getDateAgeInSeconds';

const SegmentPage = ({ data }: IContentComponentProxyProps) => (
  <Segment data={data} />
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
            fetchSegmentData(slug, SegmentIdType.Slug),
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
                type: 'post--segment',
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

export default SegmentPage;
