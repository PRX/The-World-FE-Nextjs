/**
 * @file videoEmbedUrls.ts
 *
 * Functions for parsing and generating video embed URL's.
 */

// YouTube URL Patterns:
// 1. [http://]www.youtube.com/embed/VIDEOID : IFrame embed. Can have querystring options
// 2. [http://]www.youtube.com/v/VIDEOID : AS3 embed. Can have querystring options
// 3. [http://]www.youtube.com/watch?v=VIDEOID : URL in address bar when watching on website
// 4. [http://]youtu.be/VIDEOID : Sharing URL. Can have querystring options

// Extracts the id based on YouTube URL patterns.
export const getYoutubeVideoId = (videoId: string) => {
  const result =
    // eslint-disable-next-line no-nested-ternary
    videoId.indexOf('/') > -1
      ? // This is a url
        videoId.indexOf('/watch') > -1
        ? // URL is pattern 3
          videoId.match(/v=([^&]+)(?:&|$)/i)?.[1]
        : // All other URL patterns have the video id at the end of the path segment,
          // after the last '/' up to the end of the string (or '?' if present)
          videoId.match(/\/([^?/]+)(?:\?|$)/i)?.[1]
      : // Not URL. Assume original value is the id
        videoId;

  return result;
};

// Generate YouTube embed URL (pattern 1)
export const makeYoutubeEmbedUrl = (videoId: string) => {
  // TODO: embed opts should be configurable
  const opts = `?${[
    'showinfo=0', // Hide video title
    'modestbranding=1', // Hide YouTube logo on controls
    'rel=0', // Don't show related video grid after video has finished
    'feature=oembed'
  ].join('&')}`;

  return `//www.youtube-nocookie.com/embed/${getYoutubeVideoId(
    videoId
  )}${opts}`;
};

// Vimeo URL Patterns:
// 1. [http://]player.vimeo.com/video/VIDEOID : IFrame embed. Can have querystring options
// 2. [http://]vimeo.com/VIDEOID : URL in address bar when watching on website

// Extracts the id based on Vimeo URL patterns.
export const getVimeoVideoId = (videoId: string) => {
  const result =
    videoId.indexOf('/') > -1
      ? // Vimeo's urls all have the video id at the end of the path segment,
        // after the last '/' up to the end of the string (or '?' if present)
        videoId.match(/\/([^?/]+)(?:\?|$)/i)?.[1]
      : // Not URL. Assume original value is the Id
        videoId;

  return result;
};

// Generate Vimeo embed URL (pattern 1)
export const makeVimeoEmbedUrl = (videoId: string) => {
  // TODO: embed opts should be configurable
  const opts = `?${[
    'title=0', // Hide video title
    'portrait=0', // Hide creator portrait
    'byline=0', // Hide creater byline
    'color=dc5555' // Set color to sites primary accent color. I ♥ Vimeo.
  ].join('&')}`;

  return `//player.vimeo.com/video/${getVimeoVideoId(videoId)}${opts}`;
};
