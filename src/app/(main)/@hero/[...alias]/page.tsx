import {
  getCachedAliasData,
  getCachedPage,
} from "@/app/(main)/[...alias]/page";
import HeroHeader from "@/app/(main)/_components/HeroHeader";

export default async function PagePage({
  params,
}: {
  params: Promise<{ alias: string[] }>;
}) {
  const { alias = [] } = await params;
  const aliasPath = alias.join("/");
  const rgxFileExt = /\.\w+$/;

  if (rgxFileExt.test(aliasPath)) {
    return null;
  }

  const aliasData = await getCachedAliasData(aliasPath);
  let resourceType: string | undefined = "homepage";
  let resourceId: string | undefined;

  if (!aliasData) {
    return null;
  }

  // Update resource id and type.
  if (aliasData?.id) {
    const { id, type } = aliasData;
    resourceId = id;
    resourceType = type;
  } else {
    resourceType = undefined;
  }

  if (resourceType !== "post--page") {
    return null;
  }

  const data = await getCachedPage(resourceId);

  if (!data) {
    return null;
  }

  const { title, featuredImage } = data;

  return (
    <HeroHeader
      image={featuredImage?.node}
      classes={{ content: "max-w-3xl w-full px-8" }}
    >
      <div className="grid gap-y-4 text-pretty">
        <h1 className="flex gap-4 items-center capitalize text-3xl md:text-4xl font-bold text-balance">
          {title}
        </h1>
      </div>
    </HeroHeader>
  );
}
