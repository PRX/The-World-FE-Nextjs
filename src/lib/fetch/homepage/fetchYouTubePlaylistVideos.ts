export async function fetchYouTubePlaylistVideos(playlistId: string) {
  if (process.env.YT_API_KEY && playlistId) {
    const ytApiUrl = new URL(
      "https://youtube.googleapis.com/youtube/v3/playlistItems",
    );

    ytApiUrl.searchParams.set("key", process.env.YT_API_KEY);
    ytApiUrl.searchParams.set("part", "contentDetails");
    ytApiUrl.searchParams.set("playlistId", playlistId);
    ytApiUrl.searchParams.set("maxResults", "50");

    const ytPlaylistItemsResponse = await fetch(ytApiUrl.toString(), {
      headers: [["Accept", "application/json"]],
    })
      .then((resp) => resp.json())
      .then((data) => {
        if (data.error) {
          console.error("Unable to fetch YouTube playlist.", {
            ...data,
          });
          return undefined;
        }
        return data as GoogleAppsScript.YouTube.Schema.PlaylistItemListResponse;
      });

    if (ytPlaylistItemsResponse?.items?.length) {
      const videoIds = ytPlaylistItemsResponse.items.map(
        ({ contentDetails }) => contentDetails?.videoId,
      );
      ytApiUrl.pathname = "/youtube/v3/videos";
      ytApiUrl.searchParams.delete("playlistId");
      ytApiUrl.searchParams.set("part", "contentDetails,snippet,player");
      ytApiUrl.searchParams.set("maxHeight", "1200");
      ytApiUrl.searchParams.set("maxWidth", "1200");
      ytApiUrl.searchParams.set("id", videoIds.join(","));

      const ytVideosResponse = await fetch(ytApiUrl.toString(), {
        headers: [["Accept", "application/json"]],
      })
        .then((resp) => resp.json())
        .then((data) => {
          if (data.error) {
            console.error("Unable to fetch YouTube videos.", {
              ...data,
            });
            return undefined;
          }
          return data as GoogleAppsScript.YouTube.Schema.VideoListResponse;
        });

      return ytVideosResponse?.items;
    }
  }

  return undefined;
}
