import type { NextApiRequest, NextApiResponse } from 'next'
import { getPhraseById } from 'prisma/phrase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case 'GET': {
        if (req.query.id && typeof req.query.id === 'string') {
          const phrase = await getPhraseById(req.query.id)
          return res.status(200).json(phrase)
        }
      }
    }
  } catch (error: any) {
    return res.status(500).json({ ...error, message: error.message })
  }
}