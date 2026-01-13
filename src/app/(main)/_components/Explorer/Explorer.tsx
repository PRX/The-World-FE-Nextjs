import type { ContentTypeEnum, TaxonomyEnum } from "@/interfaces";
import { uniqueId } from "lodash";
import {
  BookmarkIcon,
  BookOpenIcon,
  BoomBoxIcon,
  CalendarIcon,
  CassetteTapeIcon,
  EarthIcon,
  TypeIcon,
  UserIcon,
  XIcon,
} from "lucide-react";
import { decode } from "base-64";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import ExplorerClearFilterButton from "./ExplorerClearFilterButton";

type FilterValueConfig = { value: string; displayValue: string };
type FilterValue = string | FilterValueConfig | Date;

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
  FilterValue
> & {
  year: string;
  month: string;
  date: FilterValue;
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
  value: FilterValue;
  format?(v: FilterValue): string;
  hidden?: boolean;
  icon?: React.JSX.Element;
  render?(v: string): React.JSX.Element | null;
};

const typeIconMap = new Map<string, React.JSX.Element>();
typeIconMap.set("episode", <BoomBoxIcon />);
typeIconMap.set("segment", <CassetteTapeIcon />);
typeIconMap.set("post", <BookOpenIcon />);

const filterConfigMap = new Map<string, Partial<FilterConfig>>([
  [
    "type",
    {
      priority: 0,
      param: "type",
      label: "Content Type",
    },
  ],
  [
    "searchText",
    {
      priority: 0.1,
      param: "search",
      label: "Search Text",
      icon: <TypeIcon />,
      render: (v) => <>"{v}"</>,
    },
  ],
  [
    "date",
    {
      priority: 1,
      param: "date",
      label: "Date",
      icon: <CalendarIcon />,
      format: (date: Date) => {
        const d = typeof date === "string" ? new Date(date) : date;

        return d.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      },
    },
  ],
  [
    "year",
    {
      priority: 1.1,
      param: "year",
      label: "Year",
      icon: <CalendarIcon />,
      format: (year: string) => {
        const d = new Date(`${year}/01`);

        return d.toLocaleDateString("en-US", {
          year: "numeric",
        });
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
      format: (month: string) => {
        const d = new Date(`2000/${month}`);

        return d.toLocaleDateString("en-US", {
          month: "long",
        });
      },
    },
  ],
  [
    "category",
    {
      priority: 2,
      param: "category",
      label: "Category",
      icon: <BookmarkIcon />,
    },
  ],
  [
    "tag",
    {
      priority: 2.1,
      param: "tag",
      label: "Tag",
      icon: <BookmarkIcon />,
    },
  ],
  [
    "socialtag",
    {
      priority: 2.2,
      param: "socialtag",
      label: "Social Tag",
      icon: <BookmarkIcon />,
    },
  ],
  [
    "contributor",
    {
      priority: 3,
      param: "contributor",
      label: "Contributor",
      icon: <UserIcon />,
    },
  ],
  [
    "continent",
    {
      priority: 4,
      param: "continent",
      label: "Continent",
      icon: <EarthIcon />,
    },
  ],
  [
    "region",
    {
      priority: 4.1,
      param: "region",
      label: "Region",
      icon: <EarthIcon />,
    },
  ],
  [
    "country",
    {
      priority: 4.2,
      param: "country",
      label: "Country",
      icon: <EarthIcon />,
    },
  ],
  [
    "provinceorstate",
    {
      priority: 4.3,
      param: "provinceorstate",
      label: "Province/State",
      icon: <EarthIcon />,
    },
  ],
  [
    "city",
    {
      priority: 4.4,
      param: "city",
      label: "City",
      icon: <EarthIcon />,
    },
  ],
  [
    "person",
    {
      priority: 5,
      param: "person",
      label: "Person",
      icon: <UserIcon />,
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
        const c = {
          ...config,
          value,
          hidden: true,
        } as FilterConfig;

        filterConfigMap.set(k, c);

        return c;
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
        const c = {
          ...config,
          value,
        } as FilterConfig;

        if (k === "type") {
          c.icon = typeIconMap.get(k);
        }

        filterConfigMap.set(k, c);

        return c;
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
            const { param, icon, label, render, value, format } = config;
            const v =
              typeof value === "string" || value instanceof Date
                ? value
                : value.displayValue;
            const displayValue = format
              ? format(value)
              : (typeof v === "string" && v) ||
                v.toLocaleString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                });

            return (
              displayValue && (
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
                  <ExplorerClearFilterButton
                    param={param}
                    className="absolute inset-0 left-auto p-0 w-5 h-auto rounded-full hover:bg-current/20 hover:text-current"
                    variant="ghost"
                    size="icon-sm"
                    title={`Remove ${label} Filter`}
                  >
                    <XIcon className="size-3" />
                  </ExplorerClearFilterButton>
                </Badge>
              )
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
