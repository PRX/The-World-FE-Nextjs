import type { PlayerYoutube } from "@/components/Player";
import type { Episode, PostStory, Segment } from "@/interfaces";
import { sanitizeIso8601Date } from "@/lib/sanitize";

export const parseYoutubeVideoData = (
  video: GoogleAppsScript.YouTube.Schema.Video,
  fallbackProps?: Partial<PlayerYoutube>,
) => {
  const { id, contentDetails, snippet, player } = video;
  const { duration: durationString } = contentDetails || {};
  const duration =
    !!durationString && Temporal.Duration.from(durationString).total("seconds");
  const {
    title: dataTitle,
    thumbnails,
    publishedAt,
    channelTitle,
  } = snippet || {};
  const { embedHeight, embedWidth } = player || {};
  const dataImageUrl = thumbnails?.maxres?.url;
  const width = parseInt(embedWidth || "1200", 10);
  const height = parseInt(embedHeight || "675", 10);
  const aspectRatio = width / height;
  const dataDate = publishedAt && sanitizeIso8601Date(publishedAt);
  const {
    imageUrl: fallbackImageUrl,
    title: fallbackTitle,
    info: fallbackInfo,
    linkResource,
    queuedFrom,
  } = fallbackProps || {};
  const linkResourceImage = linkResource?.featuredImage?.node;
  const linkResourceImageUrl =
    linkResourceImage?.sourceUrl || linkResourceImage?.mediaItemUrl;
  const title = linkResource?.title || fallbackTitle || dataTitle;
  const imageUrl = linkResourceImageUrl || dataImageUrl || fallbackImageUrl;
  const broadcastDate =
    (linkResource &&
      ((linkResource as PostStory).additionalDates?.broadcastDate ||
        (linkResource as Segment).segmentDates?.broadcastDate ||
        (linkResource as Episode).episodeDates?.broadcastDate ||
        linkResource.date)) ||
    dataDate;
  const date = broadcastDate && sanitizeIso8601Date(broadcastDate);
  const info = [
    ...(channelTitle ? [channelTitle] : []),
    ...(date ? [date] : []),
    ...(fallbackInfo || []),
  ];

  return {
    mediaType: "youtube",
    id,
    ...(duration && { duration: duration }),
    ...(title && { title }),
    ...(queuedFrom && { queuedFrom }),
    ...(imageUrl && { imageUrl }),
    ...(info.length ? { info } : {}),
    ...(linkResource && { linkResource }),
    aspectRatio,
    player,
  } as PlayerYoutube;
};
