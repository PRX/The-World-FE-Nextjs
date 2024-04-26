/**
 * @file Story.default.tsx
 * Component for default Story layout.
 */

import type React from 'react';
import type { ITagsProps } from '@components/Tags';
import type {
  IContentComponentProps,
  ICtaRegionProps,
  Post_Additionalmedia as PostAdditionalMedia,
  PostStory,
  RootState
} from '@interfaces';
import { useStore } from 'react-redux';
import dynamic from 'next/dynamic';
import { ThemeProvider } from '@mui/styles';
import { Box, Container } from '@mui/material';
import { NoJsPlayer } from '@components/AudioPlayer/NoJsPlayer';
import { HtmlContent } from '@components/HtmlContent';
import { enhanceImage } from '@components/HtmlContent/transforms';
import { getCtaRegionData } from '@store/reducers';
import { storyStyles, storyTheme } from './Story.feature.styles';
import { StoryHeader, IStoryRelatedLinksProps } from './components';

const CtaRegion = dynamic(
  () => import('@components/CtaRegion').then((mod) => mod.CtaRegion) as any
) as React.FC<ICtaRegionProps>;

const StoryRelatedLinks = dynamic(
  () =>
    import('./components/StoryRelatedLinks').then(
      (mod) => mod.StoryRelatedLinks
    ) as any
) as React.FC<IStoryRelatedLinksProps>;

const Tags = dynamic(() =>
  import('@components/Tags').then((mod) => mod.Tags)
) as React.FC<ITagsProps>;

export const StoryFeatured = ({ data }: IContentComponentProps<PostStory>) => {
  const store = useStore<RootState>();
  const state = store.getState();
  const type = 'post--story';
  const {
    id,
    additionalMedia,
    content,
    categories,
    primaryCategory,
    tags,
    cities,
    continents,
    countries,
    provincesOrStates,
    regions,
    people,
    socialTags
  } = data;
  const { audio } = additionalMedia as PostAdditionalMedia;
  const audioUrl = audio?.sourceUrl || audio?.mediaItemUrl;
  const related = primaryCategory?.posts?.nodes;
  const { classes } = storyStyles();
  const hasRelated = related && !!related.length;
  const hasCategories = !!categories?.nodes?.length;
  const allTags = [
    ...(tags?.nodes || []),
    ...(cities?.nodes || []),
    ...(continents?.nodes || []),
    ...(countries?.nodes || []),
    ...(provincesOrStates?.nodes || []),
    ...(regions?.nodes || []),
    ...(people?.nodes || []),
    ...(socialTags?.nodes || [])
  ];
  const hasTags = !!allTags.length;

  const enhanceImages = enhanceImage((node) => {
    switch (true) {
      case /\bfile-on-the-side\b/.test(node.attribs.class):
        return [
          ['max-width: 600px', '100vw'],
          ['max-width: 960px', '560px'],
          ['max-width: 1280px', '400px'],
          [null, '400px']
        ];

      case /\bfile-browser-width\b/.test(node.attribs.class):
        return [[null, '100vw']];

      default:
        return [
          ['max-width: 600px', '100vw'],
          [null, '1200px']
        ];
    }
  });

  const ctaInlineEnd = getCtaRegionData(
    state,
    'content-inline-end',
    type,
    id as string
  );

  return (
    <ThemeProvider theme={storyTheme}>
      <StoryHeader data={data} />
      {/* <Container classes={{ maxWidthLg: classes.MuiContainerMaxWidthLg }} fixed> */}
      <Container fixed maxWidth="lg">
        <Box className={classes.body} my={2}>
          {audioUrl && <NoJsPlayer url={audioUrl} />}
          {content && (
            <HtmlContent html={content} transforms={[enhanceImages]} />
          )}
        </Box>
        {ctaInlineEnd && <CtaRegion data={ctaInlineEnd} />}
        {hasRelated && (
          <aside>
            <header>
              <h2>Related Content</h2>
            </header>
            <StoryRelatedLinks data={related} />
          </aside>
        )}
        {hasCategories && <Tags data={categories.nodes} label="Categories" />}
        {hasTags && <Tags data={allTags} label="Tags" />}
      </Container>
    </ThemeProvider>
  );
};
