/**
 * @file interfaces/content/content.interface.tsx
 * Interfaces for content.
 */

import { ISocialLink } from '@interfaces/social';

export interface IContentComponentProps<D> {
  data: D;
  isPreview?: boolean;
}

export interface IContentComponentProxyProps {
  type?: string;
  id?: string;
  errorCode?: number;
  redirect?: string;
  data?: any;
  cookies?: any;
  shareLinks?: ISocialLink[];
}
