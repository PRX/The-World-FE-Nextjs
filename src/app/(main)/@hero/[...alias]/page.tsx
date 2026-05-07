import {
  getCachedAliasData,
  getCachedPage,
} from "@/app/(main)/[...alias]/page";
import HeroHeader from "@/app/(main)/_components/HeroHeader";
import { ColorSchemeSwitcher } from "../../_components/ColorSchemeSwitcher";

export default async function PageHero({
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
      <div className="flex flex-wrap gap-4 items-end text-pretty">
        <h1 className="grow text-3xl md:text-4xl font-bold text-balance">
          <span>{title}</span>
        </h1>
        <ColorSchemeSwitcher />
      </div>
    </HeroHeader>
  );
}
