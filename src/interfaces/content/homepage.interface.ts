/**
 * Define homepage data interfaces and types.
 */

import { Program } from '@interfaces/api';
import { IButton } from '@interfaces/button';
import { PostStory } from './story.interface';

export type Homepage = Program & {
  latestStories: PostStory[];
  menus: { [k: string]: IButton[] };
};
