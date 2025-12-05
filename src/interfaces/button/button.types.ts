/**
 * @file interfaces/button/button.types.tsx
 * Interfaces for button.
 */

export type Button = {
  key?: string | number;
  label: string;
  url: string | URL;
  service?: string;
  itemLinkClass?: string;
  icon?: string;
  title?: string;
  children?: Button[];
  attributes?: { [k: string]: string };
};
