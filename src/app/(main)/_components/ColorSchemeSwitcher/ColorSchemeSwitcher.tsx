"use client";

import type { RefAttributes } from "react";
import type { Preferences } from "@/interfaces";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CloudMoonIcon, CloudSunIcon, SunIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export function ColorSchemeSwitcher(props: RefAttributes<HTMLDivElement>) {
  const [preferences, setPreferences] =
    useLocalStorage<Preferences>("preferences");
  const { colorScheme } = preferences || {};

  function handleValueChange(newColorScheme: string) {
    const newPreferences = structuredClone(preferences);

    switch (newColorScheme) {
      case "dark":
      case "light":
        newPreferences.colorScheme = newColorScheme;
        break;

      default:
        delete newPreferences.colorScheme;
        break;
    }

    setPreferences(newPreferences);
  }

  return (
    <ToggleGroup
      {...props}
      type="single"
      variant="default"
      size="icon"
      spacing={2}
      defaultValue="default"
      value={colorScheme}
      onValueChange={handleValueChange}
      aria-label="Color scheme switcher"
      aria-description="Changes the color scheme of the content body."
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <ToggleGroupItem value="light">
            <CloudSunIcon aria-label="Light" />
          </ToggleGroupItem>
        </TooltipTrigger>
        <TooltipContent>Cloudy Sky</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <ToggleGroupItem value="default">
            <SunIcon aria-label="Default" />
          </ToggleGroupItem>
        </TooltipTrigger>
        <TooltipContent>Clear Sky</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <ToggleGroupItem value="dark">
            <CloudMoonIcon aria-label="Dark" />
          </ToggleGroupItem>
        </TooltipTrigger>
        <TooltipContent>Night Sky</TooltipContent>
      </Tooltip>
    </ToggleGroup>
  );
}
