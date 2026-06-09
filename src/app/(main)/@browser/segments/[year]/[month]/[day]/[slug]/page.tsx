import { getCachedSegment } from "@/app/(main)/segments/[year]/[month]/[day]/[slug]/page";
import SegmentBrowserUI from "./_components/SegmentBrowserUI";
import { isBefore } from "date-fns";

export default async function SegmentBrowser({
  params,
}: {
  params: Promise<Record<"year" | "month" | "day" | "slug", string>>;
}) {
  const {
    slug,
    year: yearParam,
    month: monthParam,
    day: dayParam,
  } = await params;

  const year = parseInt(yearParam, 10);
  const month = parseInt(monthParam, 10);
  const day = parseInt(dayParam, 10);
  const hasNanParams = [year, month, day].reduce(
    (a, v) => a || Number.isNaN(v),
    false,
  );

  if (hasNanParams) {
    return null;
  }

  const data = await getCachedSegment(slug);

  const selected = new Date(year, month - 1, day, 12);

  // Do not render browser for segments published before May 1, 2024.
  // See issue: https://github.com/PRX/The-World-CMS-Wordpress/issues/54
  // TODO: Remove this when linked issue is fixed.
  if (isBefore(selected, new Date(2024, 4, 1))) {
    return null;
  }

  return <SegmentBrowserUI selected={selected} currentSegment={data} />;
}
