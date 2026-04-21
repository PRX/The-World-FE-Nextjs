import NewsletterCta from "@/app/(main)/_components/CtaRegion/_components/NewsletterCta";
import HeroHeader from "@/app/(main)/_components/HeroHeader";
import { getCachedNewsletter } from "@/app/(main)/newsletters/[slug]/page";
import { HtmlContent } from "@/components/HtmlContent";
import { parseNewsletterOptions } from "@/lib/parse/cta";

export default async function NewslettersHero({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getCachedNewsletter(slug);

  if (!data) {
    return null;
  }

  const { id, title, featuredImage, excerpt, content } = data;
  const newsletterOptions = parseNewsletterOptions(data, slug);
  const image = featuredImage?.node;
  const isExcerptFromContent =
    excerpt
      ?.replace(/<[^>]+>/g, "")
      .trim()
      .substring(0, 100) ===
    content
      ?.replace(/<[^>]+>/g, "")
      .trim()
      .substring(0, 100);

  return (
    <HeroHeader image={image}>
      <h1 className="capitalize text-3xl md:text-4xl font-bold text-balance">
        {title}
      </h1>
      <div className="flex @max-xl/hero-content:flex-wrap content-start gap-x-12 gap-y-2">
        <div className="grow flex flex-col gap-y-4">
          {excerpt && !isExcerptFromContent && (
            <HtmlContent html={excerpt} className="text-xl/snug" />
          )}
          <NewsletterCta
            cta={{ id, type: "newsletter", hash: "", newsletterOptions }}
          />
        </div>
      </div>
    </HeroHeader>
  );
}
