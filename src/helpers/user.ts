import { User } from '@prisma/client';
import { CreatedUser } from '@/types';
import { api } from "./api";

const url = '/api/user'

export const getUserById = (id: string) => api.get<User>(`${url}/?id=${id}`).then((data) => data.data)

export const createUser = (user: CreatedUser) => api.post<User>(url, {
  user,
}).then((data) => data.data)
