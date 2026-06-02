"use client";

import type { Station } from "@/interfaces";
import { type InputEventHandler, useCallback, useState } from "react";
import { HdIcon, MapPinIcon, SearchAlertIcon, XIcon } from "lucide-react";
import { uniqueId } from "lodash";
import { cn } from "@/lib/util/css";
import { convertRegion } from "@/lib/convert/string";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import {
  Card,
  CardDescription,
  CardHeader,
  CardLink,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
} from "@/components/ui/input-group";
import { Time } from "@/components/DateTime";

export type StationFinderProps = React.ComponentProps<"div"> & {
  data: Station[];
};

export function StationFinder({
  data,
  className,
  ...props
}: StationFinderProps) {
  const [query, setQuery] = useState<string>();
  const hasQuery = !!query?.trim().length;
  const filteredStations = hasQuery
    ? data.filter(({ title, provincesOrStates }) => {
        const text = [title, provincesOrStates?.nodes[0]?.name]
          .join(", ")
          .toLowerCase();

        return !!text.includes(query.toLowerCase());
      })
    : data;
  const hasFilterResult = !!filteredStations?.length;

  const handleInput: InputEventHandler<HTMLInputElement> = useCallback((e) => {
    setQuery(e.currentTarget.value);
  }, []);

  return (
    <div className={cn("grid gap-10", className)} {...props}>
      <InputGroup className="p-0 rounded-full backdrop-blur-xl backdrop-brightness-110">
        <InputGroupInput
          name="search"
          value={query}
          placeholder="Search for a station..."
          className="rounded-full w-full"
          onInput={handleInput}
          autoComplete="off"
        />
        <InputGroupAddon
          align="inline-end"
          className={cn("p-0 px-1 has-[>button]:mr-0", {
            invisible: !hasQuery,
          })}
        >
          <InputGroupButton
            className="rounded-full cursor-pointer"
            size="icon-xs"
            disabled={!hasQuery}
            onClick={() => {
              setQuery(undefined);
            }}
          >
            <XIcon className="size-5" aria-label="Clear Station Search" />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>

      {hasFilterResult ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(--spacing(60),1fr))] gap-4">
          {filteredStations.map((station) => {
            const { id, stationFields, cities, provincesOrStates, countries } =
              station;
            const {
              callLetters,
              frequency: rawFrequency,
              modulator,
              website,
            } = stationFields?.stationInfo || {};
            const [frequency, hd] = rawFrequency?.split(" ") || [];
            const isHD =
              hd?.toLowerCase() === "hd" ||
              modulator?.at(0)?.toLowerCase() === "fm2";
            const isUSA = countries?.nodes[0]?.name?.match(
              /united states( of america)?/i,
            );
            const { schedule } = stationFields || {};
            const startTimes = schedule
              ?.filter((v) => !!v)
              .map(({ startTimeUtc }) => {
                if (!startTimeUtc) return null;
                const d = new Date();
                const [hours, minutes, seconds] = startTimeUtc.split(":");

                d.setUTCHours(parseInt(hours, 10));
                d.setUTCMinutes(parseInt(minutes, 10));
                d.setUTCSeconds(parseInt(seconds, 10));
                d.setUTCMilliseconds(0);

                return d;
              });

            const locationParts = [
              cities?.nodes[0]?.name,
              convertRegion(provincesOrStates?.nodes[0]?.name || ""),
            ];

            if (!isUSA) {
              locationParts.push(countries?.nodes[0].name);
            }

            const location = locationParts
              .filter((v) => !!v?.trim())
              .join(", ");

            return (
              <Card
                className={cn(
                  "nth-of-type-[7n+2]:[--card:var(--color-red)]",
                  "nth-of-type-[7n+3]:[--card:var(--color-burnt-orange)]",
                  "nth-of-type-[7n+4]:[--card:var(--color-light-blue)]",
                  "nth-of-type-[7n+5]:[--card:var(--color-dark-green)]",
                  "nth-of-type-[7n+6]:[--card:var(--color-purple)]",
                  "nth-of-type-[7n+7]:[--card:var(--color-blue)]",
                  "after:hidden",
                  "*:data-[slot=bg-globe]:[&>svg]:h-[150%] *:data-[slot=bg-globe]:[&>svg]:top-auto *:data-[slot=bg-globe]:[&>svg]:bottom-0 *:data-[slot=bg-globe]:[&>svg]:translate-x-[33%] *:data-[slot=bg-globe]:[&>svg]:translate-y-[33%]",
                )}
                key={id}
              >
                {website && <CardLink href={website} />}
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="grow flex items-start gap-x-1">
                      <span className="text-5xl leading-none">{frequency}</span>
                      <span className="self-stretch flex flex-col justify-center text-md/[1]">
                        <span>{modulator}</span>
                        {isHD && <HdIcon className="size-6" />}
                      </span>
                    </span>
                    {!!startTimes?.length && (
                      <span className="flex flex-col gap-1 items-stretch">
                        {startTimes.map(
                          (time) =>
                            time && (
                              <Badge
                                className="w-full"
                                key={uniqueId(time.toDateString())}
                              >
                                <Time
                                  date={time}
                                  options={{
                                    hour: "numeric",
                                    minute: "2-digit",
                                  }}
                                />
                              </Badge>
                            ),
                        )}
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription className="flex flex-wrap justify-between items-center gap-2">
                    <span className="font-semibold">{callLetters}</span>
                    <span className="flex items-center gap-0.5">
                      <MapPinIcon className="size-[1.25em]" />
                      <span>{location}</span>
                    </span>
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <SearchAlertIcon />
            </EmptyMedia>
            <EmptyTitle>No Stations Found</EmptyTitle>
            <EmptyDescription>
              We were not able to find stations related to your search query.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </div>
  );
}

export default StationFinder;
