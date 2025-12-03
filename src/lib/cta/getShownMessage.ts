/**
 * @file getShownMessage.ts
 */

import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import type { ICtaMessage } from "@/interfaces/cta";
import { getCookieKey } from "./getCookieKey";

/**
 * Determine which (if any) of the messages should be shown.
 * Show first message that either:
 * - Cookie does NOT exist for key based on `name` prop.
 * - Cookie exists, but its value does NOT match `hash` prop.
 * Returns first message when cookie is ignored.
 *
 * @return {object|null} - Message data object that should be rendered.
 */
export const getShownMessage = (
  messages?: ICtaMessage[],
  cookies?: ReadonlyRequestCookies,
) => {
  let message: ICtaMessage | undefined;

  if (messages) {
    message = !cookies
      ? [...messages].shift()
      : messages.reduce((result, msg) => {
          const { id, hash } = msg;
          const cookieName = getCookieKey(id);
          const hashOld = cookies.get(cookieName)?.value;

          if (!result && (!hashOld || hashOld !== hash)) {
            return msg;
          }

          return result;
        }, message);
  }

  return message;
};
