/**
 * Fetch Story data from WP GraphQL API.
 */

import type {
  CtaRegion,
  IApp,
  Maybe,
  Menu,
  Program,
  RootQueryToCtaRegionConnection,
  Settings,
} from "@/interfaces";
import { gql } from "@apollo/client";
import { gqlClient } from "@/lib/fetch/api";
import { parseCtaMessage } from "@/lib/parse/cta";
import { parseMenu } from "@/lib/parse/menu";
import { STORY_CARD_PROPS } from "../story";
import { CTA_PROPS, CTA_REGION_PROPS, MENU_PROPS } from "../api/graphql";

const GET_APP = gql`
  query getApp {
    allSettings {
      generalSettingsTimezone
    }
    program(id: "the-world", idType: SLUG) {
      id
      posts(first: 10, where: { orderby: { field: DATE, order: DESC } }) {
        nodes {
          ...StoryCardProps
        }
      }
    }
    headerMenu: menu(id: "header-nav", idType: SLUG) {
      ...MenuProps
    }
    footerMenu: menu(id: "footer-nav", idType: SLUG) {
      ...MenuProps
    }
    mainMenu: menu(id: "main-nav", idType: SLUG) {
      ...MenuProps
    }
    socialMenu: menu(id: "social-nav", idType: SLUG) {
      ...MenuProps
    }
    topMenu: menu(id: "top-nav", idType: SLUG) {
      ...MenuProps
    }
    ctaRegions(first: 100) {
      nodes {
        ...CtaRegionProps
      }
    }
  }
  ${CTA_PROPS}
  ${CTA_REGION_PROPS}
  ${MENU_PROPS}
  ${STORY_CARD_PROPS}
`;

export const fetchGqlApp = async () => {
  const response = await gqlClient.query<{
    allSettings: Settings;
    program: Maybe<Program>;
    headerMenu: Maybe<Menu>;
    footerMenu: Maybe<Menu>;
    mainMenu: Maybe<Menu>;
    socialMenu: Maybe<Menu>;
    topMenu: Maybe<Menu>;
    ctaRegions: RootQueryToCtaRegionConnection;
  }>({
    query: GET_APP,
  });
  const data = response?.data;

  if (!data) return undefined;

  const latestStories = data.program?.posts?.nodes;
  const drawerMainNav = data.mainMenu?.menuItems?.nodes;
  const drawerSocialNav = data.socialMenu?.menuItems?.nodes;
  const drawerTopNav = data.topMenu?.menuItems?.nodes;
  const footerNav = data.footerMenu?.menuItems?.nodes;
  const headerNav = data.headerMenu?.menuItems?.nodes;
  const ctaRegions = data.ctaRegions.nodes.reduce(
    (a, ctaRegion: CtaRegion) =>
      ctaRegion.slug
        ? {
            // biome-ignore lint/performance/noAccumulatingSpread: Maybe refactor this.
            ...a,
            [ctaRegion.slug]:
              ctaRegion.ctaRegionContent?.callToActions
                ?.map((cta) => parseCtaMessage(cta, ctaRegion.slug))
                .filter((v) => !!v) || null,
          }
        : a,
    {},
  );

  return {
    ...(data.allSettings && { settings: data.allSettings }),
    ...(latestStories && { latestStories }),
    menus: {
      ...(drawerMainNav && { drawerMainNav: parseMenu(drawerMainNav) }),
      ...(drawerSocialNav && { drawerSocialNav: parseMenu(drawerSocialNav) }),
      ...(drawerTopNav && { drawerTopNav: parseMenu(drawerTopNav) }),
      ...(footerNav && { footerNav: parseMenu(footerNav) }),
      ...(headerNav && { headerNav: parseMenu(headerNav) }),
    },
    ctaRegions,
  } as IApp;
};

export default fetchGqlApp;
