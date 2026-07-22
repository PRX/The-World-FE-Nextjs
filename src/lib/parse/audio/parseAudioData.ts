/**
 * @file parse/audio/audioData.ts
 *
 * Parse API audio data to player audio data.
 */

import type { PlayerAudio } from "@/components/Player/types";
import type {
  Contributor,
  Episode,
  MediaItem,
  PostStory,
  Program,
  Segment,
} from "@/interfaces";
import { generateAudioUrl } from "@/lib/generate/string";
import { sanitizeIso8601Date } from "@/lib/sanitize";

export const parseAudioData = (
  data: MediaItem,
  fallbackProps?: Partial<PlayerAudio>,
) => {
  const {
    id,
    date: dataDate,
    sourceUrl,
    mediaItemUrl,
    title: dataTitle,
    audioFields,
    parent,
    contributors,
    duration,
  } = data;
  const url = sourceUrl || mediaItemUrl;

  if (!url) return undefined;

  const {
    audioTitle,
    program: programs,
    broadcastDate: audioBroadcastDate,
  } = audioFields || {};
  const program = programs?.nodes?.[0] as Program;
  const programImage = program?.taxonomyImages?.logo?.node;
  const programImageUrl = programImage?.sourceUrl || programImage?.mediaItemUrl;
  const audioAuthor = contributors?.nodes;
  const {
    imageUrl: fallbackImageUrl,
    title: fallbackTitle,
    info: fallbackInfo,
    linkResource,
    queuedFrom,
  } = fallbackProps || {};
  const {
    title: parentTitle,
    featuredImage,
    link: parentLink,
  } = (parent?.node as PostStory | Segment | Episode) || {};
  const link = linkResource?.link || parentLink;
  const linkResourceImage = linkResource?.featuredImage?.node;
  const linkResourceImageUrl =
    linkResourceImage?.sourceUrl || linkResourceImage?.mediaItemUrl;
  const parentFeatureImage = featuredImage?.node;
  const parentImageUrl =
    parentFeatureImage?.sourceUrl || parentFeatureImage?.mediaItemUrl;
  const imageUrl =
    linkResourceImageUrl ||
    parentImageUrl ||
    fallbackImageUrl ||
    programImageUrl;
  const title =
    linkResource?.title ||
    parentTitle ||
    fallbackTitle ||
    audioTitle ||
    dataTitle;
  const broadcastDate =
    (linkResource &&
      ((linkResource as PostStory).additionalDates?.broadcastDate ||
        (linkResource as Segment).segmentDates?.broadcastDate ||
        (linkResource as Episode).episodeDates?.broadcastDate ||
        linkResource.date)) ||
    (parent?.node &&
      ((parent.node as PostStory).additionalDates?.broadcastDate ||
        (parent.node as Segment).segmentDates?.broadcastDate ||
        (parent.node as Episode).episodeDates?.broadcastDate ||
        parent.node.date)) ||
    audioBroadcastDate ||
    dataDate;
  const date = broadcastDate && sanitizeIso8601Date(broadcastDate);
  const info = [
    ...(program ? [program.name] : []),
    ...(audioAuthor
      ? audioAuthor.map(({ name }: Contributor) => name).filter((v) => !!v)
      : []),
    ...(date ? [date] : []),
    ...(fallbackInfo || []),
  ];

  return {
    mediaType: "audio",
    id: id,
    url: generateAudioUrl(url),
    ...(duration && { duration: duration }),
    ...(title && { title }),
    ...(queuedFrom && { queuedFrom }),
    ...(link && { link }),
    ...(imageUrl && { imageUrl }),
    ...(info.length ? { info } : {}),
    ...(linkResource && { linkResource }),
  } as PlayerAudio;
};
