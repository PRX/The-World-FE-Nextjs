import { cookies } from "next/headers";
import { ProgramIdType } from "@/interfaces";
import { getCtaRegionMessages, getShownMessage } from "@/lib/cta";
import { fetchGqlProgram } from "@/lib/fetch";
import CtaRegion from "@/app/(main)/_components/CtaRegion";

export default async function HomeSiteBanner() {
  const cookieStore = await cookies();
  const { id } = (await fetchGqlProgram("the-world", ProgramIdType.Slug)) || {};
  const ctaMessages = await getCtaRegionMessages("site-banner", {
    ...(id && { programs: [id] }),
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
