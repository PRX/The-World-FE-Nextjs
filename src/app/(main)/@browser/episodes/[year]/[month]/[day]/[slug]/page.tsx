import DonateModalLink from "@/components/Donate/DonateModalLink";
import cn from "@/lib/util/css/cn";
import { HeartHandshakeIcon } from "lucide-react";

export default function EpisodeBrowser() {
  return (
    <div
      className={cn(
        "overflow-y-auto",
        "grid justify-center content-start gap-4 py-2", // TEMP STYLES
      )}
    >
      EPISODE BROWSER
      <DonateModalLink campaign="731684" variant="action">
        <HeartHandshakeIcon aria-label="Donate" />
        <span className="hidden md:inline" aria-hidden>
          Donate
        </span>
      </DonateModalLink>
    </div>
  );
}
