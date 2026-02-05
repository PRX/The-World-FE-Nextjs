import { PlayButton, Player, PlayerProgress, TrackInfo } from "@/components/Player";
import { Button } from "@/components/ui/button";
import {
  fetchGqlAudio,
  fetchGqlEpisode,
  fetchGqlSegment,
  fetchGqlStory,
  fetchTwApi,
} from "@/lib/fetch";
import { parseAudioData } from "@/lib/parse/audio";
import { encode } from "base-64";
import { DownloadIcon } from "lucide-react";
import { unstable_cache } from "next/cache";
import { notFound, redirect, RedirectType } from "next/navigation";

export const getCachedAudioEmbedData = unstable_cache(
  async (id: string) => {
    const story = await fetchGqlStory(id);
    if (story) {
      const audioId = story?.additionalMedia?.audio?.id;
      const audioData =
        (!!audioId && (await fetchGqlAudio(audioId))) || undefined;

      return audioData && parseAudioData(audioData, { linkResource: story });
    }

    const segment = await fetchGqlSegment(id);
    if (segment) {
      const audioId = segment?.segmentContent?.audio?.id;
      const audioData =
        (!!audioId && (await fetchGqlAudio(audioId))) || undefined;

      return audioData && parseAudioData(audioData, { linkResource: segment });
    }

    const episode = await fetchGqlEpisode(id);
    if (episode) {
      const audioId = episode?.episodeAudio?.audio?.id;
      const audioData =
        (!!audioId && (await fetchGqlAudio(audioId))) || undefined;

      return audioData && parseAudioData(audioData, { linkResource: episode });
    }

    const audio = await fetchGqlAudio(id);
    if (audio) {
      return parseAudioData(audio);
    }

    return undefined;
  },
  ["embed"],
  {
    tags: ["embed", "audio"],
    revalidate: 60,
  },
);

export default async function AudioEmbed({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  if (!id) {
    notFound();
  }

  const isNumeric = /^\d+$/.test(id);
  if (isNumeric) {
    // Request is for an old embed using a Drupal nid. Try to get the WP ID and post type of the migrated post.
    const aliasData = await fetchTwApi<{
      id: number;
      type?: string;
    }>(`tw/v2/alias`, {
      _fields: "id,type",
      ...resolvedParams,
      slug: id,
    }).then((resp) => resp?.data);

    const resourceId = aliasData && encode(`${aliasData.type}:${aliasData.id}`);

    if (resourceId) {
      // Redirect to embed URL using encoded id.
      redirect(`/embed/audio/${resourceId}`, RedirectType.replace);
    }
  }

  const audio = await getCachedAudioEmbedData(decodeURIComponent(id));

  return (
    audio && (
      <Player tracks={[audio]} autoplay={false} standalone>
        <div className="grid grid-cols-[min-content_1fr_min-content] grid-rows-[1fr_min-content] gap-x-2 h-12.5 bg-navy-blue rounded-sm leading-0 overflow-clip">
          <div className="grid place-items-center p-1 z-1">
            <PlayButton
              size="icon-sm"
              className="size-9.5 m-0 p-0 [&_svg]:size-6"
              disableTooltip
            />
          </div>
          <TrackInfo
            className="grow content-center gap-y-0 leading-none mask-r-from-[calc(100%-1rem)] mask-l-from-[calc(100%-1rem)] [&>div]:px-2 [&>div]:text-xs -mx-3"
            linkProps={{ target: "_blank" }}
          />
          <div className="grid items-center p-1 z-1">
            <Button
              size="icon-sm"
              className="size-9.5 rounded-full m-0 p-0 [&_svg]:size-6"
              variant="ghost"
              asChild
            >
              <a
                href={`/api/download-external?url=${encodeURIComponent(audio.url)}`}
                download
              >
                <DownloadIcon aria-label="Download Audio" />
              </a>
            </Button>
          </div>
          <PlayerProgress className="row-start-2 col-span-full z-2" />
        </div>
      </Player>
    )
  );
}
