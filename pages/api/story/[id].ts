/**
 * @file story/[id].ts
 * Gather story data from CMS API.
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { fetchGqlStory } from '@lib/fetch';
import { validateUniqueId } from '@lib/validate';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const storyId = Array.isArray(id) ? id[0] : id;

  if (storyId && validateUniqueId(storyId)) {
    const story = await fetchGqlStory(storyId);

    if (story) {
      return res.status(200).json(story);
    }

    return res.status(404).end();
  }

  return res.status(400).end();
};
