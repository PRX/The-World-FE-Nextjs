/**
 * @file parseMenu.ts
 * Helper functions to parse menu API data into button objects.
 */

import type { Button, Maybe, MenuItem } from "@/interfaces";
import { isLocalUrl } from "../url";

const servicesMap = new Map<string, string>();
servicesMap.set("give.prx.org", "prx:give");
servicesMap.set("facebook.com", "facebook");
servicesMap.set("www.facebook.com", "facebook");
servicesMap.set("instagram.com", "instagram");
servicesMap.set("www.instagram.com", "instagram");
servicesMap.set("x.com", "twitter");
servicesMap.set("twitter.com", "twitter");
servicesMap.set("www.x.com", "twitter");
servicesMap.set("www.twitter.com", "twitter");
servicesMap.set("bsky.app", "bluesky");
servicesMap.set("tiktok.com", "tiktok");
servicesMap.set("www.tiktok.com", "tiktok");
servicesMap.set("youtube.com", "youtube");
servicesMap.set("www.youtube.com", "youtube");

function getServiceFromUrl(url?: Maybe<string>) {
  if (!url) return undefined;

  try {
    const { hostname } = new URL(url, "https://theworld.org");
    const service = servicesMap.get(hostname);

    return service;
  } catch (_e) {
    return undefined;
  }
}

function getChildren(itemId: string, allItems: MenuItem[]) {
  let children = allItems.filter(({ parentId }) => parentId === itemId);

  if (!children.length) return null;

  children = children.map(
    ({ id, ...rest }) =>
      ({
        ...rest,
        id,
        parentId: null,
        childItems: getChildren(id, allItems),
      }) as MenuItem,
  );

  return children;
}

export const parseMenu = (data: MenuItem[]): Button[] => {
  // If no data or links exist, return empty array.
  if (!data || !data.length) {
    return [];
  }

  const menu = data
    .filter((v) => !!v.url && v.label && !v.parentId)
    .map<Button>(({ id, label, url }) => {
      const isLocal = isLocalUrl(url || "/");
      const service = getServiceFromUrl(url);
      const children = getChildren(id, data);

      return {
        key: id,
        label,
        url,
        ...(service && { service }),
        ...(children && { children: parseMenu(children) }),
        attributes: {
          ...(!isLocal && {
            referrerPolicy: "no-referrer-when-downgrade",
          }),
        },
      } as Button;
    });

  return menu;
};
