/**
 * @file contributor/[id]/segments.ts
 * Gather contributor segments data from CMS API.
 */
import { NextApiRequest, NextApiResponse } from 'next';
import { fetchGqlContributorSegments } from '@lib/fetch';
import { validateUniqueId } from '@lib/validate';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id, c, f, e } = req.query;
  const contributorId = Array.isArray(id) ? id[0] : id;
  const cursor = !!c && (typeof c === 'string' ? c : c[0]);
  const pageSize = !!f && parseInt(typeof f === 'string' ? f : f[0], 10);
  const exclude = !!e && (typeof e === 'string' ? [e] : e);

  if (contributorId && validateUniqueId(contributorId)) {
    const segments = await fetchGqlContributorSegments(contributorId, {
      ...(cursor && { cursor }),
      ...(pageSize && { pageSize }),
      ...(exclude && { exclude })
    });

    if (segments) {
      return res.status(200).json(segments);
    }

    return res.status(404);
  }

  return res.status(400);
};
