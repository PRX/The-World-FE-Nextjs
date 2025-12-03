import React from "react";

export const MainUIContext = React.createContext({
  isMenuOpen: false,
  updateGutters: () => {},
});

export default MainUIContext;
