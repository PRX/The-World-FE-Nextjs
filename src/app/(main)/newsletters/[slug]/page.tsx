import type { Metadata, ResolvingMetadata } from "next";
import { cache } from "react";
import { NewsletterIdType } from "@/interfaces";
import { fetchGqlNewsletter } from "@/lib/fetch";
import { notFound } from "next/navigation";
import { Plausible, type PlausibleEventArgs } from "@/components/Plausible";
import { getCtaRegionMessages, getShownMessage } from "@/lib/cta";
import CtaRegion from "@/app/(main)/_components/CtaRegion";
import ContentBody from "@/app/(main)/_components/ContentBody";
import { convertSeoToMetadata } from "@/lib/parse/seo";

type Props = {
  params: Promise<{ slug: string }>;
};

export const getCachedNewsletter = cache(async (slug: string) =>
  fetchGqlNewsletter(slug, NewsletterIdType.Slug),
);

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const slug = (await params).slug;
  const metadata = await parent.then((r) => r as Metadata);

  // fetch post information
  const data = await getCachedNewsletter(slug);

  if (!data) {
    return notFound();
  }

  const { title, excerpt, seo, link } = data;
  const seoTitle = `${title} Newsletter Signup`;
  const description = excerpt?.replace(/<[^>]+>/g, "");
  const md = seo || {
    canonical: link,
    title: seoTitle,
    metaDesc: description,
    opengraphTitle: seoTitle,
    opengraphDescription: description,
    opengraphUrl: link,
    twitterTitle: seoTitle,
    twitterDescription: description,
  };

  // console.log("NEWSLETTER SEO", seo);

  return convertSeoToMetadata(md, metadata) || {};
}

export default async function NewslettersPage({ params }: Props) {
  const { slug } = await params;
  const data = await getCachedNewsletter(slug);

  if (!data) {
    return notFound();
  }

  const { id, title, content } = data;
  const props = {
    Title: title,
  };
  const plausibleEvents = [["Newsletter", { props }] as PlausibleEventArgs];

  const shownContentEndMessage = await getCtaRegionMessages(
    "content-inline-end",
    {
      ...(id && { id }),
    },
  ).then((messages) => getShownMessage(messages));

  return (
    <div className="group/content ml-(--gutter-left) mr-(--gutter-right) px-8">
      <Plausible events={plausibleEvents} key={id} />

      {content && (
        <div className="relative ps-(--gutter-left)">
          <ContentBody html={content} className="text-xl/snug">
            {shownContentEndMessage && (
              <div className="flex flex-col gap-y-10 w-full max-w-185 mx-auto">
                <CtaRegion
                  className="-mx-[calc(var(--body-gutter)/2)] lg:-mx-(--body-gutter)"
                  cta={shownContentEndMessage}
                />
              </div>
            )}
          </ContentBody>
        </div>
      )}

      {!content && shownContentEndMessage && (
        <CtaRegion className="mx-auto" cta={shownContentEndMessage} />
      )}
    </div>
  );
}
