import type { PlayerTrack } from "./PlayerTrack.type";

/**
 * Audio data interface.
 */
export type PlayerAudio = PlayerTrack & { mediaType: "audio" };
