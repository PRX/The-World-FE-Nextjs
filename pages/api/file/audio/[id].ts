/**
 * @file file/audio/[id].ts
 * Gather audio file data from CMS API.
 */
import { NextApiRequest, NextApiResponse } from 'next';
import { fetchGqlAudio } from '@lib/fetch';
import { validateUniqueId } from '@lib/validate';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const audioId = Array.isArray(id) ? id[0] : id;

  if (audioId && validateUniqueId(audioId)) {
    const audio = await fetchGqlAudio(audioId);

    if (audio) {
      return res.status(200).json(audio);
    }

    return res.status(404).end();
  }

  return res.status(400).end();
};
