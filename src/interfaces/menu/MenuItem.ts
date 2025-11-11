/**
 * @file MenuItem.ts
 * Describes menu item object.
 */

export type MenuItemAttributes = {
  class?: string[];
  color?: string;
  icon?: string;
  [k: string]: any;
};

export type MenuItem = {
  id: string;
  parent: string;
  name: string;
  url: string;
  service?: string;
  attributes?: MenuItemAttributes;
  children?: MenuItem[] | null;
};

export default MenuItem;
