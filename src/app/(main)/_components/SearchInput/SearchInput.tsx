"use client";

import {
  type FocusEventHandler,
  type InputEventHandler,
  type KeyboardEventHandler,
  type SubmitEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type {
  ContentNode,
  Contributor,
  NodeWithFeaturedImage,
  NodeWithTitle,
  TermNode,
} from "@/interfaces";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  BookmarkIcon,
  BookOpenIcon,
  BoomBoxIcon,
  Building2Icon,
  CassetteTapeIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  Globe2Icon,
  HashIcon,
  LinkIcon,
  ScrollTextIcon,
  SearchIcon,
  UserIcon,
  XIcon,
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/util/css";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import Link from "next/link";
import { generateContentLinkHref } from "@/lib/routing";
import { Command, CommandGroup, CommandList } from "@/components/ui/command";
import Image from "next/image";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ContentSearchFiltersSchema } from "@/gen/search_filters_pb";
import type { MessageInitShape } from "@bufbuild/protobuf";
import { encodeContentSearchFiltersParam } from "@/lib/util/binaryData";

export type SearchContext = {
  /**
   * Label to use in the context switcher select input.
   */
  label: string;
  /**
   * API endpoint for autocomplete query.
   * Endpoint should expect a `search` parameter and return an object with `contentNodes` and `terms` results.
   * Results should be ordered by relevance, eg. just the `search` argument.
   * See `/api/search/route.ts`
   */
  fetchEndpoint?: string;
  fetchSearchFilters?: MessageInitShape<typeof ContentSearchFiltersSchema>;
};

export type SearchInputProps = React.ComponentProps<"form"> & {
  searchContext?: SearchContext;
};

