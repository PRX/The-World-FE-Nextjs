import { SFTaxonomyEnum } from "@/gen/search_filters_pb";
import { OrderEnum, PostObjectsConnectionOrderbyEnum } from "@/interfaces";
import {
  convertSFParamToWhereArgs,
  convertStringToBoolean,
} from "@/lib/convert/string";
import fetchGqlContent, {
  type ContentQueryOptions,
} from "@/lib/fetch/content/fetchGqlContent";
import { decodeContentSearchFiltersParam } from "@/lib/util/binaryData";
import { concat, isUndefined } from "lodash";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const after = req.nextUrl.searchParams.get("after") || undefined;
    const search = req.nextUrl.searchParams.get("search") || undefined;
    const sf = req.nextUrl.searchParams.get("sf") || undefined;
    const all = req.nextUrl.searchParams.get("all") || undefined;
    const { ctx } = decodeContentSearchFiltersParam(sf);
    const { taxonomy, termSlug } = ctx || {};
    const taxonomySingleName = !isUndefined(taxonomy)
      ? SFTaxonomyEnum[taxonomy]
      : undefined;
    const whereArgs = convertSFParamToWhereArgs(sf);
    const returnAll = convertStringToBoolean(all || "no");

    const queryOptions: ContentQueryOptions = {
      first: 60,
      after: after,
      where: {
        search,
        orderby: [
          {
            field: PostObjectsConnectionOrderbyEnum.Date,
            order: OrderEnum.Desc,
          },
        ],
        ...whereArgs,
      },
    };
    const data = await fetchGqlContent(
      queryOptions,
      taxonomySingleName,
      termSlug,
    );

    if (returnAll && data?.pageInfo) {
      let { hasNextPage, endCursor } = data.pageInfo;
      while (hasNextPage && endCursor) {
        const moreData = await fetchGqlContent({
          ...queryOptions,
          after: endCursor,
        });

        if (moreData?.nodes) {
          data.nodes = concat(data.nodes, moreData.nodes);
          endCursor = data.pageInfo.endCursor = moreData.pageInfo.endCursor;
          hasNextPage = data.pageInfo.hasNextPage =
            moreData.pageInfo.hasNextPage;
        }
      }
    }

    if (!data) {
      return NextResponse.json(
        { message: "Unable to query content" },
        { status: 400 },
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Internal Server Error", error },
      { status: 500 },
    );
  }
}
