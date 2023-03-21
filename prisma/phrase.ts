import { ComplexityType } from '@prisma/client'
import { prisma } from './prisma'

// READ
export const getPhraseById = async (id: string) => {
  return await prisma.phrase.findUnique({
    where: { id }
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

  const ids = phrases.map((item) => item.phraseId);

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
