/**
 * @file gqlClient.ts
 * Initialize Apollo GraphQL client.
 */

import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";
import { stripIgnoredCharacters } from "graphql";

const httpLink = new HttpLink({
  uri: `${process.env.API_URL_BASE?.replace(/\/+$/, "")}/${process.env.WP_GRAPHQL_ENDPOINT?.replaceAll(/^\/+|\/+$/g, "")}`,
  credentials: "same-origin",
  fetch: (url, options) => {
    const oUrl = new URL(url.toString());
    const compressedQuery = stripIgnoredCharacters(
      oUrl.searchParams.get("query") || "",
    );
    oUrl.searchParams.set("query", compressedQuery);
    return fetch(oUrl.toString(), options);
  },
  fetchOptions: {
    method: "GET",
  },
});

const options = {
  cache: new InMemoryCache({
    typePolicies: {
      Post: {
        fields: {
          additionalDates: {
            merge: true,
          },
          additionalMedia: {
            merge: true,
          },
          presentation: {
            merge: true,
          },
        },
      },
      Episode: {
        fields: {
          episodeAudio: {
            merge: true,
          },
          episodeDates: {
            merge: true,
          },
          episodeContributors: {
            merge: true,
          },
        },
      },
      Segment: {
        fields: {
          segmentContent: {
            merge: true,
          },
        },
      },
      MediaItem: {
        fields: {
          audioFields: { merge: true },
        },
      },
      Program: {
        fields: {
          posts: { merge: true },
        },
      },
      Contributor: {
        fields: {
          contributorDetails: { merge: true },
        },
      },
    },
  }),
  link: ApolloLink.from([httpLink]),
  defaultOptions: {
    query: {
      fetchPolicy: "no-cache",
    },
  },
} as ApolloClient.Options;

export const gqlClient = new ApolloClient(options);

export const getClient = (authToken?: string) => {
  const authLink = new SetContextLink(({ headers, ...rest }) => {
    if (!authToken) return { headers };

    return {
      ...rest,
      headers: {
        ...headers,
        Authorization: `Bearer ${authToken}`,
      },
    };
  });

  return new ApolloClient({
    ...options,
    link: authLink.concat(httpLink),
  });
};

export default gqlClient;
