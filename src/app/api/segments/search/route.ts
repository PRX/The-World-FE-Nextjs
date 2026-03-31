import type { SegmentConnection } from "@/interfaces";
import { NextResponse, type NextRequest } from "next/server";
import { gql } from "@apollo/client";
import { gqlClient } from "@/lib/fetch";
import { IMAGE_PROPS } from "@/lib/fetch/api/graphql";
import { convertSFParamToWhereArgs } from "@/lib/convert/string";

const GET_SEARCH_RESULTS = gql`
  query getSegmentsSearchResults($first: Int, $last: Int, $after: String, $before: String, $where: RootQueryToSegmentConnectionWhereArgs) {
    segments (
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
      segments?: SegmentConnection;
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
    const data = response?.data?.segments && {
      contentNodes: response.data.segments.nodes,
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
