/**
 * @file page/[id].ts
 * Gather page data from CMS API.
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { fetchGqlPage } from '@lib/fetch';
import { validateUniqueId } from '@lib/validate';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const pageId = Array.isArray(id) ? id[0] : id;

  if (pageId && validateUniqueId(pageId)) {
    const data = await fetchGqlPage(pageId);

    if (data) {
      return res.status(200).json(data);
    }

    return res.status(404).end();
  }

  return res.status(400).end();
};
