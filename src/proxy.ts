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

  /**
   * Redirect legacy content routes to current routes.
   */
  const { contentTypePlural, pubDate, slug } =
    url.pathname.match(
      /^\/(?<contentTypePlural>episodes|segments|stories)\/(?<pubDate>\d{4}-\d{2}-\d{2})\/(?<slug>[\w_-]+)/i,
    )?.groups || {};

  if (contentTypePlural && pubDate && slug) {
    const newPath = `/${contentTypePlural}/${pubDate.split("-").join("/")}/${slug}`;

    url.pathname = newPath;

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
    // Legacy content route: `/[content_type_plural]/[date]/[slug]`
    {
      source: "/(episodes|segments|stories)/(\\d{4}-\\d{2}-\\d{2})/(.+)",
      locale: false,
    },
  ],
};
