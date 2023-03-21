import { UpdateHystory } from './../types/hystory';
import { Hystory, User, Phrase } from '@prisma/client';
import { AuthedUser } from '@/types';
import { api } from "./api";

const url = '/api/hystory'

interface ResHystory extends Hystory {
  phrase: Phrase,
}

export const getHystoryById = (id: string) => api.get<ResHystory>(`${url}/?id=${id}`).then((data) => data.data)
export const getHystoriesByUser = (userId: string) => api.get<ResHystory[]>(`${url}/?user_id=${userId}`).then((data) => data.data)

export const updatePhrace = (hystory: UpdateHystory) => api.post<Hystory>(url, {
  hystory,
}).then((data) => data.data)
