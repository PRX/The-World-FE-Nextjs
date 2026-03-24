/**
 * @file generateAudioUrl.ts
 *
 * Generate audio URL from passed URL. Append `_from` param when not
 * already included.
 */

export const generateAudioUrl = (audioUrl: string) => {
  try {
    const audioUrlWithProtocol = /^\/\//.test(audioUrl)
      ? `https:${audioUrl}`
      : audioUrl;
    const url = new URL(audioUrlWithProtocol);

    // Fix for deprecated podtrac redirect URL pattern.
    if (url.href.startsWith("https://www.podtrac.com/pts")) {
      url.host = "dts.podtrac.com";
      url.pathname = url.pathname.replace(/^\/pts/, "");
    }

    if (!url.searchParams.get("_from")) {
      url.searchParams.set("_from", "theworld.org");
    }

    return url.toString();
  } catch (error) {
    console.debug(audioUrl);
    console.debug(error);
    return undefined;
  }
};
