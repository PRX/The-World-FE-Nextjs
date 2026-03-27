"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
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

export type ExplorerParams = React.ComponentProps<"div"> & {
  fetchEndpoint?: string;
  pageInfo?: PageInfo;
};

export default function Explorer({
  className,
  children,
  fetchEndpoint = "explore",
  pageInfo: initialPageInfo,
  ...props
}: ExplorerParams) {
  const [pageInfo, setPageInfo] = useState(initialPageInfo);
  const { hasNextPage, endCursor } = pageInfo || {};
  const [contentNodes, setContentNodes] = useState<ContentNode[]>();
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || undefined;
  const sf = searchParams.get("sf") || undefined;

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
    <div className={cn("flex flex-col gap-4", className)} {...props}>
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
          .map((node) => {
            return (
              <ExplorerCard
                data={node as ContentNode}
                key={uniqueId(node.id)}
              />
            );
          })}
      </InfiniteScroll>
    </div>
  );
}
