import { convertSFParamToWhereArgs } from "@/lib/convert/string";
import { fetchGqlSegments, type SegmentsQueryOptions } from "@/lib/fetch";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const getAllResults = !!(req.nextUrl.searchParams.get("all") || undefined);
    const after = req.nextUrl.searchParams.get("after") || undefined;
    const search = req.nextUrl.searchParams.get("search") || undefined;
    const sf = req.nextUrl.searchParams.get("sf") || undefined;
    const whereArgs = convertSFParamToWhereArgs(sf);
    const doGetAllResults = getAllResults && !!whereArgs?.dateQuery?.month;

    delete whereArgs?.contentTypes;

    const queryOptions: SegmentsQueryOptions = {
      first: doGetAllResults ? 100 : 60,
      after,
      where: {
        search,
        ...whereArgs,
      },
    };
    const data = await fetchGqlSegments(queryOptions);

    if (!data) {
      return NextResponse.json(
        { message: "Unable to query content" },
        { status: 400 },
      );
    }

    if (doGetAllResults) {
      // Query results from GraphQL API are capped at 100 items.
      // Continue to fetch results until there isn't a next page of items.
      while (data.pageInfo.hasNextPage) {
        const { pageInfo, nodes } =
          (await fetchGqlSegments({
            ...queryOptions,
            after: data.pageInfo.endCursor as string,
          })) || {};

        data.pageInfo.hasNextPage = !!pageInfo?.hasNextPage;
        data.pageInfo.endCursor = pageInfo?.endCursor;
        data.nodes = [...data.nodes, ...(nodes || [])];
      }
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
