import { CreatedUser } from '@/types'
import { prisma } from './prisma'

// READ
export const getUserById = async (id: string) => {
  return await prisma.user.findUnique({
    where: { id }
  })
}

export const getUserByLogin = async (login: string) => {
  return await prisma.user.findUnique({
    where: { login }
  })
}

// CREATE
export const createUser = async (user: CreatedUser) => {
  return await prisma.user.create({
    data: user,
  })
}
