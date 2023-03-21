import { Phrase } from '@prisma/client';
import { api } from "./api";

const url = '/api/phrase'

export const getPhraseById = (id: string) => api.get<Phrase>(`${url}/?id=${id}`).then((data) => data.data)
