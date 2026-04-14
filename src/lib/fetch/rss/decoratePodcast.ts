import type { IRssPodcastValue, Rss, RssItem } from "@/interfaces/rss";

export const extractPodcastFollow = (data: Rss) => data["podcast:follow"]?.$;

export const extractPodcastValue = (data: Rss | RssItem) => {
  const podcastValueWmIlp = (data["podcast:value"] as any[])?.find(
    ({ $: { type, method } }) => type === "webmonetization" && method === "ILP",
  );

  if (!podcastValueWmIlp) return undefined;

  const recipients = podcastValueWmIlp["podcast:valueRecipient"]?.map(
    (recipient: { $: any }) => ({
      ...recipient.$,
    }),
  );

  const podcastValue: IRssPodcastValue = {
    ...podcastValueWmIlp.$,
    ...(recipients?.length > 0 && { valueRecipients: recipients }),
  };

  return podcastValue;
};

export const extractPodcastTranscript = (data: RssItem) => {
  const podcastTranscript = data["podcast:transcript"]?.map(
    (item: { $: any }) => ({
      ...item.$,
    }),
  );
  return podcastTranscript;
};

export const decoratePodcast = (feed: Rss) => {
  const feedItems: RssItem[] = feed.items.map((item) => {
    const itemVal = extractPodcastValue(item);
    const itemTranscript = extractPodcastTranscript(item);
    const hasPodcastProps = !!itemVal || !!itemTranscript?.length;

    return {
      ...item,
      ...(hasPodcastProps && {
        podcast: {
          ...(itemVal && { value: itemVal }),
          ...(!!itemTranscript?.length && { transcript: itemTranscript }),
        },
      }),
    } as RssItem;
  });

  const feedVal = extractPodcastValue(feed);
  const feedPodcastFollow = extractPodcastFollow(feed);
  const hasPodcastProps = !!feedVal || !!feedPodcastFollow;
  const rssData: Rss = {
    ...feed,
    ...(hasPodcastProps && {
      podcast: {
        ...(feedPodcastFollow && { follow: feedPodcastFollow }),
        ...(feedVal && { value: feedVal }),
      },
    }),
    items: feedItems,
  };

  delete rssData["podcast:value"];

  return rssData;
};
