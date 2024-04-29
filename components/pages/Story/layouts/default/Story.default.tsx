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
import { convertNodeToElement, Transform } from 'react-html-parser';
import { DomElement } from 'htmlparser2';
import { ThemeProvider } from '@mui/styles';
import { Box, Container, Grid, Hidden } from '@mui/material';
import { NoJsPlayer } from '@components/AudioPlayer/NoJsPlayer';
import { Sidebar, SidebarLatestStories } from '@components/Sidebar';
import { HtmlContent } from '@components/HtmlContent';
import { enhanceImage } from '@components/HtmlContent/transforms';
import { getCtaRegionData } from '@store/reducers';
import { useStoryStyles, storyTheme } from './Story.default.styles';
import { IStoryRelatedLinksProps, StoryHeader, StoryLede } from './components';

const CtaRegion = dynamic(
  () => import('@components/CtaRegion').then((mod) => mod.CtaRegion) as any
) as React.FC<ICtaRegionProps>;

const SidebarCta = dynamic(
  () =>
    import('@components/Sidebar/SidebarCta').then(
      (mod) => mod.SidebarCta
    ) as any
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

export interface IStoryDefaultProps {
  data: PostStory;
}

export const StoryDefault = ({ data }: IContentComponentProps<PostStory>) => {
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
  const { classes } = useStoryStyles();
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
  let ctaMobile01Position: number;
  let ctaMobile02Position: number;

  // CTA data.
  const ctaInlineMobile01 = getCtaRegionData(
    state,
    'content-inline-1-mobile',
    type,
    id as string
  );
  const ctaInlineMobile02 = getCtaRegionData(
    state,
    'content-inline-2-mobile',
    type,
    id as string
  );
  const ctaInlineEnd = getCtaRegionData(
    state,
    'content-inline-end',
    type,
    id as string
  );
  const ctaSidebarTop = getCtaRegionData(
    state,
    'content-sidebar-1',
    type,
    id as string
  );
  const ctaSidebarBottom = getCtaRegionData(
    state,
    'content-sidebar-2',
    type,
    id as string
  );

  const insertCtaMobile01 = (
    node: DomElement,
    transform: Transform,
    index: number
  ) => {
    if (
      !node.parent &&
      node.type === 'tag' &&
      node.name === 'p' &&
      node?.next?.name === 'p' &&
      node?.next?.next?.next &&
      !ctaMobile01Position &&
      index >= 5
    ) {
      ctaMobile01Position = index;
      return (
        <>
          {convertNodeToElement(node, index, transform)}
          {ctaInlineMobile01 && (
            <Hidden mdUp>
              <CtaRegion data={ctaInlineMobile01} />
            </Hidden>
          )}
        </>
      );
    }

    return undefined;
  };

  const insertCtaMobile02 = (
    node: DomElement,
    transform: Transform,
    index: number
  ) => {
    if (
      !node.parent &&
      node.type === 'tag' &&
      node.name === 'p' &&
      node?.next?.name === 'p' &&
      !node?.next?.next?.next?.next?.next?.next?.next &&
      !ctaMobile02Position &&
      index >= ctaMobile01Position + 6
    ) {
      ctaMobile02Position = index;
      return (
        <>
          {convertNodeToElement(node, index, transform)}
          {ctaInlineMobile02 && (
            <Hidden mdUp>
              <CtaRegion data={ctaInlineMobile02} />
            </Hidden>
          )}
        </>
      );
    }

    return undefined;
  };

  const enhanceImages = enhanceImage((node) => {
    switch (true) {
      case /\bfile-on-the-side\b/.test(node.attribs.class):
        return [
          ['max-width: 600px', '100vw'],
          ['max-width: 960px', '560px'],
          ['max-width: 1280px', '300px'],
          [null, '400px']
        ];

      default:
        return [
          ['max-width: 600px', '100vw'],
          ['max-width: 960px', '560px'],
          ['max-width: 1280px', '600px'],
          [null, '920px']
        ];
    }
  });

  return (
    <ThemeProvider theme={storyTheme}>
      <Container fixed>
        <Grid container>
          <Grid item xs={12}>
            <StoryHeader data={data} />
            {audioUrl && <NoJsPlayer url={audioUrl} />}
          </Grid>
          <Grid item xs={12}>
            <Box className={classes.main}>
              <Box className={classes.content}>
                <StoryLede data={data} />
                <Box className={classes.body} my={2}>
                  {content && (
                    <HtmlContent
                      html={content}
                      transforms={[
                        insertCtaMobile01,
                        insertCtaMobile02,
                        enhanceImages
                      ]}
                    />
                  )}
                </Box>
                {ctaInlineEnd && <CtaRegion data={ctaInlineEnd} />}
              </Box>
              <Sidebar container className={classes.sidebar}>
                <SidebarLatestStories />
                <Hidden mdDown>
                  {ctaSidebarTop && (
                    <Sidebar item stretch>
                      <SidebarCta data={ctaSidebarTop} />
                    </Sidebar>
                  )}
                  {ctaSidebarBottom && (
                    <Sidebar item stretch>
                      <SidebarCta data={ctaSidebarBottom} />
                    </Sidebar>
                  )}
                </Hidden>
              </Sidebar>
              <Box component="aside" gridColumn="1 / -1">
                {hasRelated && (
                  <aside>
                    <header>
                      <h2>Related Content</h2>
                    </header>
                    <StoryRelatedLinks data={related} />
                  </aside>
                )}
                {hasCategories && (
                  <Tags data={categories.nodes} label="Categories" />
                )}
                {hasTags && <Tags data={allTags} label="Tags" />}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};
