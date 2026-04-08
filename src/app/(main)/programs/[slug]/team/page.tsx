import type { Program } from "@/interfaces";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getCachedProgram } from "../page";
import Explorer from "@/app/(main)/_components/Explorer";
import {
  Card,
  CardDescription,
  CardHeader,
  CardImage,
  CardLink,
  CardTitle,
} from "@/components/ui/card";
import { generateContentLinkHref } from "@/lib/routing";
import { cn } from "@/lib/util/css";
import { sanitizeUrl } from "@/lib/parse/url";
import { getCtaRegionMessages, getShownMessage } from "@/lib/cta";
import CtaRegion from "@/app/(main)/_components/CtaRegion";

export default async function TaxonomyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let data: Program | undefined;

  if (slug) {
    data = await getCachedProgram(slug);

    if (!data?.programContributors?.team?.length) return notFound();
  }

  const { programContributors } = data || {};
  const { team } = programContributors || {};

  const shownContentEndMessage = await getCtaRegionMessages(
    "landing-inline-end",
  ).then((messages) => getShownMessage(messages));

  return (
    <div className="mt-10 px-8 md:ml-(--gutter-left) md:mr-(--gutter-right)">
      <Explorer pageInfo={{ hasNextPage: false, hasPreviousPage: false }}>
        {team
          ?.filter((n) => !!n)
          .map((node, index) => {
            const { id, name, link, contributorDetails } = node;
            const { image, position } = contributorDetails || {};
            const linkHref = generateContentLinkHref(link);
            const imageSrc = image?.sourceUrl || image?.mediaItemUrl;

            return (
              <Card className={cn("aspect-2/3")} key={id}>
                {linkHref && <CardLink href={linkHref} />}
                {imageSrc && (
                  <CardImage data-image-id={image.id}>
                    <Image
                      src={sanitizeUrl(imageSrc)}
                      alt={image?.altText || ""}
                      fill
                      sizes={`(min-width: 768px) 800px, 200vw`}
                      style={{
                        objectFit: "cover",
                      }}
                      loading={index <= 12 ? "eager" : "lazy"}
                    />
                  </CardImage>
                )}
                <CardHeader>
                  <CardTitle>{name}</CardTitle>
                  <CardDescription>
                    <div className="flex items-center text-md [&>*+*]:before:content-['\2022'] [&>*+*]:before:mx-2">
                      <span>{position}</span>
                    </div>
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
      </Explorer>

      {shownContentEndMessage && (
        <div className="px-4">
          <CtaRegion cta={shownContentEndMessage} />
        </div>
      )}
    </div>
  );
}
