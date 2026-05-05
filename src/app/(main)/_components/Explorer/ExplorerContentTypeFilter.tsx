"use client";

import { useCallback, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
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
import { SFContentTypeEnum } from "@/gen/search_filters_pb";
import { isUndefined } from "lodash";

export type ExplorerContentTypeFilterProps = React.ComponentProps<
  typeof SelectContent
>;

export function ExplorerContentTypeFilter({
  className,
  ...props
}: ExplorerContentTypeFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sf = searchParams.get("sf") || undefined;
  const searchFilters = decodeContentSearchFiltersParam(sf);
  const ctMap = new Map([
    [
      SFContentTypeEnum.ALL,
      {
        value: `${SFContentTypeEnum.ALL}`,
        label: "All Types",
      },
    ],
    [
      SFContentTypeEnum.POST,
      {
        value: `${SFContentTypeEnum.POST}`,
        label: "Stories",
      },
    ],
    [
      SFContentTypeEnum.EPISODE,
      {
        value: `${SFContentTypeEnum.EPISODE}`,
        label: "Episodes",
      },
    ],
    [
      SFContentTypeEnum.SEGMENT,
      {
        value: `${SFContentTypeEnum.SEGMENT}`,
        label: "Segments",
      },
    ],
  ]);
  const defaultValue = ctMap.get(SFContentTypeEnum.ALL);
  const { contentType } = searchFilters;
  const [selected, setSelected] = useState(
    !isUndefined(contentType) ? ctMap.get(contentType) : defaultValue,
  );

  const handleValueChange = useCallback(
    (newValue: string) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      const newContentType = parseInt(newValue, 10);

      setSelected(ctMap.get(newContentType));

      if (newContentType) {
        searchFilters.contentType = parseInt(newValue, 10);
      } else {
        delete searchFilters.contentType;
      }

      const newSfParam = encodeContentSearchFiltersParam(searchFilters);
      if (newSfParam.length) {
        newSearchParams.set("sf", newSfParam);
      } else {
        newSearchParams.delete("sf");
      }

      router.push(`${pathname}?${newSearchParams.toString()}`, {
        scroll: true,
      });
    },
    [searchFilters, pathname, router.push, searchParams.toString, ctMap.get],
  );

  return (
    <Select
      onValueChange={handleValueChange}
      defaultValue={defaultValue?.value}
      value={selected?.value}
    >
      <SelectTrigger data-slot="explorer-filter-control-content-type">
        <SelectValue placeholder="Filter By Type" />
      </SelectTrigger>
      <SelectContent className={cn("", className)} {...props}>
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

export default ExplorerContentTypeFilter;
