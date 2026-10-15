"use client";

import type { Maybe } from "@/interfaces";
import Link from "next/link";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { generateShareLinks } from "@/lib/generate/social";
import { Share2Icon, MailIcon, ClipboardCopyIcon } from "lucide-react";
import FacebookIcon from "@/assets/svg/icons/brands/facebook.svg";
import BlueskyIcon from "@/assets/svg/icons/brands/bluesky.svg";
import TwitterXIcon from "@/assets/svg/icons/brands/twitter.svg";
import LinkedInIcon from "@/assets/svg/icons/brands/linkedin.svg";
import FlipboardIcon from "@/assets/svg/icons/brands/flipboard.svg";
import WhatsAppIcon from "@/assets/svg/icons/brands/whatsapp.svg";
import { cn } from "@/lib/util/css";

const iconMap = new Map([
  ["facebook", FacebookIcon],
  ["bluesky", BlueskyIcon],
  ["twitter", TwitterXIcon],
  ["linkedin", LinkedInIcon],
  ["flipboard", FlipboardIcon],
  ["whatsapp", WhatsAppIcon],
  ["email", MailIcon],
]);

export type ShareButtonProps = {
  url?: Maybe<string>;
  title?: Maybe<string>;
  buttonProps?: React.ComponentProps<typeof Button>;
  menuContentProps?: React.ComponentProps<typeof DropdownMenuContent>;
};

export default function ShareButton({
  url,
  title,
  buttonProps,
  menuContentProps,
}: ShareButtonProps) {
  if (!url || !title) return null;

  const linkProtocol = "https";
  const linkHostname = "theworld.org";
  const linkUrl = new URL(url, `${linkProtocol}://${linkHostname}`);

  linkUrl.protocol = linkProtocol;
  linkUrl.hostname = linkHostname;

  const links = generateShareLinks(linkUrl.toString(), title);
  const { className: buttonClassName, ...buttonRest } = buttonProps || {};
  const { className: menuContentClassName, ...menuContentRest } =
    menuContentProps || {};

  const handleCopy = (_text: string, copied: boolean) => {
    if (copied) {
      toast.success("Copied to clipboard.");
    } else {
      toast.warning("Unable to copy to clipboard.");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={cn("cursor-pointer max-sm:aspect-square", buttonClassName)}
          variant="action"
          size="lg"
          {...buttonRest}
        >
          <Share2Icon aria-label="Share" />
          <span className="max-sm:hidden" aria-hidden>
            Share
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={cn(
          "bg-[radial-gradient(98.54%_133.43%_at_2.56%_100%,#622b68,#38739d)] border-none shadow-md",
          menuContentClassName,
        )}
        {...menuContentRest}
      >
        {links.map(({ key, link }) => {
          const Icon = iconMap.get(key);
          return (
            <DropdownMenuItem key={key}>
              {Icon && <Icon viewBox="0 0 24 24" />}
              <Link href={link.url} target="_blank">
                {link.title}
              </Link>
            </DropdownMenuItem>
          );
        })}

        <CopyToClipboard text={linkUrl.toString()} onCopy={handleCopy}>
          <DropdownMenuItem>
            <ClipboardCopyIcon />
            <span>Copy Link</span>
          </DropdownMenuItem>
        </CopyToClipboard>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
