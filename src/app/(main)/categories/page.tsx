import { uniqueId } from "lodash";
import CtaRegion from "@/app/(main)/_components/CtaRegion";
import { getCtaRegionMessages, getShownMessage } from "@/lib/cta";

export default async function TaxonomyPage() {
  const shownContentEndMessage = await getCtaRegionMessages(
    "landing-inline-end",
  ).then((messages) => getShownMessage(messages));

  return (
    <div className="mt-10 ml-(--gutter-left) mr-(--gutter-right)">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(var(--spacing)*100,100%),1fr))] gap-4 px-8">
        {new Array(30).fill(null).map(() => (
          <div
            className="grid aspect-[4/5] bg-white/10 rounded-md"
            key={uniqueId()}
          ></div>
        ))}
      </div>

      {shownContentEndMessage && (
        <div className="px-4">
          <CtaRegion cta={shownContentEndMessage} />
        </div>
      )}
    </div>
  );
}
