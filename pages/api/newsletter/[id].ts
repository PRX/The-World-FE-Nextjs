/**
 * @file newsletter/[id].ts
 * Gather newsletter data from CMS API.
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { fetchGqlNewsletter } from '@lib/fetch';
import { validateUniqueId } from '@lib/validate';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const newsletterId = Array.isArray(id) ? id[0] : id;

  if (newsletterId && validateUniqueId(newsletterId)) {
    const data = await fetchGqlNewsletter(newsletterId);

    if (data) {
      return res.status(200).json(data);
    }

    return res.status(404).end();
  }

  return res.status(400).end();
};
