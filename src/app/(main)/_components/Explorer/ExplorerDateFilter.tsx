"use client";

import type {
  MonthChangeEventHandler,
  OnSelectHandler,
} from "react-day-picker";
import { type MouseEventHandler, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/util/css";
import { CalendarIcon, XIcon } from "lucide-react";
import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  decodeContentSearchFiltersParam,
  encodeContentSearchFiltersParam,
} from "@/lib/util/binaryData";
import { Calendar } from "@/components/ui/calendar";
import { isUndefined } from "lodash";
import { format } from "date-fns";
import type { ContentSearchFilters } from "@/gen/search_filters_pb";

export type ExplorerDateFilterProps = React.ComponentProps<typeof ButtonGroup>;

export function ExplorerDateFilter({
  className,
  ...props
}: ExplorerDateFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sf = searchParams.get("sf") || undefined;
  const searchFilters = decodeContentSearchFiltersParam(sf);
  const { year, month, day } = searchFilters || {};
  const today = new Date();
  const monthDate =
    !isUndefined(year) && !isUndefined(month)
      ? new Date(year, month - 1)
      : undefined;
  const selectedDate =
    monthDate && !isUndefined(day)
      ? (() => {
          const d = new Date(monthDate);
          d.setDate(day);
          return d;
        })()
      : undefined;
  const hasDateFilter = !!monthDate;
  const label =
    (selectedDate && format(selectedDate, "PPP")) ||
    (monthDate && format(monthDate, "MMM yyyy"));

  const updateSearchFilters = useCallback(
    (newSearchFilters: ContentSearchFilters) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      const newSfParam = encodeContentSearchFiltersParam(newSearchFilters);

      if (newSfParam.length) {
        newSearchParams.set("sf", newSfParam);
      } else {
        newSearchParams.delete("sf");
      }

      router.push(`${pathname}?${newSearchParams.toString()}`, {
        scroll: true,
      });
    },
    [pathname, router.push, searchParams],
  );

  const handleMonthChange: MonthChangeEventHandler = useCallback(
    (newDate) => {
      const newSearchFilters = structuredClone(searchFilters);

      newSearchFilters.year = newDate.getFullYear();
      newSearchFilters.month = newDate.getMonth() + 1;
      delete newSearchFilters.day;

      updateSearchFilters(newSearchFilters);
    },
    [searchFilters, updateSearchFilters],
  );

  const handleDateSelect: OnSelectHandler<Date> = useCallback(
    (newDate) => {
      const newSearchFilters = structuredClone(searchFilters);

      newSearchFilters.year = newDate.getFullYear();
      newSearchFilters.month = newDate.getMonth() + 1;
      newSearchFilters.day = newDate.getDate();

      updateSearchFilters(newSearchFilters);
    },
    [searchFilters, updateSearchFilters],
  );

  const handleClearDate: MouseEventHandler<HTMLButtonElement> = useCallback(
    (e) => {
      e.preventDefault();

      const newSearchFilters = structuredClone(searchFilters);

      delete newSearchFilters.year;
      delete newSearchFilters.month;
      delete newSearchFilters.day;

      updateSearchFilters(newSearchFilters);
    },
    [searchFilters, updateSearchFilters],
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <ButtonGroup className={cn("", className)} {...props}>
          {label && <ButtonGroupText>{label}</ButtonGroupText>}
          {hasDateFilter && (
            <Button
              className="cursor-pointer"
              variant="frosted"
              size="icon"
              aria-label="Clear date filter"
              onClick={handleClearDate}
            >
              <XIcon />
            </Button>
          )}
          <Button className="cursor-pointer" variant="frosted" size="icon" aria-label="Filter by date">
            <CalendarIcon />
          </Button>
        </ButtonGroup>
      </PopoverTrigger>
      <PopoverContent>
        <Calendar
          required
          mode="single"
          captionLayout="dropdown"
          selected={selectedDate}
          startMonth={new Date(2010, 0)}
          month={monthDate}
          endMonth={today}
          onMonthChange={handleMonthChange}
          onSelect={handleDateSelect}
        />
      </PopoverContent>
    </Popover>
  );
}

export default ExplorerDateFilter;
