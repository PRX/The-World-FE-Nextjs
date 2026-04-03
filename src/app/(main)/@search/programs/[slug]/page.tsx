import type { Program } from "@/interfaces";
import SearchInput from "@/app/(main)/_components/SearchInput";
import { getCachedProgram } from "@/app/(main)/programs/[slug]/page";
import { SFTaxonomyEnum } from "@/gen/search_filters_pb";

export default async function ProgramSearch({
  params,
}: {
  params: Promise<Record<"slug", string>>;
}) {
  const { slug } = await params;
  let data: Program | undefined;

  if (slug) {
    data = await getCachedProgram(slug);
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
            taxonomy: SFTaxonomyEnum.program,
            termSlug: slug,
          },
        },
      }}
    />
  );
}
