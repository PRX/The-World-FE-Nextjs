/**
 * Fetch Story data from WP GraphQL API.
 */

import type { App, Maybe, Menu, Settings } from "@/interfaces";
import { gql } from "@apollo/client";
import { gqlClient } from "@/lib/fetch/api";
import { parseMenu } from "@/lib/parse/menu";
import {
  AUDIO_PROPS,
  IMAGE_PROPS,
  MENU_PROPS,
  POST_CARD_PROPS,
} from "../api/graphql";

const GET_APP = gql`
  query getApp {
    allSettings {
      generalSettingsTimezone
    }
    footerMenu: menu(id: "footer-nav", idType: SLUG) {
      ...MenuProps
    }
    socialMenu: menu(id: "social-nav", idType: SLUG) {
      ...MenuProps
    }
  }
  ${POST_CARD_PROPS}
  ${IMAGE_PROPS}
  ${AUDIO_PROPS}
  ${MENU_PROPS}
`;

export const fetchGqlApp = async () => {
  const response = await gqlClient.query<{
    allSettings: Settings;
    footerMenu: Maybe<Menu>;
    socialMenu: Maybe<Menu>;
  }>({
    query: GET_APP,
  });
  const data = response?.data;

  if (!data) return undefined;

  const socialsNav = data.socialMenu?.menuItems?.nodes;
  const footerNav = data.footerMenu?.menuItems?.nodes;

  return {
    ...(data.allSettings && { settings: data.allSettings }),
    menus: {
      ...(socialsNav && { socialsNav: parseMenu(socialsNav) }),
      ...(footerNav && { footerNav: parseMenu(footerNav) }),
    },
  } as App;
};

export default fetchGqlApp;
