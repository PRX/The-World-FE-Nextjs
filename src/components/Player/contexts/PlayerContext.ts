"use client";

/**
 * @file PlayerContext.js
 * Creates context for cta region data.
 */

import React from "react";
import type { IPlayerContext } from "../types";

export const PlayerContext = React.createContext({} as IPlayerContext);
