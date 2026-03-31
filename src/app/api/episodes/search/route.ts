import type { EpisodeConnection } from "@/interfaces";
import { NextResponse, type NextRequest } from "next/server";
import { gql } from "@apollo/client";
import { gqlClient } from "@/lib/fetch";
import { IMAGE_PROPS } from "@/lib/fetch/api/graphql";
import { convertSFParamToWhereArgs } from "@/lib/convert/string";

const GET_SEARCH_RESULTS = gql`
  query getEpisodesSearchResults($first: Int, $last: Int, $after: String, $before: String, $where: RootQueryToEpisodeConnectionWhereArgs) {
    episodes (
      first: $first,
      last: $last,
      after: $after,
      before: $before,
      where: $where
    ) {
      nodes {
        contentTypeName
        id
        date
        link
        ...on NodeWithTitle {
          title
        }
        ...on NodeWithFeaturedImage {
          featuredImage {
            node {
              ...ImageProps
            }
          }
        }
      }
    }
  }
  ${IMAGE_PROPS}
`;

export async function GET(req: NextRequest) {
  try {
    const search = req.nextUrl.searchParams.get("search") || undefined;
    const sf = req.nextUrl.searchParams.get("sf") || undefined;
    const whereArgs = convertSFParamToWhereArgs(sf);
    const response = await gqlClient.query<{
      episodes?: EpisodeConnection;
    }>({
      query: GET_SEARCH_RESULTS,
      variables: {
        first: 10,
        where: {
          search,
          ...whereArgs,
        },
      },
    });
    const data = response?.data?.episodes && {
      contentNodes: response.data.episodes.nodes,
    };

    if (!data) {
      return NextResponse.json(
        { message: "Unable to query content" },
        { status: 400 },
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal Server Error", error },
      { status: 500 },
    );
  }
}
