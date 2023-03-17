import type { NextApiRequest, NextApiResponse } from 'next'
import {
  getLamp, getAllLamps, createLamp, updateLamp, deleteLamp
} from '../../../prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case 'GET': {
        if (req.query.id && typeof req.query.id === 'string') {
          const lamp = await getLamp(req.query.id)
          return res.status(200).json(lamp)
        } else {
          const lamps = await getAllLamps()
          return res.status(200).json(lamps)
        }
      }
      case 'POST': {
        const { lamp } = req.body
        const newLamp = await createLamp(lamp)
        return res.status(200).json(newLamp)
      }
      case 'PUT': {
        const {
          id,
          lamp,
          log
        } = req.body
        const newLamp = await updateLamp(id, lamp, log)
        return res.status(200).json(newLamp)
      }
      case 'DELETE': {
        const { id } = req.body
        const lamp = await deleteLamp(id)
        return res.status(200).json(lamp)
      }
      default:
        break
    }
  } catch (error: any) {
    return res.status(500).json({ ...error, message: error.message })
  }
}