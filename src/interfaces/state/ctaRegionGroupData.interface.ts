/**
 * @file ctaRegionGroupData.interface.ts
 *
 * Define interfaces for ctaRegionGroupData.
 */

import { AnyAction } from 'redux';
import { ICtaFilterProps, ICtaMessage } from '@interfaces/cta';

export interface CtaRegionGroupData {
  // Key: CTA Region Group Name
  [k: string]: ICtaMessage[];
}

export type Cookies = Partial<{
  [k: string]: string;
}>;

export interface CtaRegionGroupFilterProps {
  id: string;
  type: string;
  props: {
    // Key: Resource Signature
    [k: string]: ICtaFilterProps;
  };
}

export interface CtaRegionGroupDataState {
  data?: CtaRegionGroupData;
  cookies?: Cookies;
  filterProps?: CtaRegionGroupFilterProps;
}

export interface CtaRegionGroupAction extends AnyAction {
  payload: {
    ctaRegionData?: CtaRegionGroupDataState;
    data?: CtaRegionGroupData;
    filterProps?: CtaRegionGroupFilterProps;
    cookies?: Cookies;
  };
}
