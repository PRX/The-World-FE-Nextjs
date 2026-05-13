import { NextResponse, type NextRequest } from "next/server";
import { fetchGqlSearchTerms } from "@/lib/fetch";
import { decodeContentSearchFiltersParam } from "@/lib/util/binaryData";
import { isUndefined } from "lodash";
import { SFTaxonomyEnum } from "@/gen/search_filters_pb";
import { OrderEnum, TermObjectsConnectionOrderbyEnum } from "@/interfaces";

export async function GET(req: NextRequest) {
  try {
    const search = req.nextUrl.searchParams.get("search") || undefined;
    const sf = req.nextUrl.searchParams.get("sf") || undefined;
    const { ctx } = decodeContentSearchFiltersParam(sf);
    const { taxonomy } = ctx || {};
    const taxonomySingleName = !isUndefined(taxonomy)
      ? SFTaxonomyEnum[taxonomy]
      : undefined;

    const data = await fetchGqlSearchTerms(
      {
        where: {
          search,
          orderby: TermObjectsConnectionOrderbyEnum.Count,
          order: OrderEnum.Desc,
        },
      },
      taxonomySingleName,
    );

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
