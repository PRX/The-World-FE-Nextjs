import type { Button, Settings } from "@/interfaces";

export type AppMenus = Partial<Record<"socialsNav" | "footerNav", Button[]>>;

export type App = {
  settings?: Settings;
  menus: AppMenus;
};
