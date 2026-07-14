import { createMetaImage } from "@/app/(main)/_metadata";

// Image metadata
export const alt = "The World from PRX";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/jpeg";

export default async function Image() {
  return createMetaImage({
    size,
  });
}
