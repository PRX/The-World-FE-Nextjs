import { isArray } from "lodash";

export function sanitizeSearchParamsForSiteSearch(
  searchParams: Record<string, string | string[]>,
) {
  const { search: searchParam, sf: sfParam } = searchParams;
  const search = isArray(searchParam) ? searchParam.join(", ") : searchParam;
  const sf = isArray(sfParam) ? sfParam[0] : sfParam;

  return { search, sf };
}

export default sanitizeSearchParamsForSiteSearch;
