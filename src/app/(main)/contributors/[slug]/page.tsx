import CtaRegion from "@/app/(main)/_components/CtaRegion";
import { ContributorIdType } from "@/interfaces";
import { getCtaRegionMessages, getShownMessage } from "@/lib/cta";
import { fetchGqlContributor } from "@/lib/fetch";
import Explorer from "@/app/(main)/_components/Explorer";
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";
import { HtmlContent } from "@/components/HtmlContent";

export const getCachedContributor = unstable_cache(
  async (slug) => fetchGqlContributor(slug, ContributorIdType.Slug),
  ["contributor"],
  {
    tags: ["contributor", "taxonomy"],
    revalidate: 60,
  },
);

export default async function ContributorPage({
  params,
  searchParams,
}: {
  params: Promise<Record<"slug", string>>;
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  let data: Awaited<ReturnType<typeof getCachedContributor>>;

  if (slug) {
    data = await getCachedContributor(slug);

    if (!data) return notFound();
  }

  const { name, description, contributorDetails } = data || {};
  const { bio } = contributorDetails || {};
  const content = bio || description;
  const hasContent = !!content?.trim();
  const explorerProps = {};

  const shownContentEndMessage = await getCtaRegionMessages(
    "landing-inline-end",
  ).then((messages) => getShownMessage(messages));

  return (
    <div className="mt-10 ml-(--gutter-left) mr-(--gutter-right)">
      {hasContent && (
        <div className="max-w-3xl mx-auto my-12 px-4">
          <HtmlContent html={content} />
        </div>
      )}

      <Explorer {...explorerProps} />

      {shownContentEndMessage && (
        <div className="px-4">
          <CtaRegion cta={shownContentEndMessage} />
        </div>
      )}
    </div>
  );
}
