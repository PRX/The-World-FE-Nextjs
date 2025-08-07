/**
 * @file Story.tsx
 * Component for Story.
 */
import type {
  Contributor,
  IContentComponentProps,
  Post,
  Post_Additionaldates as PostAdditionalDates,
  Post_Presentation as PostPresentation
} from '@interfaces';
import { MetaTags } from '@components/MetaTags';
import { Plausible, PlausibleEventArgs } from '@components/Plausible';
import { parseDateParts } from '@lib/parse/date';
import { layoutComponentMap } from './layouts';

export const Story = ({ data, isPreview }: IContentComponentProps<Post>) => {
  const {
    seo,
    link,
    title,
    date,
    additionalDates,
    contributors,
    presentation,
    resourceDevelopmentTags,
    storyFormats
  } = data;
  const { broadcastDate } = additionalDates as PostAdditionalDates;
  const { format } = presentation as PostPresentation;
  const metatags = {
    ...seo,
    canonical: seo?.canonical || link,
    ...((broadcastDate || date) && {
      pubdate: broadcastDate || date
    })
  };
  const LayoutComponent = layoutComponentMap.get(format || 'standard');
  const storyFormat = storyFormats?.nodes[0]?.name;
  const props = {
    Title: title,
    ...(storyFormat && { 'Story Format': storyFormat }),
    ...(!!resourceDevelopmentTags?.nodes.length && {
      'Resource Development': resourceDevelopmentTags.nodes[0].name
    }),
    ...(broadcastDate &&
      (() => {
        const dt = parseDateParts(broadcastDate);
        return {
          'Broadcast Year': dt[0],
          'Broadcast Month': dt.slice(0, 2).join('-'),
          'Broadcast Date': dt.join('-')
        };
      })()),
    ...(date &&
      (() => {
        const dt = parseDateParts(date);
        return {
          'Published Year': dt[0],
          'Published Month': dt.slice(0, 2).join('-'),
          'Published Date': dt.join('-')
        };
      })())
  };
  const plausibleEvents: PlausibleEventArgs[] = [['Story', { props }]];

  if (contributors) {
    contributors.nodes.forEach(({ name }: Contributor) => {
      plausibleEvents.push([
        `Person: ${name}`,
        {
          props: { 'Page Type': 'Story' }
        }
      ]);
    });
  }

  return (
    <>
      <MetaTags data={metatags} />
      {!isPreview && (
        <Plausible
          events={plausibleEvents}
          subject={{ type: 'post--story', id: data.id }}
        />
      )}
      <LayoutComponent data={data} />
    </>
  );
};
