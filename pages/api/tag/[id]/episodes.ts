/**
 * @file tags/[id]/episodes.ts
 * Gather tag episodes data from CMS API.
 */
import { NextApiRequest, NextApiResponse } from 'next';
import { fetchGqlTagEpisodes } from '@lib/fetch';
import { validateUniqueId } from '@lib/validate';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id, c, f, e } = req.query;
  const tagId = Array.isArray(id) ? id[0] : id;
  const cursor = !!c && (typeof c === 'string' ? c : c[0]);
  const pageSize = !!f && parseInt(typeof f === 'string' ? f : f[0], 10);
  const exclude = !!e && (typeof e === 'string' ? [e] : e);

  if (tagId && validateUniqueId(tagId)) {
    const episodes = await fetchGqlTagEpisodes(tagId, {
      ...(cursor && { cursor }),
      ...(pageSize && { pageSize }),
      ...(exclude && { exclude })
    });

    if (episodes) {
      return res.status(200).json(episodes);
    }

    return res.status(404);
  }

  return res.status(400);
};
