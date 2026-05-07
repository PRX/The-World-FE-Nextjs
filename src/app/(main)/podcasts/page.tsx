import React from "react";
import Image from "next/image";
import { unstable_cache } from "next/cache";
import { SearchAlertIcon } from "lucide-react";
import { HtmlContent } from "@/components/HtmlContent";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Separator } from "@/components/ui/separator";
import { getCtaRegionMessages, getShownMessage } from "@/lib/cta";
import fetchRssFeed from "@/lib/fetch/rss/fetchRssFeed";
import serviceAssetsMap from "@/lib/map/ServiceAssetsMap";
import { getServiceFromUrl } from "@/lib/parse/url";
import { cn } from "@/lib/util/css";
import CtaRegion from "@/app/(main)/_components/CtaRegion";
import type { Metadata, ResolvingMetadata } from "next";
import { convertSeoToMetadata } from "@/lib/parse/seo";

export const getCachedRssFeeds = unstable_cache(
  async (rssUrls: string[]) =>
    Promise.all(rssUrls.map((url) => fetchRssFeed(url))).then((res) =>
      res.filter((d) => !!d),
    ),
  ["podcasts"],
  {
    tags: ["podcasts"],
    revalidate: 60,
  },
);

export async function generateMetadata(
  _props: Record<string, string>,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const metadata = await parent.then((r) => r as Metadata);
  const seoTitle = "The World Podcasts";
  const description =
    "There are many ways to listen to The World, from podcasts, to smartspeakers, apps, and on our local public media broadcast. Find us every weekday wherever you choose to listen.";
  const link = "https://theworld.org/podcasts";
  const md = {
    canonical: link,
    title: seoTitle,
    metaDesc: description,
    opengraphTitle: seoTitle,
    opengraphDescription: description,
    opengraphUrl: link,
    twitterTitle: seoTitle,
    twitterDescription: description,
  };

  return convertSeoToMetadata(md, metadata) || {};
}

export default async function PodcastsPage() {
  const rssData = await getCachedRssFeeds([
    "https://latest-edition.feed.theworld.org/",
    "https://latest-stories.feed.theworld.org/",
    "https://publicfeeds.net/f/299/the-world-presents/feed-rss.xml",
  ]);

  const shownContentEndMessage = await getCtaRegionMessages(
    "podcasts-inline-end",
  ).then((messages) => getShownMessage(messages));

  return (
    <main className="mt-10 px-8 md:ml-(--gutter-left) md:mr-(--gutter-right)">
      {rssData?.length ? (
        <div className="grid gap-8 max-w-5xl mx-auto">
          {rssData.map(({ feedUrl, title, image, description, podcast }) => {
            const { links } = podcast?.follow?.data || {};
            const followLinks = [
              ...(links || []),
              { href: feedUrl, text: "RSS Feed", service: "rss" },
            ];
            const hasImage = !!image?.url;

            return (
              <React.Fragment key={feedUrl}>
                <section
                  className={cn("grid gap-8 items-center", {
                    "md:grid-cols-[--spacing(50)_1fr]": hasImage,
                  })}
                >
                  {hasImage && (
                    <Image
                      src={image.url}
                      alt={`Podcast logo for "${title}"`}
                      width={200}
                      height={200}
                      sizes="400px"
                      className="self-start"
                    />
                  )}
                  <div className="grid gap-2">
                    <h2 className="text-2xl/tight font-bold">{title}</h2>
                    {!!description?.trim().length && (
                      <HtmlContent html={description} />
                    )}
                    {!!followLinks?.length && (
                      <div className="flex flex-wrap gap-2 mt-4 pt-2 border-t border-t-muted">
                        {followLinks
                          ?.map((l) => ({
                            ...l,
                            service:
                              getServiceFromUrl(l.href) || l.service || null,
                          }))
                          .map(({ service, href, text }) => {
                            if (!service) return null;

                            const { IconComponent, label } =
                              serviceAssetsMap.get(service) || {};

                            return (
                              IconComponent && (
                                <a
                                  href={href}
                                  target="_blank"
                                  rel="noreferrer"
                                  key={`${service}:${href}`}
                                  className={cn(
                                    "p-1 bg-white/10 backdrop-blur-lg rounded-full corner-squircle",
                                    "hover:backdrop-brightness-125 focus-visible:backdrop-brightness-125",
                                  )}
                                >
                                  <IconComponent
                                    aria-label={`Listen on ${text || label}`}
                                    width={40}
                                    height={40}
                                  />
                                </a>
                              )
                            );
                          })}
                      </div>
                    )}
                  </div>
                </section>
                <Separator />
              </React.Fragment>
            );
          })}
        </div>
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <SearchAlertIcon />
            </EmptyMedia>
            <EmptyTitle>No Podcasts Found</EmptyTitle>
            <EmptyDescription>
              We are encountering issues retrieving information about our
              podcasts. Please check back shortly while we work to fix the
              issue.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}

      {shownContentEndMessage && (
        <div className="px-4 mt-20 ml-(--_gutter-left)">
          <CtaRegion cta={shownContentEndMessage} />
        </div>
      )}
    </main>
  );
}
