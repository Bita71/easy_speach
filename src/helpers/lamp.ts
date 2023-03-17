import { Lamp } from '@prisma/client';
import { UpdatedLamp } from 'types';
import { api } from "./api";

interface UpdateLampProps {
  id: string,
  lamp: UpdatedLamp,
  log?: string,
}

interface CreateLampProps extends Partial<Omit<Lamp, 'id'>> {
  name: string,
  colorId: string
}

export const getAllLamps = () => api.get<Lamp[]>('/api/lamp').then((data) => data.data)
export const getLamp = (id: string) => api.get<Lamp>(`/api/lamp/?id=${id}`).then((data) => data.data)

export const createLamp = (lamp: CreateLampProps) => api.post<Lamp>('/api/lamp', {
  lamp,
}).then((data) => data.data)

export const updateLamp = ({ id, lamp, log }: UpdateLampProps) => api.put<Lamp>('/api/lamp', {
  id,
  lamp,
  log,
}).then((data) => data.data)

export const deleteLamp = (id: string) => api.delete<Lamp>('/api/lamp', {
  data: {id}
}).then((data) => data.data)