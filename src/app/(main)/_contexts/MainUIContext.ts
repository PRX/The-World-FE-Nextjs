import type { AppMenus } from "@/interfaces";
import React from "react";

export const MainUIContext = React.createContext<{
  isMenuOpen: boolean;
  isMenuExpanded: boolean;
  hasBrowser: boolean;
  updateGutters(): void;
  menus: AppMenus;
}>({
  isMenuOpen: false,
  isMenuExpanded: false,
  hasBrowser: false,
  updateGutters: () => {},
  menus: {},
});

export default MainUIContext;
