import { convertSFParamToWhereArgs } from "@/lib/convert/string";
import { fetchGqlStories } from "@/lib/fetch";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const after = req.nextUrl.searchParams.get("after") || undefined;
    const search = req.nextUrl.searchParams.get("search") || undefined;
    const sf = req.nextUrl.searchParams.get("sf") || undefined;
    const whereArgs = convertSFParamToWhereArgs(sf);

    delete whereArgs?.contentTypes;

    const data = await fetchGqlStories({
      first: 60,
      after,
      where: {
        search,
        ...whereArgs,
      },
    });

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
