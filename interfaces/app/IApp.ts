import type { IButton, ICtaMessage, PostStory, Settings } from '@interfaces';

export interface IApp {
  settings?: Settings;
  latestStories?: PostStory[];
  menus?: {
    [k: string]: IButton[];
  };
  ctaRegions?: {
    [k: string]: ICtaMessage[];
  };
}
