"use client";

import { type MouseEventHandler, useCallback, useState } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { AnimatePresence, motion } from "motion/react";
import useSWR from "swr";
import type { Episode, RootQueryToContentNodeConnection } from "@/interfaces";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/util/css";
import { generateContentLinkHref } from "@/lib/routing";
import { DateTime } from "@/components/DateTime";
import { convertSecondsToDuration } from "@/lib/parse/time";
import { CalendarSearchIcon } from "lucide-react";
import { encodeContentSearchFiltersParam } from "@/lib/util/binaryData";
import { SFContentTypeEnum } from "@/gen/search_filters_pb";

function useContentInMonth(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const sf = encodeContentSearchFiltersParam({
    year,
    month,
    contentType: SFContentTypeEnum.EPISODE,
  });

  const apiUrlParams = new URLSearchParams({
    sf,
  });
  const { data, error, isLoading } = useSWR(
    `/api/explore?${apiUrlParams.toString()}`,
    (url) =>
      fetch(url)
        .then((res) => res.json())
        .then(
          (data: RootQueryToContentNodeConnection) => data.nodes as Episode[],
        ),
  );
  const episodesMap = new Map<string, Episode[]>();

  data?.forEach((e) => {
    if (!e.date) return;

    const d = new Date(e.date);
    const dateEpisodes = episodesMap.get(d.toDateString()) || [];

    dateEpisodes.push(e);
    episodesMap.set(d.toDateString(), dateEpisodes);
  });

  return {
    episodes: episodesMap,
    isError: error,
    isLoading,
  };
}

export type EpisodeBrowserProps = {
  selected: Date;
  currentEpisode: Episode;
};

export default function EpisodeBrowserUI({
  selected: initialSelected,
  currentEpisode,
}: EpisodeBrowserProps) {
  const router = useRouter();
  const pathname = usePathname();
  const today = new Date();
  const [selected, setSelected] = useState(initialSelected);
  const [isInit, setIsInit] = useState(
    `${initialSelected.toDateString()}` === `${selected.toDateString()}`,
  );
  const [selectedMonth, setSelectedMonth] = useState(
    new Date(`${selected.getFullYear()}/${selected.getMonth() + 1}/1`),
  );
  const { episodes, isLoading } = useContentInMonth(selectedMonth);
  const selectedEpisodes = episodes?.get(selected?.toDateString());
  const CalendarProps = {
    mode: "single",
    showOutsideDays: false,
    captionLayout: "dropdown",
    startMonth: new Date(2012, 8),
    month: selectedMonth,
    endMonth: today,
    disabled: (d: Date) => !episodes?.has(d.toDateString()),
    onSelect: (d) =>
      setSelected((cd) => {
        setIsInit(false);
        return d || cd;
      }),
    onMonthChange: setSelectedMonth,
    modifiers: {
      hasEpisodes: (d: Date) => episodes?.has(d.toDateString()),
    },
    modifiersClassNames: {
      hasEpisodes: "bg-current/10 rounded-md",
    },
    ...(selected && { selected }),
  } as React.ComponentProps<typeof Calendar>;

  const handleLinkClick: MouseEventHandler<HTMLAnchorElement> = useCallback(
    (e) => {
      e.preventDefault();

      const href = e.currentTarget.getAttribute("href");
      const isCurrentPathname = !!href?.startsWith(pathname);

      if (href && !isCurrentPathname) {
        router.push(href);
      }
    },
    [pathname, router.push],
  );

  return (
    <div className={cn("flex flex-col ps-2 pt-4 overflow-hidden")}>
      <Calendar
        className={cn(
          "px-2 pt-0 bg-current/0 [--cell-size:--spacing(7)] text-md",
          {
            "**:data-day:animate-pulse": isLoading,
          },
        )}
        {...CalendarProps}
      />
      <Separator className="bg-transparent bg-linear-to-r from-cyan/50 to-green/0" />
      <div className="flex flex-col gap-y-2 p-4 overflow-y-auto no-scrollbar">
        <AnimatePresence mode="popLayout">
          {isLoading && (
            <motion.div
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center gap-2 text-sm p-2 rounded-md bg-current/10 animate-pulse"
            >
              <CalendarSearchIcon className="size-[1.25em]" />
              <span>Looking Up Episodes...</span>
            </motion.div>
          )}
          {selectedEpisodes?.map((e, index, all) => {
            const { id, date, link, title, episodeAudio } = e;
            const { duration } = episodeAudio?.audio?.node || {};
            const linkHref = generateContentLinkHref(link);

            return (
              linkHref && (
                <motion.a
                  href={linkHref}
                  onClick={handleLinkClick}
                  variants={{
                    hidden: {
                      opacity: 0,
                      scale: 0.9,
                      filter: "blur(10px)",
                      transition: {
                        delay: 0.1 * index,
                      },
                    },
                    initial: { opacity: 0, scale: 0.9, filter: "blur(0px)" },
                    visible: {
                      opacity: 1,
                      scale: 1,
                      filter: "blur(0px)",
                      transition: {
                        delay: 0.1 * (index + all.length / 2),
                      },
                    },
                  }}
                  initial={isInit ? false : "initial"}
                  animate="visible"
                  exit="hidden"
                  className={cn(
                    "flex flex-col gap-2 p-4 rounded-sm",
                    "bg-current/0 hover:bg-current/10 backdrop-blur-lg backdrop-brightness-125 bg-linear-to-r from-cyan/0 to-cyan/0",
                    "data-[active=true]:from-cyan/30 data-[active=true]:to-green/20",
                  )}
                  data-active={id === currentEpisode?.id}
                  key={id}
                >
                  <strong className="text-md/tight text-pretty">{title}</strong>
                  <span className="flex text-sm/tight [&>*+*]:before:content-['\2022'] [&>*+*]:before:mx-1">
                    <DateTime
                      date={date}
                      options={{
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }}
                    />
                    {!!duration && (
                      <span>{convertSecondsToDuration(duration)}</span>
                    )}
                  </span>
                </motion.a>
              )
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
