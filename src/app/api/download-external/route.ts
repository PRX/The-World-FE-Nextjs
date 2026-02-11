import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const externalUrl = new URL(request.url).searchParams.get("url");

  if (!externalUrl) {
    return new Response(
      JSON.stringify({
        message: "Bad Request: Missing or invalid `url` parameter.",
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }

  const response = await fetch(externalUrl);
  const filename = externalUrl.match(/[^/?]+(?=$|\?)/i)?.[0];

  // Set headers to prompt a download
  const headers = new Headers(response.headers);
  headers.set(
    "Content-Disposition",
    `attachment; filename="The_World_${filename || "download_file"}"`,
  );
  headers.set("Content-Type", "application/octet-stream"); // Generic binary file type

  return new Response(response.body, { headers });
}
