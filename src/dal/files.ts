import 'server-only'
import {prismaClient} from './prismaClient'
import type {File} from '@/generated/prisma/client'

export async function getFiles(filters?: {scriptId?: string; type?: string}): Promise<File[]> {
  return prismaClient.file.findMany({
    where: {
      scriptId: filters?.scriptId,
      type: filters?.type ? {contains: filters.type, mode: 'insensitive'} : undefined,
    },
    orderBy: {name: 'asc'},
  })
}

export async function getFileById(id: string): Promise<File | null> {
  return prismaClient.file.findUnique({
    where: {id},
  })
}

export async function createFile(data: Omit<File, 'id'>): Promise<File> {
  return prismaClient.file.create({
    data,
  })
}

export async function updateFile(id: string, data: {name?: string; url?: string}): Promise<File> {
  return prismaClient.file.update({
    where: {id},
    data,
  })
}

export async function deleteFile(id: string): Promise<File> {
  return prismaClient.file.delete({
    where: {id},
  })
}

