/**
 * Define homepage data interfaces and types.
 */

import type { Program } from "@/interfaces/api";
import type { Button } from "@/interfaces/button";

export type Homepage = Program & {
  menus: Record<string, Button[]>;
};
