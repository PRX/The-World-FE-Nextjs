import type { Tag } from "@/interfaces";
import SearchInput from "@/app/(main)/_components/SearchInput";
import { getCachedSocialTag } from "@/app/(main)/tags/social_tags/[slug]/page";
import { SFTaxonomyEnum } from "@/gen/search_filters_pb";

export default async function SocialTagSearch({
  params,
}: {
  params: Promise<Record<"slug", string>>;
}) {
  const { slug } = await params;
  let data: Tag | undefined;

  if (slug) {
    data = await getCachedSocialTag(slug);
  }

  if (!data) {
    return null;
  }

  const { name } = data;

  return (
    <SearchInput
      searchContext={{
        label: name || "",
        fetchSearchFilters: {
          ctx: {
            taxonomy: SFTaxonomyEnum.socialTag,
            termSlug: slug,
          },
        },
      }}
    />
  );
}
