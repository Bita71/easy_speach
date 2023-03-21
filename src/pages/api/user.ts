import type { NextApiRequest, NextApiResponse } from 'next'
import { createUser, getUserById, getUserByLogin } from 'prisma/user'
import { CreatedUser, ErrorMessages } from '@/types';
import { hashSync } from "bcrypt-ts";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case 'GET': {
        if (req.query.id && typeof req.query.id === 'string') {
          const user = await getUserById(req.query.id)
          return res.status(200).json(user)
        }
      }
      case 'POST': {
        const { user = {} } = req.body
        const { login, name, password } = user as CreatedUser;
        if (!login || !name || !password) {
          return res.status(500).json({ message: ErrorMessages.noData })
        }

        const existedUser = await getUserByLogin(login)
        if (existedUser) {
          return res.status(500).json({ message: ErrorMessages.userExists })
        }

        const encryptPassword = hashSync(password, 8);

        const newUser = await createUser({
          ...user,
          password: encryptPassword,
        })
        return res.status(200).json(newUser)
      }
    }
  } catch (error: any) {
    return res.status(500).json({ ...error, message: error.message })
  }
}