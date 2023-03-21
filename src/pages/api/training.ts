import type { NextApiRequest, NextApiResponse } from 'next'
import { getPhrasesForUser } from 'prisma/phrase';
import { ComplexityType } from '@prisma/client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case 'GET': {
        if (req.query.user_id && typeof req.query.user_id === 'string' && req.query.complexity && typeof req.query.complexity === 'string') {
          const phrases = await getPhrasesForUser(req.query.user_id, req.query.complexity as ComplexityType)
          return res.status(200).json(phrases)
        }
      }
    }
  } catch (error: any) {
    return res.status(500).json({ ...error, message: error.message })
  }
}