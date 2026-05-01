import SearchInput from "@/app/(main)/_components/SearchInput";
import { sanitizeSearchParamsForSiteSearch } from "@/lib/sanitize";

export default async function ExploreSearch({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  const resolvedSearchParams = await searchParams;
  const searchOptionParams =
    sanitizeSearchParamsForSiteSearch(resolvedSearchParams);

  return <SearchInput siteSearchParams={searchOptionParams} />;
}
