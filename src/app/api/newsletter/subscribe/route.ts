import type { NextRequest } from "next/server";
import { encode as base64Encode } from "base-64";

export async function POST(req: NextRequest) {
  try {
    const {
      listId: listIdSubmitted,
      emailAddress,
      name,
      customFields,
    } = await req.json();
    const [clientId, listId] =
      !listIdSubmitted || listIdSubmitted.indexOf(":") === -1
        ? [undefined, listIdSubmitted]
        : listIdSubmitted.split(":");
    const clientEnvVarExists = !!(
      clientId && process.env[`CM_API_KEY_${clientId}`]
    );
    const apiKey = clientEnvVarExists
      ? process.env[`CM_API_KEY_${clientId}`]
      : process.env.CM_API_KEY;
    const details = {
      EmailAddress: emailAddress,
      Name: name,
      CustomFields: customFields,
      ConsentToTrack: "Unchanged",
    };
    const resp = await fetch(
      `https://api.createsend.com/api/v3.2/subscribers/${listId}.json`,
      {
        method: "POST",
        headers: new Headers({
          Authorization: `Basic ${base64Encode(`${apiKey}:magic`)}`,
          "Content-Type": "application/json",
        }),
        body: JSON.stringify(details),
      },
    );
    const respJson = await resp.json();

    if (resp.status !== 201) {
      return new Response(
        JSON.stringify({
          errorCode: resp.status,
          error: Object.entries(respJson).reduce(
            (a, [key, value]) => {
              a[key.replace(/^[A-Z]/, (m) => m.toLowerCase())] = value;
              return a;
            },
            {} as { [k: string]: unknown },
          ),
          debug: {
            clientId,
            listId,
            clientEnvVarExists,
            ...details,
          },
        }),
        {
          status: resp.status,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
      }),
      {
        status: 200,
        headers: {
          "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
        },
      },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        errorCode: 500,
        error: err,
      }),
      {
        status: 500,
      },
    );
  }
}
