import { getCachedEpisode } from "@/app/(main)/episodes/[year]/[month]/[day]/[slug]/page";
import EpisodeBrowserUI from "./_components/EpisodeBrowserUI";

export default async function EpisodeBrowser({
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

  const data = await getCachedEpisode(slug);

  const selected = new Date(year, month - 1, day, 12);

  selected.setHours(12);

  return <EpisodeBrowserUI selected={selected} currentEpisode={data} />;
}
