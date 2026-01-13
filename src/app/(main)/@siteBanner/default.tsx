import { getCtaRegionMessages, getShownMessage } from "@/lib/cta";
import CtaRegion from "@/app/(main)/_components/CtaRegion";
import { cookies } from "next/headers";

export default async function DefaultCtaSiteBanner() {
  const cookieStore = await cookies();
  const ctaMessages = await getCtaRegionMessages("site-banner");
  const shownMessage = getShownMessage(ctaMessages, cookieStore);

  return shownMessage && <CtaRegion cta={shownMessage} dismissible />;
}
