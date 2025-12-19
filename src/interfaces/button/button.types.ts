/**
 * @file interfaces/button/button.types.tsx
 * Interfaces for button.
 */

import type { UrlObject } from "node:url";

export type Button = {
  key?: string | number;
  label: string;
  url: string | (UrlObject & string);
  service?: string;
  itemLinkClass?: string;
  icon?: string;
  title?: string;
  children?: Button[];
  attributes?: Record<string, string>;
};
