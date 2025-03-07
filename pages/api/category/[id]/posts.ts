/**
 * @file category/[id]/posts.ts
 * Gather category posts data from CMS API.
 */
import { NextApiRequest, NextApiResponse } from 'next';
import { fetchGqlCategoryPosts } from '@lib/fetch';
import { validateUniqueId } from '@lib/validate';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id, c, f, e } = req.query;
  const categoryId = Array.isArray(id) ? id[0] : id;
  const cursor = !!c && (typeof c === 'string' ? c : c[0]);
  const pageSize = !!f && parseInt(typeof f === 'string' ? f : f[0], 10);
  const exclude = !!e && (typeof e === 'string' ? [e] : e);

  if (categoryId && validateUniqueId(categoryId)) {
    const posts = await fetchGqlCategoryPosts(categoryId, {
      ...(cursor && { cursor }),
      ...(pageSize && { pageSize }),
      ...(exclude && { exclude })
    });

    if (posts) {
      return res.status(200).json(posts);
    }

    return res.status(404);
  }

  return res.status(400);
};
