import { PlayButton, Player, PlayerProgress, TrackInfo, VolumeControls } from "@/components/Player";
import { Button } from "@/components/ui/button";
import {
  fetchGqlAudio,
  fetchGqlEpisode,
  fetchGqlSegment,
  fetchGqlStory,
  fetchTwApi,
} from "@/lib/fetch";
import { parseAudioData } from "@/lib/parse/audio";
import { cn } from "@/lib/utils";
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
        <div className="grid grid-cols-[min-content_1fr_min-content] grid-rows-[1fr_min-content] items-around gap-x-2 h-12.5 bg-navy-blue bg-linear-to-r to-green rounded-sm leading-0 overflow-clip">
          <div className="row-span-2 grid place-items-stretch aspect-square p-0 z-1 overflow-clip">
            <PlayButton
              size="icon-sm"
              className="size-auto m-0 p-0 [&_svg]:size-6 rounded-none before:rounded-none after:rounded-none"
              disableTooltip
            />
          </div>
          <div className="grow flex justify-between items-center">
            <TrackInfo
              className="grow content-center gap-y-0 leading-none mask-r-from-[calc(100%-1rem)] mask-l-from-[calc(100%-1rem)] [&>div]:px-2 -mx-3"
              linkProps={{ target: "_blank" }}
            />
            <VolumeControls className={cn(
              "p-0 grid-cols-[min-content] hover:grid-cols-[minmax(100px,1fr)_min-content] hover:bg-transparent focus-within:bg-transparent",
              "*:data-[slot=slider]:hidden hover:*:data-[slot=slider]:grid",
              "**:data-[slot=slider-range]:bg-white",
              "[&>button]:size-8 [&>button>svg]:size-6"
            )} muteButtonProps={{ disableTooltip: true }} />
          </div>
          <div className="row-span-2 grid place-items-stretch aspect-square p-0 z-1">
            <Button
              size="icon-sm"
              className="size-auto rounded-none m-0 p-0 [&_svg]:size-6"
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
          <div className="row-start-2 col-start-2 z-2 pb-1">
            <PlayerProgress className="rounded-full bg-current/10" />
          </div>
        </div>
      </Player>
    )
  );
}
