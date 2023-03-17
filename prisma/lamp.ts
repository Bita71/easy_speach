import { Lamp } from '@prisma/client'
import prisma from './prisma'

const addLog = async (name: string, text: string) =>  await prisma.log.create({
  data: {
    type: 'LAMP',
    name,
    text,
  },
})

// READ
export const getAllLamps = async () => {
  return await prisma.lamp.findMany({})
}

export const getLamp = async (id: string) => {
  return await prisma.lamp.findUnique({
    where: { id }
  })
}

// CREATE
export const createLamp = async (lamp: Omit<Lamp, 'id'>) => {
  const newLamp = await prisma.lamp.create({
    data: lamp,
  })
  await addLog(newLamp.name, 'Устройство создано');
  return newLamp
}

// UPDATE
export const updateLamp = async (id: string, lamp: UpdatedLamp, log: string) => {
  const newLamp = await prisma.lamp.update({
    where: {
      id,
    },
    data: lamp,
  })
  await addLog(newLamp.name, log);
  return newLamp
}

// DELETE
export const deleteLamp = async (id: string) => {
  const lamp = await prisma.lamp.delete({
    where: {
      id,
    }
  })
  await addLog(lamp.name, 'Устройство удалено');
  return lamp
}