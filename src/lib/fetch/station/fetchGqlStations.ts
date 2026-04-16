/**
 * Fetch Stations data from WP GraphQL API.
 */

import { gql } from "@apollo/client";
import type {
  RootQueryToStationConnection,
  RootQueryToStationConnectionWhereArgs,
} from "@/interfaces";
import { getClient } from "@/lib/fetch/api";
import { STATION_CARD_PROPS } from "@/lib/fetch/api/graphql";
import { concat } from "lodash";

export type StationsQueryOptions = {
  first?: number;
  last?: number;
  after?: string;
  before?: string;
  where?: RootQueryToStationConnectionWhereArgs;
};

export const GET_STATIONS = gql`
  query getStations($first: Int, $last: Int, $after: String, $before: String, $where: RootQueryToStationConnectionWhereArgs) {
    stations(
      first: $first,
      last: $last,
      after: $after,
      before: $before,
      where: $where
    ) {
      pageInfo {
        startCursor
        endCursor
        hasPreviousPage
        hasNextPage
      }
      nodes {
        ...StationCardProps
      }
    }
  }
  ${STATION_CARD_PROPS}
`;

export async function fetchGqlStations(
  query?: StationsQueryOptions,
  authToken?: string,
) {
  const gqlClient = getClient(authToken);
  const queryOptions = {
    ...query,
    first: !query?.first || query.first === Infinity ? 100 : query.first,
  };
  const response = await gqlClient.query<{
    stations: RootQueryToStationConnection;
  }>({
    query: GET_STATIONS,
    variables: queryOptions,
  });
  const results = response?.data?.stations;

  if (!results) return undefined;

  if (query?.first === Infinity) {
    let { hasNextPage, endCursor } = results.pageInfo;
    while (hasNextPage && endCursor) {
      const moreResponse = await gqlClient.query<{
        stations: RootQueryToStationConnection;
      }>({
        query: GET_STATIONS,
        variables: {
          ...queryOptions,
          after: endCursor,
        },
      });
      const moreResults = moreResponse?.data?.stations;

      if (moreResults?.nodes) {
        results.nodes = concat(results.nodes, moreResults.nodes);
        endCursor = results.pageInfo.endCursor = moreResults.pageInfo.endCursor;
        hasNextPage = results.pageInfo.hasNextPage =
          moreResults.pageInfo.hasNextPage;
      }
    }
  }

  return results;
}

export default fetchGqlStations;
