import DonateModalLink from "@/components/Donate/DonateModalLink";
import cn from "@/lib/util/css/cn";
import { HeartHandshakeIcon } from "lucide-react";

export default function EpisodeBrowser() {
  return (
    <div
      className={cn(
        "overflow-y-auto",
        "grid place-items-center bg-foreground md:bg-foreground/30 rounded-md text-navy-blue", // TEMP STYLES
      )}
    >
      EPISODE BROWSER
      <DonateModalLink
        campaign="731684"
        className="flex items-center gap-x-1 bg-red bg-linear-to-r from-red to-purple transition-[--tw-gradient-to] duration-300 hover:to-red border border-red rounded-sm px-2 py-1 text-white font-medium"
      >
        <HeartHandshakeIcon aria-label="Donate" />
        <span className="hidden md:inline" aria-hidden>
          Donate
        </span>
      </DonateModalLink>
    </div>
  );
}
