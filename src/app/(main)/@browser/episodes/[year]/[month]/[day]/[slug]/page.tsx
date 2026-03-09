import { getCachedEpisode } from "@/app/(main)/episodes/[year]/[month]/[day]/[slug]/page";
import EpisodeBrowserUI from "./_components/EpisodeBrowserUI";

export default async function EpisodeBrowser({
  params,
}: {
  params: Promise<Record<"year" | "month" | "day" | "slug", string>>;
}) {
  const { slug, year, month, day } = await params;
  const data = await getCachedEpisode(slug);

  if (!data) {
    return null;
  }

  const selected = new Date(`${year}/${month}/${day}`);

  return <EpisodeBrowserUI selected={selected} currentEpisode={data} />;
}
