import type { AppMenus } from "@/interfaces";
import React from "react";

export const MainUIContext = React.createContext<{
  isMenuOpen: boolean;
  updateGutters(): void;
  menus: AppMenus;
}>({
  isMenuOpen: false,
  updateGutters: () => {},
  menus: {},
});

export default MainUIContext;
