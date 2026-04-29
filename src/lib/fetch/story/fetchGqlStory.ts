/**
 * Fetch Story data from WP GraphQL API.
 */

import { PostIdType, type Maybe, type PostStory } from "@/interfaces";
import { gql } from "@apollo/client";
import { getClient } from "@/lib/fetch/api";
import {
  AUDIO_PROPS,
  IMAGE_PROPS,
  POST_SEO_PROPS,
} from "@/lib/fetch/api/graphql";

export const STORY_CARD_PROPS = gql`
  fragment StoryCardProps on Post {
    id
    title
    excerpt
    link
    featuredImage {
      node {
        ...ImageProps
      }
    }
    primaryCategory {
      id
      name
      link
    }
    additionalMedia {
      audio {
        ...AudioProps
      }
    }
  }
  ${IMAGE_PROPS}
  ${AUDIO_PROPS}
`;

export const GET_STORY_POST = gql`
  query getPost($id: ID!, $idType: PostIdType) {
    post(id: $id, idType: $idType) {
      id
      link
      title
      excerpt
      content
      date
      featuredImage {
        node {
          ...ImageProps
          caption
        }
      }
      additionalDates {
        broadcastDate
        updatedDate
      }
      additionalMedia {
        audio {
          ...AudioProps
        }
        video
      }
      presentation {
        format
      }
      contributors {
        nodes {
          id
          name
          link
          contributorDetails {
            image {
              ...ImageProps
            }
          }
        }
      }
      storyFormats {
        nodes {
          name
        }
      }
      resourceDevelopmentTags {
        nodes {
          name
        }
      }
      programs(first: 1) {
        nodes {
          id
          name
          link
        }
      }
      categories(where: { exclude: ["1"] }) {
        nodes {
          id
          name
          link
        }
      }
      primaryCategory {
        id
        name
        link
        posts(first: 4, where: { notIn: [$id] }) {
          nodes {
            ...StoryCardProps
          }
        }
      }
      tags {
        nodes {
          id
          name
          link
        }
      }
      cities {
        nodes {
          id
          name
          link
        }
      }
      provincesOrStates {
        nodes {
          id
          name
          link
        }
      }
      countries {
        nodes {
          id
          name
          link
        }
      }
      regions {
        nodes {
          id
          name
          link
        }
      }
      people {
        nodes {
          id
          name
          link
        }
      }
      socialTags {
        nodes {
          id
          name
          link
        }
      }
      seo {
        ...PostSEOProps
      }
    }
  }
  ${STORY_CARD_PROPS}
  ${POST_SEO_PROPS}
`;

export const fetchGqlStory = async (
  id?: string | number,
  idType?: PostIdType,
  authToken?: string,
) => {
  const gqlClient = getClient(authToken);
  let storyId = id;

  // The post query need an Id to properly exclude this post from related stories results.
  // When passed a slug, look up the Id.
  if (idType !== PostIdType.Id) {
    const infoResponse = await gqlClient.query<{
      post: Maybe<PostStory>;
    }>({
      query: gql`
        query getPost($id: ID!, $idType: PostIdType) {
          post(id: $id, idType: $idType) {
            id
          }
        }
      `,
      variables: {
        id,
        idType,
      },
    });

    storyId = infoResponse?.data?.post?.id;
  }

  if (!storyId) return undefined;

  const response = await gqlClient.query<{
    post: Maybe<PostStory>;
  }>({
    query: GET_STORY_POST,
    variables: {
      id: storyId,
      idType: PostIdType.Id,
    },
  });
  const post = response?.data?.post;

  if (!post) return undefined;

  return post;
};

export default fetchGqlStory;
