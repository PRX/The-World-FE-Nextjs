import type { Metadata, ResolvingMetadata } from "next";
import { unstable_cache } from "next/cache";
import { notFound, permanentRedirect, redirect } from "next/navigation";
import CtaRegion from "@/app/(main)/_components/CtaRegion";
import { HtmlContent } from "@/components/HtmlContent";
import { PageIdType } from "@/interfaces";
import { getCtaRegionMessages, getShownMessage } from "@/lib/cta";
import { fetchGqlPage, fetchTwApiQueryAlias } from "@/lib/fetch";
import { convertSeoToMetadata } from "@/lib/parse/seo";

type Props = {
  params: Promise<{ alias: string[] }>;
};

const rgxFileExt = /\.\w+$/;

export const getCachedAliasData = unstable_cache(
  async (alias) => fetchTwApiQueryAlias(alias),
  ["alias"],
  {
    tags: ["page", "alias"],
    revalidate: 60,
  },
);

export const getCachedPage = unstable_cache(
  async (id) => fetchGqlPage(id, PageIdType.Id),
  ["page"],
  {
    tags: ["page", "content"],
    revalidate: 60,
  },
);

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const metadata = await parent.then((r) => r as Metadata);
  const { alias = [] } = await params;
  const aliasPath = alias.join("/");

  if (rgxFileExt.test(aliasPath)) {
    return notFound();
  }

  const aliasData = await getCachedAliasData(aliasPath);

  if (!aliasData || aliasData.type !== "post--page") {
    return notFound();
  }

  const data = await getCachedPage(aliasData.id);

  if (!data) {
    return notFound();
  }

  const { seo } = data;

  // console.log("PAGE SEO", seo);

  return convertSeoToMetadata(seo, metadata) || {};
}

export default async function PagePage({ params }: Props) {
  const { alias = [] } = await params;
  const aliasPath = alias.join("/");

  if (rgxFileExt.test(aliasPath)) {
    return notFound();
  }

  const aliasData = await getCachedAliasData(aliasPath);
  let resourceType: string | undefined = "homepage";
  let resourceId: string | undefined;
  let redirectOptions: { permanent: boolean; path: string } | undefined;

  if (!aliasData) {
    return notFound();
  }

  // Update resource id and type.
  if (aliasData.redirectUrl) {
    redirectOptions = {
      permanent: aliasData.type === "redirect--internal",
      path: aliasData.redirectUrl,
    };
  } else if (aliasData?.id) {
    const { id, type } = aliasData;
    resourceId = id;
    resourceType = type;
  } else {
    resourceType = undefined;
  }

  // Handle redirect url.
  if (redirectOptions) {
    if (redirectOptions.permanent) {
      permanentRedirect(redirectOptions.path);
    } else {
      redirect(redirectOptions.path);
    }
  }

  if (resourceType !== "post--page") {
    return notFound();
  }

  const data = await getCachedPage(resourceId);

  if (!data) {
    return notFound();
  }

  const { content } = data;

  const shownContentEndMessage = await getCtaRegionMessages(
    "content-inline-end",
  ).then((messages) => getShownMessage(messages));

  return (
    <div className="group/episode">
      <div className="ml-(--gutter-left) mr-(--gutter-right)">
        <div className="max-w-185 mx-auto my-12 px-4">
          <HtmlContent html={content} />
        </div>

        {shownContentEndMessage && (
          <div className="px-4">
            <CtaRegion cta={shownContentEndMessage} />
          </div>
        )}
      </div>
    </div>
  );
}
