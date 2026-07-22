import type {
  ContentNode,
  Episode,
  Node,
  NodeWithFeaturedImage,
  NodeWithTitle,
  PostStory,
  Segment,
} from "@/interfaces";

export type PlayerTrack = {
  /**
   * Unique identifier for the track.
   */
  id: string;

  /**
   * Title to be displayed in player.
   */
  title: string;

  /**
   * Info strings.
   */
  info?: string[];

  /**
   * Duration of the track in seconds.
   */
  duration: number;

  /**
   * Source URL for image to use in thumbnail or feature art.
   */
  imageUrl?: string;

  /**
   * Name of the controls that queued the track.
   * Used in Plausible events when track is added to playlist.
   */
  queuedFrom: string;

  /**
   * Content link resource data.
   */
  linkResource?:
    | (ContentNode & NodeWithTitle & NodeWithFeaturedImage & Node)
    | PostStory
    | Episode
    | Segment;
} & (
  | ({
      mediaType: "audio";
    } & {
      /**
       * Source URL for the audio file.
       */
      url: string;
    })
  | ({ mediaType: "youtube" } & {
      /**
       * Aspect ratio of the video calculated from `player.embedWidth / player.embedHeight`.
       */
      aspectRatio: number;

      /**
       * The player object contains information that you would use to play the video in an embedded player.
       */
      player: GoogleAppsScript.YouTube.Schema.VideoPlayer;

      /**
       * Optional full YouTube video URL.
       */
      url?: string;
    })
);
