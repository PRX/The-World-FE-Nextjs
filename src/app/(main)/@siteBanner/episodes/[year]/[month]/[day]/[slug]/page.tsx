import { cookies } from "next/headers";
import CtaRegion from "@/app/(main)/_components/CtaRegion";
import { getCachedEpisode } from "@/app/(main)/episodes/[year]/[month]/[day]/[slug]/page";
import { getCtaRegionMessages, getShownMessage } from "@/lib/cta";

export default async function EpisodeSiteBanner({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const { id } = (await getCachedEpisode(slug)) || {};
  const ctaMessages = await getCtaRegionMessages("site-banner", {
    ...(id && { id }),
  });
  const shownMessage = getShownMessage(ctaMessages, cookieStore);

  return (
    shownMessage && (
      <CtaRegion
        className="max-md:rounded-none"
        cta={shownMessage}
        dismissible
      />
    )
  );
}
