import { getCachedSegment } from "@/app/(main)/segments/[year]/[month]/[day]/[slug]/page";
import SegmentBrowserUI from "./_components/SegmentBrowserUI";

export default async function SegmentBrowser({
  params,
}: {
  params: Promise<Record<"year" | "month" | "day" | "slug", string>>;
}) {
  const { slug, year, month, day } = await params;
  const data = await getCachedSegment(slug);

  if (!data) {
    return null;
  }

  const selected = new Date(`${year}/${month}/${day}`);

  selected.setHours(12);

  return <SegmentBrowserUI selected={selected} currentSegment={data} />;
}
