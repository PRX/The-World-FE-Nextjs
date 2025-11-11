/**
 * Define term data interfaces and types.
 */

import type {
  City,
  Continent,
  Country,
  Person,
  ProvinceOrState,
  Region,
  SocialTag,
  Tag
} from '@interfaces';

export type PostTag =
  | Tag
  | City
  | Continent
  | Country
  | Person
  | ProvinceOrState
  | Region
  | SocialTag;
