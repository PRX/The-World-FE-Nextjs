/**
 * @file Homepage.tsx
 * Component for Homepage.
 */

import type React from 'react';
import type {
  Episode,
  Homepage as HomepageType,
  IContentComponentProps,
  Post,
  RootState
} from '@interfaces';
import type { ICtaRegionProps } from '@interfaces/cta';
import { useContext } from 'react';
import dynamic from 'next/dynamic';
import { useStore } from 'react-redux';
import { Box, Hidden, Typography } from '@mui/material';
import StyleRounded from '@mui/icons-material/StyleRounded';
import { LandingPage } from '@components/LandingPage';
import { MetaTags } from '@components/MetaTags';
import { Plausible } from '@components/Plausible';
import {
  Sidebar,
  SidebarHeader,
  SidebarLatestStories,
  SidebarList,
  SidebarListItem
  // SidebarList
} from '@components/Sidebar';
import { QuickLinks } from '@components/QuickLinks';
import { StoryCard } from '@components/StoryCard';
import { StoryCardGrid } from '@components/StoryCardGrid';
import { SidebarEpisode } from '@components/Sidebar/SidebarEpisode';
import {
  getAppDataMenu,
  getCollectionData,
  getCtaRegionData
} from '@store/reducers';
import { AppContext } from '@contexts/AppContext';

const CtaRegion = dynamic(
  () => import('@components/CtaRegion').then((mod) => mod.CtaRegion) as any
) as React.FC<ICtaRegionProps>;

const SidebarCta = dynamic(
  () => import('@components/Sidebar').then((mod) => mod.SidebarCta) as any
) as React.FC<ICtaRegionProps>;

export const Homepage = ({ data }: IContentComponentProps<HomepageType>) => {
  const {
    page: { resource }
  } = useContext(AppContext);
  const { type, id } = resource || {};
  const store = useStore<RootState>();
  const state = store.getState();
  const drawerMainNav = getAppDataMenu(state, 'drawerMainNav');
  const { landingPage, menus, latestStories, link } = data || {};
  const featuredPosts =
    landingPage?.featuredPosts &&
    (landingPage.featuredPosts || []).reduce(
      (a, post) => (post ? [...a, post] : a),
      []
    );
  const { quickLinks } = menus || {};

  const storiesState = getCollectionData<Post>(
    state,
    'homepage',
    undefined,
    'stories'
  );
  const featuredStories = [
    ...(featuredPosts || []),
    ...(storiesState?.items || []).splice(0, 5 - (featuredPosts?.length || 0))
  ];
  const featuredStory = featuredStories.shift();
  const hasFeaturedStories = !!featuredStories.length;
  const { items: stories } = storiesState || {};

  const episodesState = getCollectionData<Episode>(
    state,
    'homepage',
    undefined,
    'episodes'
  );
  const { items: episodes } = episodesState || {};
  const latestEpisode = episodes?.shift();

  const categoriesMenu = drawerMainNav
    ?.filter((item) => item.name === 'Categories')?.[0]
    ?.children?.map(
      (item) =>
        ({
          title: item.name,
          url: item.url
        } as SidebarListItem)
    );

  // CTA data.
  const inlineTop = getCtaRegionData(state, 'landing-inline-top', type, id);
  const inlineBottom = getCtaRegionData(
    state,
    'landing-inline-bottom',
    type,
    id
  );
  const sidebarTop = getCtaRegionData(state, 'landing-sidebar-1', type, id);
  const sidebarBottom = getCtaRegionData(state, 'landing-sidebar-2', type, id);

  const mainElements = [
    {
      key: 'main top',
      children: (
        <>
          <Box display="grid" gridTemplateColumns="1fr" gap={1}>
            {featuredStory && (
              <StoryCard data={featuredStory} feature priority />
            )}
            {hasFeaturedStories && (
              <StoryCardGrid data={featuredStories} gap={1} />
            )}
          </Box>
          {inlineTop && (
            <>
              <Hidden mdDown>
                <CtaRegion data={inlineTop} />
              </Hidden>
              <Hidden mdUp>
                <SidebarCta data={inlineTop} />
              </Hidden>
            </>
          )}
        </>
      )
    },
    {
      key: 'main bottom',
      children: (
        <>
          {stories.map((item) => (
            <StoryCard
              data={item}
              feature={
                !!item.presentation?.format &&
                item.presentation?.format !== 'standard'
              }
              key={item.id}
            />
          ))}
          {inlineBottom && (
            <>
              <Hidden mdDown>
                <CtaRegion data={inlineBottom} />
              </Hidden>
              <Hidden mdUp>
                <SidebarCta data={inlineBottom} />
              </Hidden>
            </>
          )}
        </>
      )
    }
  ];

  const sidebarElements = [
    {
      key: 'sidebar top',
      children: (
        <>
          {latestEpisode && (
            <>
              <SidebarEpisode
                data={latestEpisode}
                label="Latest Episode"
                {...(link &&
                  episodes.length > 1 && {
                    collectionLink: `${link}?v=episodes`,
                    collectionLinkShallow: true
                  })}
              />
              {sidebarTop && <SidebarCta data={sidebarTop} />}
            </>
          )}
          <SidebarLatestStories
            data={latestStories}
            label="Latest from our partners"
          />
        </>
      )
    },
    {
      key: 'sidebar bottom',
      children: (
        <>
          {categoriesMenu && (
            <Sidebar item elevated>
              <SidebarHeader>
                <StyleRounded />
                <Typography variant="h2">Categories</Typography>
              </SidebarHeader>
              <SidebarList data={categoriesMenu} />
            </Sidebar>
          )}
          {sidebarBottom && <SidebarCta data={sidebarBottom} />}
        </>
      )
    }
  ];

  const title = 'The World from PRX';
  const description =
    'The World is a public radio program that crosses borders and time zones to bring home the stories that matter. From PRX.';
  const url = '/';
  const metatags = {
    title,
    description,
    canonical: url,
    opengraphType: 'website',
    opengraphTitle: title,
    opengraphDescription: description,
    opengraphUrl: url,
    twitterTitle: title,
    twitterDescription: description
  };

  return (
    <>
      <MetaTags data={metatags} />
      <Plausible subject={{ type: 'homepage' }} />
      {quickLinks && <QuickLinks data={quickLinks} />}
      <LandingPage
        main={mainElements}
        sidebar={sidebarElements}
        mt={3}
        gap={1}
      />
    </>
  );
};
