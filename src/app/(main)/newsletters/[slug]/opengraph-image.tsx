import { notFound } from "next/navigation";
import { getCachedNewsletter } from "./page";
import { createMetaImage } from "@/app/(main)/_metadata";

type Props = {
  params: Promise<{ slug: string }>;
};

// Image metadata
export const alt = "Newsletter Image";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({ params }: Props) {
  const slug = (await params).slug;

  // fetch post information
  const data = await getCachedNewsletter(slug);

  if (!data) {
    return notFound();
  }

  const { title, featuredImage } = data;

  return createMetaImage({
    size,
    title: `Subscribe to our ${title} Newsletter`,
    image: featuredImage?.node,
  });
}
