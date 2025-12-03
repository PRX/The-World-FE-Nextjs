import { CtaRegionIdType, type ICtaFilterProps } from "@/interfaces";
import { fetchGqlCtaRegion } from "@/lib/fetch";
import { parseCtaMessage } from "@/lib/parse/cta";
import { filterCtaMessages } from "./filterCtaMessages";

export async function getCtaRegionMessages(
  slug: string,
  filterOptions?: ICtaFilterProps,
) {
  const { ctaRegionContent } =
    (await fetchGqlCtaRegion(slug, CtaRegionIdType.Slug)) || {};
  const { callToActions } = ctaRegionContent || {};

  return callToActions
    ?.map((cta) => parseCtaMessage(cta, slug))
    .filter((v) => !!v)
    .map((cta) => ({
      priority:
        (cta.targetContent && 2) ||
        ((cta.targetCategories || cta.targetPrograms) && 1) ||
        0,
      cta,
    }))
    .sort((a, b) => b.priority - a.priority)
    .map((item) => item.cta)
    .filter(filterCtaMessages(filterOptions));
}
