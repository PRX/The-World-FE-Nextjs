import type { Contributor, Program } from "@/interfaces";
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
import type { Metadata, ResolvingMetadata } from "next";
import { convertSeoToMetadata } from "@/lib/parse/seo";
import { Plausible, type PlausibleEventArgs } from "@/components/Plausible";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const slug = (await params).slug;
  const metadata = await parent.then((r) => r as Metadata);

  // fetch post information
  const data = await getCachedProgram(slug);

  if (!data) {
    return notFound();
  }

  const { name, description, seo, link } = data;
  const seoTitle = `${name} Team`;
  const seoLink = `${link}/team`;
  const md = seo || {
    canonical: seoLink,
    title: seoTitle,
    metaDesc: description,
    opengraphTitle: seoTitle,
    opengraphDescription: description,
    opengraphUrl: seoLink,
    twitterTitle: seoTitle,
    twitterDescription: description,
  };

  // console.log("PROGRAM TEAM SEO", seo);

  return convertSeoToMetadata(md, metadata) || {};
}

export default async function TaxonomyPage({ params }: Props) {
  const { slug } = await params;
  let data: Program | undefined;

  if (slug) {
    data = await getCachedProgram(slug);

    if (!data?.programContributors?.team?.nodes?.length) return notFound();
  }

  const { id, name, programContributors } = data || {};
  const { team } = programContributors || {};
  const props = {
    Title: `${name} Team`,
  };
  const plausibleEvents = [["Team", { props }] as PlausibleEventArgs];

  const shownContentEndMessage = await getCtaRegionMessages(
    "landing-inline-end",
  ).then((messages) => getShownMessage(messages));

  return (
    <div className="mt-10 px-8 md:ml-(--gutter-left) md:mr-(--gutter-right)">
      <Plausible events={plausibleEvents} key={id} />
      <Explorer pageInfo={{ hasNextPage: false, hasPreviousPage: false }}>
        {(team?.nodes as Contributor[])
          ?.filter((n) => !!n)
          .map((node, index) => {
            const { id, name, link, contributorDetails } = node;
            const { image, position } = contributorDetails || {};
            const linkHref = generateContentLinkHref(link);
            const imageSrc =
              image?.node?.sourceUrl || image?.node?.mediaItemUrl;

            return (
              <Card className={cn("aspect-2/3")} key={id}>
                {linkHref && <CardLink href={linkHref} aria-label={name ?? undefined} />}
                {imageSrc && (
                  <CardImage data-image-id={image.node.id}>
                    <Image
                      src={sanitizeUrl(imageSrc)}
                      alt={image.node.altText || ""}
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
