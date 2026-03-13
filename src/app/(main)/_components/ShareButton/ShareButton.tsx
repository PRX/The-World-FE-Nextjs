import type { Maybe } from "@/interfaces";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { generateShareLinks } from "@/lib/generate/social";
import { Share2Icon, MailIcon } from "lucide-react";
import FacebookIcon from "@/assets/svg/icons/brands/facebook.svg";
import BlueskyIcon from "@/assets/svg/icons/brands/bluesky.svg";
import TwitterXIcon from "@/assets/svg/icons/brands/twitter.svg";
import LinkedInIcon from "@/assets/svg/icons/brands/linkedin.svg";
import FlipboardIcon from "@/assets/svg/icons/brands/flipboard.svg";
import WhatsAppIcon from "@/assets/svg/icons/brands/whatsapp.svg";
import { cn } from "@/lib/utils";

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

  const links = generateShareLinks(url, title);
  const { className: buttonClassName, ...buttonRest } = buttonProps || {};
  const { className: menuContentClassName, ...menuContentRest } =
    menuContentProps || {};

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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
