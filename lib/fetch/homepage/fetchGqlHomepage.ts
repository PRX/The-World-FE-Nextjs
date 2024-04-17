/**
 * Fetch Homepage data from CMS API.
 *
 * @param id Homepage identifier.
 */

import type {
  Homepage,
  Maybe,
  Menu,
  Program,
  RootQueryToPostConnection
} from '@interfaces';
import { gql } from '@apollo/client';
import { gqlClient } from '@lib/fetch/api';
import {
  IMAGE_PROPS,
  MENU_PROPS,
  POST_CARD_PROPS
} from '@lib/fetch/api/graphql';
import { parseMenu } from '@lib/parse/menu';

const GET_HOMEPAGE = gql`
  query getHomepage($id: ID!, $idType: ProgramIdType) {
    program(id: $id, idType: $idType) {
      id
      link
      landingPage {
        featuredPosts {
          ... on Post {
            ...PostCardProps
          }
        }
      }
    }
    quickLinks: menu(id: "homepage-quick-links-menu", idType: SLUG) {
      ...MenuProps
    }
  }
  ${POST_CARD_PROPS}
  ${IMAGE_PROPS}
  ${MENU_PROPS}
`;

const GET_HOMEPAGE_LATEST_STORIES = gql`
  query getHomepageLatestStories($id: ID!) {
    posts(
      first: 10
      where: { programNotIn: [$id], orderby: { field: DATE, order: DESC } }
    ) {
      nodes {
        id
        link
        title
        additionalMedia {
          audio {
            id
          }
        }
      }
    }
  }
`;

export async function fetchGqlHomepage() {
  const response = await gqlClient.query<{
    program: Maybe<Program>;
    quickLinks: Maybe<Menu>;
  }>({
    query: GET_HOMEPAGE,
    variables: {
      id: 'the-world',
      idType: 'SLUG'
    }
  });
  const homepage = response?.data.program;
  const quickLinksMenu = response?.data.quickLinks?.menuItems?.nodes;

  if (!homepage) return undefined;

  // Get latest stories NOT from The World.
  const latestStoriesResponse = await gqlClient.query<{
    posts: Maybe<RootQueryToPostConnection>;
  }>({
    query: GET_HOMEPAGE_LATEST_STORIES,
    variables: {
      id: homepage.id
    }
  });
  const latestStories = latestStoriesResponse?.data?.posts?.nodes;

  return {
    ...homepage,
    ...(!!latestStories?.length && { latestStories }),
    menus: {
      ...(quickLinksMenu && { quickLinks: parseMenu(quickLinksMenu) })
    }
  } as Homepage;
}

export default fetchGqlHomepage;
