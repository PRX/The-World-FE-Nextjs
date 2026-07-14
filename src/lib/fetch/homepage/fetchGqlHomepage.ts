"use server";

/**
 * Fetch Homepage data from CMS API.
 *
 * @param id Homepage identifier.
 */

import type { Homepage, Maybe, Menu, Program } from "@/interfaces";
import { gql } from "@apollo/client";
import { gqlClient } from "@/lib/fetch/api";
import {
  MENU_PROPS,
  EPISODE_CARD_PROPS,
  AUDIO_PROPS,
  IMAGE_PROPS,
  POST_CARD_PROPS,
} from "@/lib/fetch/api/graphql";

const GET_HOMEPAGE = gql`
  query getHomepage($id: ID!, $idType: ProgramIdType) {
    program(id: $id, idType: $idType) {
      id
      link
      programContributors {
        team {
          nodes {
            id
            name
            link
            ... on WithAcfContributorDetails {
              contributorDetails {
                position
                image {
                  node {
                    ...ImageProps
                  }
                }
              }
            }
          }
        }
      }
      landingPage {
        featuredPosts {
          nodes {
            ... on Post {
              ...PostCardProps
            }
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
  ${POST_CARD_PROPS}
  ${AUDIO_PROPS}
  ${IMAGE_PROPS}
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
  const returnData = {
    ...homepage,
    menus: {
      ...(quickLinksMenu && { quickLinks: quickLinksMenu }),
    },
  } as Homepage;

  // Fetch YouTube playlist data.
  if (process.env.YT_API_KEY) {
    const ytApiUrl = new URL(
      "https://youtube.googleapis.com/youtube/v3/playlistItems",
    );

    ytApiUrl.searchParams.set("key", process.env.YT_API_KEY);
    ytApiUrl.searchParams.set("part", "snippet");
    ytApiUrl.searchParams.set(
      "playlistId",
      "PLroz2B1RPf0GiDwdj6NLexB5-v5NQnkFf",
    );
    ytApiUrl.searchParams.set("maxResults", "50");

    const ytPlaylistItemsResponse: GoogleAppsScript.YouTube.Schema.PlaylistItemListResponse =
      await fetch(ytApiUrl.toString(), {
        headers: [["Accept", "application/json"]],
      }).then((resp) => resp.ok && resp.json());

    console.log(ytPlaylistItemsResponse.pageInfo);

    returnData.youtubePlaylist = ytPlaylistItemsResponse.items;
  }

  return returnData;
}

export default fetchGqlHomepage;
