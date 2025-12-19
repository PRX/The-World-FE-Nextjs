import CtaRegion from "@/app/(main)/_components/CtaRegion";
import { ProgramIdType } from "@/interfaces";
import { getCtaRegionMessages, getShownMessage } from "@/lib/cta";
import { fetchGqlProgram } from "@/lib/fetch";
import { uniqueId } from "lodash";
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";

export const getCachedProgram = unstable_cache(
  async (slug) => fetchGqlProgram(slug, ProgramIdType.Slug),
  ["program"],
  {
    tags: ["program", "taxonomy"],
    revalidate: 60,
  },
);

export default async function TaxonomyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getCachedProgram(slug);

  if (!data) {
    return notFound();
  }

  const { id } = data;

  const shownContentEndMessage = await getCtaRegionMessages(
    "landing-inline-end",
    {
      ...(id && { id }),
    },
  ).then((messages) => getShownMessage(messages));

  return (
    <div className="mt-10 ml-(--gutter-left) mr-(--gutter-right)">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(var(--spacing)*100,100%),1fr))] gap-4 px-8">
        {new Array(30).fill(null).map(() => (
          <div
            className="grid aspect-[4/5] bg-white/10 rounded-md"
            key={uniqueId()}
          ></div>
        ))}
      </div>

      {shownContentEndMessage && (
        <div className="px-4">
          <CtaRegion cta={shownContentEndMessage} />
        </div>
      )}
    </div>
  );
}
