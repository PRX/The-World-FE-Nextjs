"use client";

import type {
  MonthChangeEventHandler,
  OnSelectHandler,
} from "react-day-picker";
import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/util/css";
import { CalendarIcon } from "lucide-react";
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

export type ExplorerDateFilterProps = React.ComponentProps<typeof ButtonGroup>;

export function ExplorerDateFilter({
  className,
  ...props
}: ExplorerDateFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sf = searchParams.get("sf") || undefined;
  const [searchFilters, setSearchFilters] = useState(
    decodeContentSearchFiltersParam(sf),
  );
  const { year, month, day } = searchFilters || {};
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
  const label =
    (selectedDate && format(selectedDate, "PPP")) ||
    (monthDate && format(monthDate, "MMM yyyy"));

  const handleMonthChange: MonthChangeEventHandler = useCallback(
    (newDate) => {
      const newSearchFilters = structuredClone(searchFilters);

      newSearchFilters.year = newDate.getFullYear();
      newSearchFilters.month = newDate.getMonth() + 1;
      delete newSearchFilters.day;

      setSearchFilters(newSearchFilters);
    },
    [searchFilters],
  );

  const handleDateSelect: OnSelectHandler<Date> = useCallback(
    (newDate) => {
      const newSearchFilters = structuredClone(searchFilters);

      newSearchFilters.year = newDate.getFullYear();
      newSearchFilters.month = newDate.getMonth() + 1;
      newSearchFilters.day = newDate.getDate();

      setSearchFilters(newSearchFilters);
    },
    [searchFilters],
  );

  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    const newSfParam = encodeContentSearchFiltersParam(searchFilters);
    if (newSfParam.length) {
      newSearchParams.set("sf", newSfParam);
    } else {
      newSearchParams.delete("sf");
    }

    router.push(`${pathname}?${newSearchParams.toString()}`);
  }, [searchFilters, pathname, router.push, searchParams.toString]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <ButtonGroup>
          {label && <ButtonGroupText>{label}</ButtonGroupText>}
          <Button variant="frosted" size="icon">
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
          onMonthChange={handleMonthChange}
          onSelect={handleDateSelect}
        />
      </PopoverContent>
    </Popover>
  );
}

export default ExplorerDateFilter;
