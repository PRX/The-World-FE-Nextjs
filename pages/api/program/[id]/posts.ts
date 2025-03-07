/**
 * @file program/[id]/posts.ts
 * Gather program posts data from CMS API.
 */
import { NextApiRequest, NextApiResponse } from 'next';
import { fetchGqlProgramPosts } from '@lib/fetch';
import { validateUniqueId } from '@lib/validate';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id, c, f, e } = req.query;
  const programId = Array.isArray(id) ? id[0] : id;
  const cursor = !!c && (typeof c === 'string' ? c : c[0]);
  const pageSize = !!f && parseInt(typeof f === 'string' ? f : f[0], 10);
  const exclude = !!e && (typeof e === 'string' ? [e] : e);

  if (programId && validateUniqueId(programId)) {
    const posts = await fetchGqlProgramPosts(programId, {
      ...(cursor && { cursor }),
      ...(pageSize && { pageSize }),
      ...(exclude && { exclude })
    });

    if (posts) {
      return res.status(200).json(posts);
    }

    return res.status(404).end();
  }

  return res.status(400).end();
};
