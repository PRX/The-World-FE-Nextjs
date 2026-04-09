import { SFTaxonomyEnum } from "@/gen/search_filters_pb";
import { OrderEnum, PostObjectsConnectionOrderbyEnum } from "@/interfaces";
import { convertSFParamToWhereArgs } from "@/lib/convert/string";
import fetchGqlContent, {
  type ContentQueryOptions,
} from "@/lib/fetch/content/fetchGqlContent";
import { decodeContentSearchFiltersParam } from "@/lib/util/binaryData";
import { isUndefined } from "lodash";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const after = req.nextUrl.searchParams.get("after") || undefined;
    const search = req.nextUrl.searchParams.get("search") || undefined;
    const sf = req.nextUrl.searchParams.get("sf") || undefined;
    const { ctx } = decodeContentSearchFiltersParam(sf);
    const { taxonomy, termSlug } = ctx || {};
    const taxonomySingleName = !isUndefined(taxonomy)
      ? SFTaxonomyEnum[taxonomy]
      : undefined;
    const whereArgs = convertSFParamToWhereArgs(sf);

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
