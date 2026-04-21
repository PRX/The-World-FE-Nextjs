import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { NewsletterIdType } from "@/interfaces";
import { fetchGqlNewsletter } from "@/lib/fetch";
import { notFound } from "next/navigation";
import { Plausible, type PlausibleEventArgs } from "@/components/Plausible";
import { getCtaRegionMessages, getShownMessage } from "@/lib/cta";
import CtaRegion from "@/app/(main)/_components/CtaRegion";
import ContentBody from "@/app/(main)/_components/ContentBody";

type Props = {
  params: Promise<{ slug: string }>;
};

export const getCachedNewsletter = unstable_cache(
  async (slug) => fetchGqlNewsletter(slug, NewsletterIdType.Slug),
  ["newsletter"],
  {
    tags: ["newsletter"],
    revalidate: 60,
  },
);

export async function generateMetadata(
  { params }: Props,
  // parent: ResolvingMetadata,
): Promise<Metadata> {
  const slug = (await params).slug;

  // fetch post information
  const data = await getCachedNewsletter(slug);

  if (!data) {
    return notFound();
  }

  const { title, excerpt, seo } = data;

  // console.log(seo);

  return {
    ...seo, // TODO: Create util to convert seo data to Nextjs Metadata.
    title: `${title} Newsletter Signup - The World from PRX`,
    description: excerpt?.replace(/<[^>]+>/g, ""),
  };
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
