import { notFound } from "next/navigation";
import { getCachedStory } from "./page";
import { createMetaImage } from "@/app/(main)/_metadata";

type Props = {
  params: Promise<{ slug: string }>;
};

// Image metadata
export const alt = "Story Image";
export const size = {
  width: 1200,
  height: 675,
};
export const contentType = "image/png";

export default async function Image({ params }: Props) {
  const slug = (await params).slug;

  // fetch post information
  const data = await getCachedStory(slug);

  if (!data) {
    return notFound();
  }

  const { title, featuredImage } = data;

  return createMetaImage({
    size,
    title,
    image: featuredImage?.node,
  });
}
