/**
 * @file episode/[id].ts
 * Gather episode data from CMS API.
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { fetchGqlEpisode } from '@lib/fetch';
import { validateUniqueId } from '@lib/validate';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const episodeId = Array.isArray(id) ? id[0] : id;

  if (episodeId && validateUniqueId(episodeId)) {
    const data = await fetchGqlEpisode(episodeId);

    if (data) {
      return res.status(200).json(data);
    }

    return res.status(404).end();
  }

  return res.status(400).end();
};
