import { SFContentTypeEnum } from "@/gen/search_filters_pb";
import { encodeContentSearchFiltersParam } from "@/lib/util/binaryData";
import { type NextRequest, NextResponse, type ProxyConfig } from "next/server";

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();

  /**
   * Redirect landing page episodes flag parameter to new search filter param.
   * Example: /programs/the-world?v=episodes to /programs/the-world?sf=CAM
   */
  if (url.searchParams.get("v") === "episodes") {
    const sf = encodeContentSearchFiltersParam({
      contentType: SFContentTypeEnum.EPISODE,
    });

    url.searchParams.set("sf", sf);
    url.searchParams.delete("v");

    return NextResponse.redirect(url);
  }
}

export const config: ProxyConfig = {
  matcher: [
    // Landing page using episodes flag parameter, `v=episodes`.
    {
      source: "/(.*)",
      locale: false,
      has: [{ type: "query", key: "v", value: "episodes" }],
    },
  ],
};
