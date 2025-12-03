import { getCtaRegionMessages, getShownMessage } from "@/lib/cta";
import CtaRegion from "@/app/(main)/_components/CtaRegion";

export default async function DefaultCtaSiteBanner() {
  const ctaMessages = await getCtaRegionMessages("site-banner");
  const shownMessage = getShownMessage(ctaMessages);

  return shownMessage && <CtaRegion cta={shownMessage} dismissible />;
}
