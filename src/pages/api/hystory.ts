import type { NextApiRequest, NextApiResponse } from 'next'
import { updatePhrase, getHystoryById, getHystoriesByUser } from 'prisma/hystory';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case 'GET': {
        if (req.query.id && typeof req.query.id === 'string') {
          const phrase = await getHystoryById(req.query.id)
          return res.status(200).json(phrase)
        }
        if (req.query.user_id && typeof req.query.user_id === 'string') {
          const phrases = await getHystoriesByUser(req.query.user_id)
          return res.status(200).json(phrases)
        }
      }
      case 'POST': {
        const { hystory } = req.body
  
        const phrase = await updatePhrase(hystory)
        return res.status(200).json(phrase)
      }
    }
  } catch (error: any) {
    return res.status(500).json({ ...error, message: error.message })
  }
}