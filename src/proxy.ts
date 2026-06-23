import { SFContentTypeEnum } from "@/gen/search_filters_pb";
import { encodeContentSearchFiltersParam } from "@/lib/util/binaryData";
import { type NextRequest, NextResponse, type ProxyConfig } from "next/server";

export async function proxy(request: NextRequest) {
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

  /**
   * Check if image URL passed to image api is accessible.
   */
  const imageApiUrl = url.searchParams.get("url");
  if (url.pathname.startsWith("/_next/image") && imageApiUrl) {
    let isImageUrlOk = false;

    try {
      const imageHeaders = await fetch(imageApiUrl, { method: "HEAD" });

      isImageUrlOk = imageHeaders.ok;
    } catch (err) {
      console.error("Error fetching source image.", { err });
    }

    if (!isImageUrlOk) {
      return Response.json(
        {
          success: false,
          message: `Source image not accessible: ${imageApiUrl}`,
        },
        { status: 422 },
      );
    }
  }

  /**
   * Add response headers.
   */
  const response = NextResponse.next();

  // Set headers to successful responses.
  if (response.ok) {
    [
      {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      },
      {
        key: "X-XSS-Protection",
        value: "1; mode=block",
      },
      {
        key: "X-Content-Type-Options",
        value: "nosniff",
      },
      {
        key: "Permissions-Policy",
        value: "interest-cohort=()",
      },
      {
        key: "Cache-Control",
        value:
          "public, max-age=3600, s-maxage=3600, stale-while-revalidate=300",
      },
      {
        key: "Content-Security-Policy",
        value: "frame-ancestors 'self' https://*.theworld.org",
      },
    ].forEach(({ key, value }) => {
      response.headers.set(key, value);
    });

    /**
     * Set cache-control headers to long-tail content relative to publish date and now.
     * Content routes should have publish date parts as route parameters.
     */
    const { yearParam, monthParam, dayParam } =
      url.pathname.match(
        /^\/(?:episodes|segments|stories)\/(?<yearParam>\d{4})\/(?<monthParam>\d{2})\/(?<dayParam>\d{2})\/[\w_-]+/i,
      )?.groups || {};
    const year = parseInt(yearParam, 10);
    const month = parseInt(monthParam, 10);
    const day = parseInt(dayParam, 10);

    // Check if content path contains full, valid date segments.
    if (year && month && day) {
      const now = Temporal.Now.plainDateISO();
      const pubDate = new Temporal.PlainDate(year, month, day);
      const lastWeekStartDate = now.subtract({
        days: 7,
      });

      // Update headers for content older than a week.
      if (Temporal.PlainDate.compare(pubDate, lastWeekStartDate) === -1) {
        const pubDuration = now.since(pubDate);
        const maxAge = Math.min(pubDuration.total("seconds"), 31536000); // Cap at 1 year.

        [
          {
            key: "Cache-Control",
            value: `public, max-age=${maxAge}, s-maxage=${maxAge}, stale-while-revalidate=3600`,
          },
        ].forEach(({ key, value }) => {
          response.headers.set(key, value);
        });
      }
    }
  }

  return response;
}

export const config: ProxyConfig = {
  matcher: [
    // All routes to non-static assets.
    {
      source: "/((?!_next/static|favicon.ico).*)",
      locale: false,
    },
  ],
};
