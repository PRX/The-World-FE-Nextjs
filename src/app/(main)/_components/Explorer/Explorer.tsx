import type { ContentTypeEnum, TaxonomyEnum } from "@/interfaces";
import { uniqueId } from "lodash";
import { CalendarIcon, TypeIcon, XIcon } from "lucide-react";
import { decode } from "base-64";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type FilterOptions = Record<
  Lowercase<
    keyof Omit<
      typeof TaxonomyEnum,
      | "Ctaregiontype"
      | "License"
      | "Postformat"
      | "Resourcedevelopmenttag"
      | "Storyformat"
    >
  >,
  string
> & {
  date: Record<"after" | "before", string | Date>;
  type: Lowercase<
    keyof Pick<typeof ContentTypeEnum, "Post" | "Episode" | "Segment">
  >;
};

export type ExplorerParams = Partial<FilterOptions> & {
  className?: string;
  searchParams?: Partial<Record<"search" | "sf", string | string[]>>;
};

export type FilterConfig = {
  priority: number;
  param: string;
  label: string;
  value: string | { value: string; displayValue: string };
  displayValue?: string;
  hidden?: boolean;
  icon?: React.JSX.Element;
  render?(value: string): React.JSX.Element;
};

const filterConfigMap = new Map<string, Partial<FilterConfig>>([
  [
    "searchText",
    {
      priority: 0,
      param: "search",
      label: "Search Text",
      icon: <TypeIcon />,
      render: (v) => <>"{v}"</>,
    },
  ],
  [
    "year",
    {
      priority: 1.1,
      param: "year",
      label: "Year",
      icon: <CalendarIcon />,
      render: (v) => {
        const date = new Date(`${v}/01`);
        return <>{date.toLocaleDateString(undefined, { year: "numeric" })}</>;
      },
    },
  ],
  [
    "month",
    {
      priority: 1.2,
      param: "month",
      label: "Month",
      icon: <CalendarIcon />,
      render: (v) => {
        const date = new Date(`2000/${v}`);
        return <>{date.toLocaleDateString(undefined, { month: "long" })}</>;
      },
    },
  ],
  [
    "day",
    {
      priority: 1.3,
      param: "day",
      label: "Day",
      icon: <CalendarIcon />,
      render: (v) => {
        const date = new Date(`2000/01/${v}`);
        return <>{date.toLocaleDateString(undefined, { day: "numeric" })}</>;
      },
    },
  ],
]);

export default async function Explorer(params: Partial<ExplorerParams>) {
  const { className, searchParams, ...hiddenFilters } = params;
  const { search, sf } = searchParams || {};
  const searchText = Array.isArray(search) ? search.join(" ") : search?.trim();
  const searchFilters = {
    ...(searchText && { searchText }),
    ...((sf &&
      (JSON.parse(decode(Array.isArray(sf) ? sf[0] : sf)) as FilterOptions)) ||
      {}),
  };
  // TODO: Fetch term data for taxonomy filters so term names can be shown instead of slugs.
  const filters: FilterConfig[] = [
    // Prepare hidden filter values.
    // These params come from the component and should not be mutable.
    // Landing page routes will use this to constrain filter options to what is
    // provided in the route params.
    ...Object.entries(hiddenFilters)
      .map(([k, value]) => {
        const config = filterConfigMap.get(k);
        if (!config) return null;
        return {
          ...config,
          value,
          hidden: true,
        } as FilterConfig;
      })
      .filter((v) => !!v)
      .sort((a, b) => a.priority - b.priority),

    // Prepare search filter values.
    // These params come from the URL query string.
    // There values should be mutable by filter options inputs.
    ...Object.entries(searchFilters)
      // Remove any search filters that should be hidden.
      .filter(([k]) => !Object.hasOwn(hiddenFilters, k))
      .map(([k, value]) => {
        const config = filterConfigMap.get(k);
        if (!config) return null;
        return {
          ...config,
          value,
        } as FilterConfig;
      })
      .filter((v) => !!v)
      .sort((a, b) => a.priority - b.priority),
  ];
  const mutableFilters = filters.filter(({ hidden }) => !hidden);
  const hasMutableFilters = !!mutableFilters.length;

  // TODO: Query content and taxonomy params' info.

  return (
    <div className={cn("grid gap-3 px-8", className)}>
      {hasMutableFilters && (
        <div className="flex flex-wrap items-center gap-2">
          {mutableFilters.map((config) => {
            const { param, icon, label, render, value } = config;
            const { displayValue } =
              typeof value === "string" ? { displayValue: value } : value;
            return (
              <Badge
                className="relative pe-6"
                variant="secondary"
                aria-label={label}
                key={param}
              >
                {icon}
                <span className="-mb-0.5">
                  {render ? render(displayValue) : displayValue}
                </span>
                <Button
                  className="absolute inset-0 left-auto p-0 w-5 h-auto rounded-full hover:bg-current/20 hover:text-current"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Remove ${label} Filter`}
                >
                  <XIcon className="size-3" />
                </Button>
              </Badge>
            );
          })}
        </div>
      )}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(var(--spacing)*100,100%),1fr))] gap-4">
        {new Array(30).fill(null).map(() => (
          <div
            className="grid aspect-[4/5] bg-white/10 rounded-md"
            key={uniqueId()}
          ></div>
        ))}
      </div>
    </div>
  );
}
