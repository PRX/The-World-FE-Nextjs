"use client";

import { useSearchParams } from "next/navigation";
import { Children, useCallback, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import type {
  ContentNode,
  PageInfo,
  RootQueryToContentNodeConnection,
} from "@/interfaces";
import { cn } from "@/lib/util/css";
import { ExplorerCard } from "./ExplorerCard";
import { Skeleton } from "@/components/ui/skeleton";
import { uniqueId } from "lodash";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { SearchAlertIcon } from "lucide-react";
import type { ContentSearchFiltersSchema } from "@/gen/search_filters_pb";
import type { MessageInitShape } from "@bufbuild/protobuf";
import {
  decodeContentSearchFiltersParam,
  encodeContentSearchFiltersParam,
} from "@/lib/util/binaryData";

export type ExplorerParams = React.ComponentProps<"div"> & {
  fetchEndpoint?: string;
  fetchSearchFilters?: MessageInitShape<typeof ContentSearchFiltersSchema>;
  pageInfo?: PageInfo;
};

export default function Explorer({
  className,
  children,
  fetchEndpoint = "explore",
  fetchSearchFilters,
  pageInfo: initialPageInfo,
  ...props
}: ExplorerParams) {
  const [pageInfo, setPageInfo] = useState(initialPageInfo);
  const { hasNextPage, endCursor } = pageInfo || {};
  const [contentNodes, setContentNodes] = useState<ContentNode[]>();
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || undefined;
  const sfParam = searchParams.get("sf") || undefined;
  const searchFilters =
    sfParam || fetchSearchFilters
      ? {
          ...fetchSearchFilters,
          ...decodeContentSearchFiltersParam(sfParam),
        }
      : undefined;
  const sf = encodeContentSearchFiltersParam(searchFilters);
  const hasInitialData = !!(children && Children.toArray(children).length);

  const fetchData = useCallback(async () => {
    if (!fetchEndpoint) return;

    const fetchParams = new URLSearchParams();

    if (endCursor) {
      fetchParams.set("after", endCursor);
    }

    if (search) {
      fetchParams.set("search", search);
    }

    if (sf) {
      fetchParams.set("sf", sf);
    }

    const data: RootQueryToContentNodeConnection = await fetch(
      `/api/${fetchEndpoint}?${fetchParams.toString()}`,
    ).then((res) => res.ok && res.json());

    if (data) {
      setPageInfo(data.pageInfo);
      setContentNodes((cns) => [...(cns || []), ...(data.nodes || [])]);
    }
  }, [endCursor, fetchEndpoint, search, sf]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Need to reset extra page results when search filters are changed.
  useEffect(() => {
    setPageInfo(initialPageInfo);
    setContentNodes(undefined);
    window.scrollTo(0, 0);
  }, [search, sf, initialPageInfo]);

  const cardGridClassName = cn(
    "grid grid-cols-[repeat(auto-fill,minmax(calc(var(--spacing)*65),1fr))] gap-4",
    "*:data-[slot=card]:nth-of-type-[7n+2]:[--card:var(--color-brown)]",
    "*:data-[slot=card]:nth-of-type-[7n+3]:[--card:var(--color-burnt-orange)]",
    "*:data-[slot=card]:nth-of-type-[7n+4]:[--card:var(--color-light-blue)]",
    "*:data-[slot=card]:nth-of-type-[7n+5]:[--card:var(--color-dark-green)]",
    "*:data-[slot=card]:nth-of-type-[7n+6]:[--card:var(--color-purple)]",
    "*:data-[slot=card]:nth-of-type-[7n+7]:[--card:var(--color-red)]",
  );

  return (
    <div
      className={cn("flex flex-col gap-4 w-full max-w-7xl mx-auto", className)}
      {...props}
    >
      {hasInitialData ? (
        <>
          <div className={cardGridClassName}>{children}</div>
          <InfiniteScroll
            className={cardGridClassName}
            dataLength={contentNodes?.length || 0}
            next={fetchData}
            hasMore={!!hasNextPage}
            loader={
              <div className="col-span-full grid grid-cols-[repeat(auto-fit,minmax(calc(var(--spacing)*65),1fr))] gap-4 h-200 overflow-hidden mask-b-from-100">
                {new Array(8).fill(null).map(() => (
                  <Skeleton className="aspect-2/3 h-auto" key={uniqueId()} />
                ))}
              </div>
            }
          >
            {contentNodes
              ?.filter((n) => !!n)
              .map((node, index) => {
                return (
                  <ExplorerCard
                    data={node as ContentNode}
                    key={uniqueId(node.id)}
                    index={60 + index}
                  />
                );
              })}
          </InfiniteScroll>
        </>
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <SearchAlertIcon />
            </EmptyMedia>
            <EmptyTitle>No Results Found</EmptyTitle>
            <EmptyDescription>
              We were not able to find anything related to your search query.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </div>
  );
}
