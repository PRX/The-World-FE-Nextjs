/**
 * @file interfaces/cta/cta.interface.tsx
 * Interfaces for content.
 */

import { Category, ContentNode, Newsletter, Program } from '@interfaces/api';
import { IButton } from '@interfaces/button';
import { INewsletterOptions } from '@interfaces/newsletter';

export type CtaMessageType = 'info' | 'optin' | 'donation' | 'newsletter';

export interface ICtaMessage {
  name: string;
  type: CtaMessageType;
  hash: string;
  heading?: string;
  message?: string;
  optinLabel?: string;
  cookieLifespan?: number;
  action?: IButton;
  dismiss?: IButton;
  newsletter?: Newsletter;
  newsletterOptions?: INewsletterOptions;
  targetContent?: ContentNode[];
  targetCategories?: Category[];
  targetPrograms?: Program[];
  region?: string;
}

export interface ICtaMessageProps {
  data: ICtaMessage;
}

export interface ICtaRegionProps {
  data: ICtaMessage[];
}

export interface ICtaRegions {
  [k: string]: ICtaMessage[];
}

export interface ICtaMessageComponentContext {
  data: ICtaMessage;
}

export interface ICtaFilterProps {
  id?: string;
  categories?: string[];
  programs?: string[];
}
