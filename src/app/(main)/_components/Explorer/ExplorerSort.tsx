"use client";

import { useCallback, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/util/css";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  decodeContentSearchFiltersParam,
  encodeContentSearchFiltersParam,
} from "@/lib/util/binaryData";
import { SFContentSortEnum } from "@/gen/search_filters_pb";
import { isUndefined } from "lodash";

export type ExplorerSortFilterProps = React.ComponentProps<
  typeof SelectContent
>;

export function ExplorerSortFilter({
  className,
  ...props
}: ExplorerSortFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sf = searchParams.get("sf") || undefined;
  const searchFilters = decodeContentSearchFiltersParam(sf);
  const ctMap = new Map([
    [
      SFContentSortEnum.NEWEST,
      {
        value: `${SFContentSortEnum.NEWEST}`,
        label: "Newest",
      },
    ],
    [
      SFContentSortEnum.OLDEST,
      {
        value: `${SFContentSortEnum.OLDEST}`,
        label: "Oldest",
      },
    ],
    [
      SFContentSortEnum.TITLE_AZ,
      {
        value: `${SFContentSortEnum.TITLE_AZ}`,
        label: "Title A-Z",
      },
    ],
    [
      SFContentSortEnum.TITLE_ZA,
      {
        value: `${SFContentSortEnum.TITLE_ZA}`,
        label: "Title Z-A",
      },
    ],
  ]);
  const defaultValue = ctMap.get(SFContentSortEnum.NEWEST);
  const { sort } = searchFilters;
  const [selected, setSelected] = useState(
    !isUndefined(sort) ? ctMap.get(sort) : defaultValue,
  );

  const handleValueChange = useCallback(
    (newValue: string) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      const newSort = parseInt(newValue, 10);

      setSelected(ctMap.get(newSort));

      if (newSort) {
        searchFilters.sort = parseInt(newValue, 10);
      } else {
        delete searchFilters.sort;
      }

      const newSfParam = encodeContentSearchFiltersParam(searchFilters);
      if (newSfParam.length) {
        newSearchParams.set("sf", newSfParam);
      } else {
        newSearchParams.delete("sf");
      }

      router.push(`${pathname}?${newSearchParams.toString()}`);
    },
    [searchFilters, pathname, router.push, searchParams.toString, ctMap.get],
  );

  return (
    <Select
      onValueChange={handleValueChange}
      defaultValue={defaultValue?.value}
      value={selected?.value}
    >
      <SelectTrigger data-slot="explorer-filter-control-sort">
        <SelectValue placeholder="Sort Order" />
      </SelectTrigger>
      <SelectContent className={cn("", className)} align="end" {...props}>
        <SelectGroup>
          {[...ctMap.values()].map((opt) => (
            <SelectItem key={opt.value} value={opt.value || ""}>
              <span className="font-medium">{opt.label}</span>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default ExplorerSortFilter;
