/**
 * @file AutoplayButton.tsx
 * Autoplay button component to toggle playing state of player.
 */

import type React from "react";
import { useContext } from "react";
import { PlayerContext } from "@/components/Player";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/util/css";
import { PlayIcon } from "lucide-react";

export type AutoplayButtonProps = React.ComponentProps<typeof Switch>;

export const AutoplayButton = ({
  className,
  ...other
}: AutoplayButtonProps) => {
  const { state, enableAutoplay, disableAutoplay } = useContext(PlayerContext);
  const { autoplay } = state;
  const tooltipText = `Autoplay is ${autoplay ? "on" : "off"}`;

  const handleClick = (checked: boolean) => {
    if (checked) {
      enableAutoplay();
    } else {
      disableAutoplay();
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Switch
          {...other}
          className={cn("", className)}
          defaultChecked={autoplay}
          checked={autoplay}
          onCheckedChange={handleClick}
        >
          <PlayIcon
            className="fill-current stroke-0"
            aria-label={tooltipText}
          />
        </Switch>
      </TooltipTrigger>
      <TooltipContent className="z-(--z-ui-player)">
        {tooltipText}
      </TooltipContent>
    </Tooltip>
  );
};
