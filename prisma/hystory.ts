import { UpdateHystory } from './../src/types/hystory';
import { ComplexityType } from '@prisma/client'
import { prisma } from './prisma'

// READ
export const getHystoryById = async (id: string) => {
  return await prisma.hystory.findUnique({
    where: { id },
    select: {
      phrase: true,
      attemptsCount: true,
      result: true,
      skipped: true,
    }
  })
}
export const getHystoriesByUser = async (userId: string) => {
  return await prisma.hystory.findMany({
    where: { userId },
    select: {
      phrase: true,
      attemptsCount: true,
      result: true,
      skipped: true,
      createdAt: true,
      updatedAt: true,
      id: true,
      user: true,
    }
  })
}

export const getPhrasesForUser = async (userId: string, complexity: ComplexityType) => {
  const phrases = await prisma.hystory.findMany({
    where: {
      userId,
      phrase: {
        complexity,
      }
    }
  })

  const ids = phrases.map((item) => item.id);

  return await prisma.phrase.findMany({
    where: { 
      id: {
        notIn: ids,
      },
      complexity,
    },
    take: 5,
  })
}

// UPDATE

export const updatePhrase = async (hystory: UpdateHystory) => {
  const item = await prisma.hystory.findFirst({
    where: {
      userId: hystory.userId,
      phraseId: hystory.phraseId,
    },
  })

  if (!item) {
    return await prisma.hystory.create({
      data: {
        result: hystory.result,
        userId: hystory.userId,
        phraseId: hystory.phraseId,
        skipped: hystory.skipped,
        attemptsCount: 1,
      }
    })
  }

  return prisma.hystory.update({
    where: {
      id: item.id,
    },
    data: {
      result: hystory.result,
      attemptsCount: item.attemptsCount + 1,
    }
  })
}
