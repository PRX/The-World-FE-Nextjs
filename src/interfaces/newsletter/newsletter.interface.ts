/**
 * @file interfaces/link/link.interface.tsx
 * Interfaces for link.
 */

import type { Maybe } from '@interfaces/api';

export interface ICMApiCustomField {
  Key: string;
  Value: string;
}

export interface INewsletterCustomFields {
  [k: string]: string;
}

export interface INewsletterOptions {
  listId?: Maybe<string>;
  customFields?: INewsletterCustomFields;
}

export interface INewsletterData {
  emailAddress: string;
}
