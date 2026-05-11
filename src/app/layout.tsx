import type { Metadata, ResolvingMetadata } from "next";
import { merge } from "lodash";
import { SITE_METADATA } from "./(main)/_metadata";

type Props = {
  children: React.ReactNode;
};

export async function generateMetadata(
  _props: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const metadata = await parent;
  const md = structuredClone(metadata);

  merge(md, SITE_METADATA);

  return md as Metadata;
}

export default function GlobalLayout({ children }: Props) {
  return children;
}
