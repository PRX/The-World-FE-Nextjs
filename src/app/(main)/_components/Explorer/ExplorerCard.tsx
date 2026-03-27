import Image from "next/image";
import {
  AddAudioButton,
  PlayAudioButton,
  type PlayerAudio,
} from "@/components/Player";
import {
  Card,
  CardFooter,
  CardHeader,
  CardImage,
  CardLink,
  CardTitle,
} from "@/components/ui/card";
import type {
  ContentNode,
  Episode,
  NodeWithFeaturedImage,
  NodeWithTitle,
  Post,
  Segment,
} from "@/interfaces";
import { generateContentLinkHref } from "@/lib/routing/content";
import { cn } from "@/lib/util/css";
import Link from "next/link";
import { BookmarkIcon } from "lucide-react";
import { DateTime } from "@/components/DateTime";
import { formatDuration } from "@/lib/parse/time";
import { sanitizeUrl } from "@/lib/parse/url";

export type ExplorerCardProps = React.ComponentProps<"div"> & {
  data: ContentNode;
};

export function ExplorerCard({ data, className, ...props }: ExplorerCardProps) {
  const { additionalMedia, primaryCategory } = data as Post;
  const { episodeAudio, episodeDates } = data as Episode;
  const { segmentContent, segmentDates } = data as Segment;

  const { audio } = additionalMedia || episodeAudio || segmentContent || {};
  const { duration } = audio || {};
  const isEpisode = !!episodeAudio;

  const { title, date, link, featuredImage } =
    (data as ContentNode & NodeWithFeaturedImage & NodeWithTitle) || {};
  const displayDate =
    episodeDates?.broadcastDate || segmentDates?.broadcastDate || date;

  const { name: pcName, link: pcLink } = primaryCategory || {};
  const {
    id: imageId,
    altText,
    sourceUrl,
    mediaItemUrl,
  } = featuredImage?.node || {};
  const isPlaceholderImage = !!imageId && ["cG9zdDo5Ng=="].includes(imageId);
  const imageSrc = sourceUrl || mediaItemUrl;
  const linkHref = generateContentLinkHref(link);
  const pcLinkHref = generateContentLinkHref(pcLink);
  const fallbackProps = {
    title,
    queuedFrom: "Card Controls",
    ...(imageSrc && { imageUrl: imageSrc }),
    linkResource: data,
  } as Partial<PlayerAudio>;

  return (
    <Card className={cn("aspect-2/3", className)} {...props}>
      {linkHref && <CardLink href={linkHref} />}
      {imageSrc && !isPlaceholderImage && (
        <CardImage data-image-id={imageId}>
          <Image
            src={sanitizeUrl(imageSrc)}
            alt={altText || ""}
            fill
            sizes={`(min-width: 768px) 800px, 200vw`}
            style={{
              objectFit: "cover",
            }}
          />
        </CardImage>
      )}
      <CardHeader>
        {pcLinkHref && (
          <Link
            href={pcLinkHref}
            className={cn(
              "relative z-2 flex self-start items-center gap-x-2 py-1 pl-1 pr-2 -ml-1 rounded-sm text-md/tight text-balance [&>svg]:text-cyan",
              "hover:bg-cyan/10 hover:backdrop-blur-md hover:backdrop-brightness-125",
            )}
          >
            <BookmarkIcon /> {pcName}
          </Link>
        )}
        <CardTitle>{title}</CardTitle>
        <div className="flex items-center text-md [&>*+*]:before:content-['\2022'] [&>*+*]:before:mx-2">
          {isEpisode && (
            <span className="text-cyan font-bold font-serif uppercase italic">
              Full Episode
            </span>
          )}
          <DateTime
            date={displayDate}
            options={{
              year: "numeric",
              month: "short",
              day: "numeric",
            }}
          />
        </div>
      </CardHeader>
      {audio && (
        <CardFooter>
          <div
            className={cn(
              "relative z-1 flex justify-between items-center leading-1",
            )}
          >
            <span className="flex items-center gap-x-2">
              <PlayAudioButton
                className="text-cyan"
                variant="ghost"
                audio={audio}
                fallbackProps={fallbackProps}
              />
              {duration && <span>{formatDuration(duration)}</span>}
            </span>
            <AddAudioButton
              className="text-cyan"
              variant="ghost"
              audio={audio}
              fallbackProps={fallbackProps}
            />
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
