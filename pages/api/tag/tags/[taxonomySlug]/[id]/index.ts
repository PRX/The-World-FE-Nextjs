/**
 * @file tag/tags/[taxonomySlug]/[id]/index.ts
 * Gather custom taxonomy tag data from CMS API.
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { fetchGqlTag } from '@lib/fetch';
import { taxonomySlugToSingularName } from '@lib/map/taxonomy';
import { validateUniqueId } from '@lib/validate';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id, taxonomySlug: ts } = req.query;
  const tagId = Array.isArray(id) ? id[0] : id;
  const taxonomySlug =
    (!!ts && (typeof ts === 'string' ? ts : ts[0])) || undefined;
  const taxonomySingleName =
    taxonomySlug && taxonomySlugToSingularName.get(taxonomySlug);

  if (tagId && validateUniqueId(tagId)) {
    const tag = await fetchGqlTag(tagId, undefined, taxonomySingleName);

    if (tag) {
      return res.status(200).json(tag);
    }

    return res.status(404).end();
  }

  return res.status(400).end();
};
