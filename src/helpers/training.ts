import { ComplexityType, Phrase } from '@prisma/client';
import { api } from "./api";

const url = '/api/training'

interface Options {
  complexity: ComplexityType,
  userId: string,
}

export const getPhrasesForUser = ({ complexity, userId }: Options) => api.get<Phrase[]>(`${url}/?user_id=${userId}&complexity=${complexity}`).then((data) => data.data)