export default function SearchInput({
  className,
  searchContext,
  ...props
}: SearchInputProps) {
  const router = useRouter();
  const pathname = usePathname();
  const abortController = useRef<AbortController>(null);
  const [forceLoad, setForceLoad] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<{
    contentNodes?: (Node &
      ContentNode &
      NodeWithTitle &
      NodeWithFeaturedImage)[];
    terms?: (TermNode & Contributor)[];
  }>({});
  const searchParams = useSearchParams();
  const searchParam = searchParams.get("search");
  const [searchInput, setSearchInput] = useState(searchParam || undefined);
  const [inContextSearch, setInContextSearch] = useState(!!searchContext);
  const searchPathname = inContextSearch ? pathname : "/explore";
  const fetchEndpoint =
    (inContextSearch && searchContext?.fetchEndpoint) || "search";

  const hasData = !!(data.contentNodes?.length || data.terms?.length);

  const updateRoute = useCallback(() => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    if (!searchInput) return;

    newSearchParams.set("search", searchInput);
    router.push(`${searchPathname}?${newSearchParams.toString()}`, {
      scroll: true,
    });
  }, [searchPathname, router.push, searchInput, searchParams.toString]);

  const handleInput: InputEventHandler<HTMLInputElement> = useCallback((e) => {
    setSearchInput(e.currentTarget.value);
  }, []);

  const handleFocus: FocusEventHandler<HTMLInputElement> = useCallback(() => {
    if (!hasData && searchInput) {
      setForceLoad(true);
    }
  }, [hasData, searchInput]);

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      if (e.key === "Enter") {
        if (!searchInput) return;

        e.currentTarget.blur();
        abortController.current?.abort();
        setIsLoading(false);

        updateRoute();
      }
    },
    [searchInput, updateRoute],
  );

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = useCallback(
    (e) => {
      e.preventDefault();

      if (!searchInput) return;

      abortController.current?.abort();
      setIsLoading(false);

      updateRoute();
    },
    [searchInput, updateRoute],
  );

  useEffect(() => {
    if (forceLoad) {
      setForceLoad(false);
    }

    if (!searchInput) {
      setIsLoading(false);
      setData({});
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setData({});

      abortController.current?.abort();

      abortController.current = new AbortController();

      try {
        const searchParams = new URLSearchParams();

        searchParams.set("search", searchInput || "");

        if (inContextSearch && searchContext?.fetchSearchFilters) {
          searchParams.set(
            "sf",
            encodeContentSearchFiltersParam(searchContext.fetchSearchFilters),
          );
        }

        const data = await fetch(
          `/api/${fetchEndpoint}?${searchParams.toString()}`,
          {
            signal: abortController.current.signal,
          },
        ).then((res) => res.ok && res.json());
        setData(data || {});
        setIsLoading(false);
      } catch (error) {
        if (error instanceof DOMException && error.name !== "AbortError") {
          setIsLoading(false);
        }
      }
    };

    const timeoutId = setTimeout(fetchData, 300);

    return () => {
      clearTimeout(timeoutId);
      abortController.current?.abort();
    };
  }, [searchInput, forceLoad, fetchEndpoint, searchContext, inContextSearch]);

  return (
    <form
      id="site-search"
      method="GET"
      action={searchPathname}
      onSubmit={handleSubmit}
      autoComplete="off"
      className={cn("max-sm:hidden", className)}
      {...props}
    >
      <Command
        shouldFilter={false}
        className={cn(
          "@container/search-input",
          "relative bg-transparent overflow-visible",
          "*:data-[slot=command-list]:hidden",
          "**:[[cmdk-group-heading]]:font-light",
          { "focus-within:*:data-[slot=command-list]:block": hasData },
        )}
      >
        <InputGroup className="p-0 rounded-full backdrop-blur-xl backdrop-brightness-110">
          <InputGroupInput
            name="search"
            placeholder="Search..."
            value={searchInput}
            className="rounded-full w-full"
            onInput={handleInput}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
          />
          <InputGroupAddon
            align="inline-end"
            className={cn("p-0 px-1 has-[>button]:mr-0", {
              invisible: !searchInput && !isLoading,
            })}
          >
            <InputGroupButton
              className="rounded-full cursor-pointer"
              size="icon-xs"
              disabled={!searchInput}
              onClick={() => {
                setSearchInput("");
                setData({});
              }}
            >
              {isLoading ? (
                <Spinner />
              ) : (
                <XIcon className="size-5" aria-label="Clear Search" />
              )}
            </InputGroupButton>
          </InputGroupAddon>
          {searchContext && (
            <InputGroupAddon align="inline-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <InputGroupButton
                    variant="outline"
                    className="rounded-full w-min max-w-[45cqw]"
                  >
                    <span className="overflow-hidden text-ellipsis">
                      {inContextSearch ? searchContext.label : "The Site"}
                    </span>
                    <ChevronDownIcon className="size-3" />
                  </InputGroupButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-input backdrop-blur-xl translate-x-1.25 z-10 rounded-t-none"
                >
                  <DropdownMenuRadioGroup
                    value={inContextSearch ? "context" : "site"}
                    onValueChange={(cxtName) => {
                      setInContextSearch(cxtName === "context");
                    }}
                  >
                    <DropdownMenuRadioItem value="site">
                      The Site
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="context">
                      {searchContext.label}
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </InputGroupAddon>
          )}
          <InputGroupAddon
            align="inline-end"
            className="p-0 has-[>button]:mr-0"
          >
            <InputGroupButton
              type="submit"
              className="rounded-r-full bg-border size-8.5 cursor-pointer"
              size="icon-sm"
            >
              <SearchIcon className="size-5" aria-label="Submit Search" />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>

        <CommandList
          className={cn(
            "absolute inset-0 bottom-auto -z-1 max-h-[max(300px,60vh)] pt-12 rounded-t-3xl rounded-b-md no-scrollbar",
            "bg-navy-blue/80 backdrop-blur-lg shadow-2xl",
            {
              hidden: !hasData,
            },
          )}
        >
          {!!data.contentNodes?.length && (
            <CommandGroup>
              {data.contentNodes.map((n) => {
                const { contentTypeName, id, title, link, featuredImage } = n;
                const linkHref = generateContentLinkHref(link);
                const Icon =
                  new Map([
                    ["post", BookOpenIcon],
                    ["episode", BoomBoxIcon],
                    ["segment", CassetteTapeIcon],
                    ["page", ScrollTextIcon],
                  ]).get(contentTypeName) || LinkIcon;
                const imgSrc =
                  featuredImage?.node.sourceUrl ||
                  featuredImage?.node.mediaItemUrl;
                const altText =
                  featuredImage?.node.altText || `Thumbnail for "${title}"`;
                return (
                  !!linkHref && (
                    <Item className="p-3" asChild key={id}>
                      <Link href={linkHref}>
                        <ItemMedia
                          variant={imgSrc ? "image" : "icon"}
                          className="size-10"
                        >
                          {imgSrc ? (
                            <Image
                              src={imgSrc}
                              alt={altText}
                              sizes="120px"
                              width={32}
                              height={32}
                              className="object-cover"
                            />
                          ) : (
                            <Icon className="size-6" />
                          )}
                        </ItemMedia>
                        <ItemContent>
                          <ItemTitle className="line-clamp-2">
                            {title}
                          </ItemTitle>
                        </ItemContent>
                        <ItemActions>
                          <ChevronRightIcon className="size-5 text-accent" />
                        </ItemActions>
                      </Link>
                    </Item>
                  )
                );
              })}
            </CommandGroup>
          )}
          {!!data.terms?.length && (
            <CommandGroup
              heading={
                data.contentNodes?.length
                  ? "Contributors and Taxonomies"
                  : undefined
              }
            >
              {data.terms.map((n) => {
                const { taxonomyName, link, count, name, contributorDetails } =
                  n;
                const Icon =
                  new Map([
                    ["city", Building2Icon],
                    ["contributor", UserIcon],
                    ["continent", Globe2Icon],
                    ["country", Globe2Icon],
                    ["region", Globe2Icon],
                    ["province_or_state", Globe2Icon],
                    ["person", UserIcon],
                    ["social_tags", HashIcon],
                  ]).get(taxonomyName || "") || BookmarkIcon;
                const linkHref = generateContentLinkHref(link);
                const { image } = contributorDetails || {};
                const imgSrc = image?.sourceUrl || image?.mediaItemUrl;
                const altText = image?.altText || `Thumbnail for "${name}"`;
                const countString = count?.toLocaleString(undefined, {
                  notation: "compact",
                });
                const info = [
                  count && (count > 1 ? `${countString} posts` : "1 post"),
                ].filter((v) => !!v);
                return (
                  !!linkHref && (
                    <Item className="p-3" asChild key={n.id}>
                      <Link href={linkHref}>
                        <ItemMedia
                          variant={!imgSrc ? "icon" : undefined}
                          className="size-10"
                        >
                          {imgSrc ? (
                            <Avatar className="size-10">
                              <AvatarImage
                                src={imgSrc}
                                alt={altText}
                                sizes="120px"
                              />
                            </Avatar>
                          ) : (
                            <Icon className="size-6" />
                          )}
                        </ItemMedia>
                        <ItemContent>
                          <ItemTitle>{name}</ItemTitle>
                          {!!info.length && (
                            <ItemDescription className="text-sm/none font-light [&>*+*]:before:content-['\2022'] [&>*+*]:before:mx-1">
                              {info.map((v) => (
                                <span key={v}>{v}</span>
                              ))}
                            </ItemDescription>
                          )}
                        </ItemContent>
                        <ItemActions>
                          <ChevronRightIcon className="size-5 text-accent" />
                        </ItemActions>
                      </Link>
                    </Item>
                  )
                );
              })}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </form>
  );
}
