import type { NextApiRequest, NextApiResponse } from 'next'
import { getUserByLogin } from 'prisma/user'
import { AuthedUser, ErrorMessages } from '@/types';
import { compareSync } from "bcrypt-ts";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case 'POST': {
        const { user } = req.body
        const { login, password } = user as AuthedUser;
        if (!login || !password) {
          return res.status(500).json({ message: ErrorMessages.noData })
        }

        const existedUser = await getUserByLogin(login)
        if (!existedUser) {
          return res.status(500).json({ message: ErrorMessages.userNotExists })
        }

        const isRightPassword = compareSync(password, existedUser.password);

        if (!isRightPassword) {
          return res.status(403).json({ message: ErrorMessages.badPassword })
        }

        return res.status(200).json(existedUser)
      }
    }
  } catch (error: any) {
    return res.status(500).json({ ...error, message: error.message })
  }
}