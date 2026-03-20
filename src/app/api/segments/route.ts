import {
  ContentTypeEnum,
  OrderEnum,
  PostObjectsConnectionOrderbyEnum,
} from "@/interfaces";
import fetchGqlContent, {
  type ContentQueryOptions,
} from "@/lib/fetch/content/fetchGqlContent";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const after = req.nextUrl.searchParams.get("after");
    const before = req.nextUrl.searchParams.get("before");

    const afterDate = new Date(`${after}`);
    const beforeDate = new Date(`${before}`);

    const queryOptions: ContentQueryOptions = {
      first: 100,
      where: {
        contentTypes: [ContentTypeEnum.Segment],
        ...((after || before) && {
          dateQuery: {
            ...(after && {
              after: {
                year: afterDate.getFullYear(),
                month: afterDate.getMonth() + 1,
                day: afterDate.getDate(),
              },
            }),
            ...(before && {
              before: {
                year: beforeDate.getFullYear(),
                month: beforeDate.getMonth() + 1,
                day: beforeDate.getDate(),
              },
            }),
          },
        }),
        orderby: [
          {
            field: PostObjectsConnectionOrderbyEnum.Date,
            order: OrderEnum.Desc,
          },
        ],
      },
    };
    const data = await fetchGqlContent(queryOptions);

    if (!data) {
      return NextResponse.json(
        { message: "Unable to query content" },
        { status: 400 },
      );
    }

    // Query results from GraphQL API are capped at 100 items.
    // Continue to fetch results until there isn't a next page of items.
    while (data.pageInfo.hasNextPage) {
      const { pageInfo, edges, nodes } =
        (await fetchGqlContent({
          ...queryOptions,
          after: data.pageInfo.endCursor as string,
        })) || {};

      data.pageInfo.hasNextPage = !!pageInfo?.hasNextPage;
      data.pageInfo.endCursor = pageInfo?.endCursor;
      data.edges = [...data.edges, ...(edges || [])];
      data.nodes = [...data.nodes, ...(nodes || [])];
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
