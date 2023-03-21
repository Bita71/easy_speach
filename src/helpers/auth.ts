import { User } from '@prisma/client';
import { AuthedUser } from '@/types';
import { api } from "./api";

const url = '/api/auth'

export const authUser = (user: AuthedUser) => api.post<User>(url, {
  user,
}).then((data) => data.data)
