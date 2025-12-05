import type { Button, Settings } from "@/interfaces";

export type AppMenus = {
  socialsNav?: Button[];
  footerNav?: Button[];
};

export type App = {
  settings?: Settings;
  menus: AppMenus;
};
