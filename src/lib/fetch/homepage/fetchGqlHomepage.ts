/**
 * Fetch Homepage data from CMS API.
 *
 * @param id Homepage identifier.
 */

import type { Homepage, Maybe, Menu, Program } from "@/interfaces";
import { gql } from "@apollo/client";
import { gqlClient } from "@/lib/fetch/api";
import { MENU_PROPS, EPISODE_CARD_PROPS } from "@/lib/fetch/api/graphql";

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
      posts(first: 20, where: { orderby: { field: DATE, order: DESC } }) {
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        nodes {
          ...PostCardProps
        }
      }
      episodes(first: 10, where: { orderby: { field: DATE, order: DESC } }) {
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        nodes {
          ...EpisodeCardProps
        }
      }
    }
    quickLinks: menu(id: "homepage-quick-links-menu", idType: SLUG) {
      ...MenuProps
    }
  }
  ${MENU_PROPS}
  ${EPISODE_CARD_PROPS}
`;

export async function fetchGqlHomepage() {
  const response = await gqlClient.query<{
    program: Maybe<Program>;
    quickLinks: Maybe<Menu>;
  }>({
    query: GET_HOMEPAGE,
    variables: {
      id: "the-world",
      idType: "SLUG",
    },
  });
  const homepage = response?.data?.program;
  const quickLinksMenu = response?.data?.quickLinks?.menuItems?.nodes;

  if (!homepage) return undefined;

  // TODO: Get data for card carousels.

  return {
    ...homepage,
    menus: {
      ...(quickLinksMenu && { quickLinks: quickLinksMenu }),
    },
  } as Homepage;
}

export default fetchGqlHomepage;
