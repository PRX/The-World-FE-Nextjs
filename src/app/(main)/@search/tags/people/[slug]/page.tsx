import type { Tag } from "@/interfaces";
import SearchInput from "@/app/(main)/_components/SearchInput";
import { getCachedPerson } from "@/app/(main)/tags/people/[slug]/page";
import { SFTaxonomyEnum } from "@/gen/search_filters_pb";

export default async function PersonSearch({
  params,
}: {
  params: Promise<Record<"slug", string>>;
}) {
  const { slug } = await params;
  let data: Tag | undefined;

  if (slug) {
    data = await getCachedPerson(slug);
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
            taxonomy: SFTaxonomyEnum.person,
            termSlug: slug,
          },
        },
      }}
    />
  );
}
