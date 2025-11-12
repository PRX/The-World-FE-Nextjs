/**
 * @file ctaData.interface.ts
 *
 * Define interfaces for ctaData.
 */

import type { ICtaMessage } from "@/interfaces/cta";

export interface CtaDataState {
  // Key: Resource signature.
  [k: string]: {
    pageType?: string;
    context?: string[];
    groups?: {
      // Key: CTA region group.
      // Value: array of CTA region keys.
      [k: string]: string[];
    };
    data?: {
      // Key: CTA region.
      [k: string]: ICtaMessage[];
    };
  };
}

export interface CtaAction {
  payload: {
    ctaData?: CtaDataState;
    type: string;
    id: string;
    pageType: string;
    context: string[];
    groups?: {
      // Key: CTA region group.
      // Value: array of CTA region keys.
      [k: string]: string[];
    };
    data?: {
      // Key: CTA region.
      [k: string]: ICtaMessage[];
    };
  };
}
