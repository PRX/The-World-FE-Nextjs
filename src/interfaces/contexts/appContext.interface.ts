/**
 * @file interfaces/contexts/appContext.interface.ts
 *
 * Interface for app context.
 */

import { IApp } from '@interfaces/app';

export interface IAppContext {
  data?: IApp;
  page: {
    resource: {
      type?: string;
      id?: string;
    };
  };
  cookies?: any;
  copyrightDate?: string | number;
}
