import 'server-only'
import {prismaClient} from './prismaClient'
import type {Tag} from '@prisma/client'

export async function getTags(filters?: {search?: string; limit?: number}): Promise<Tag[]> {
  return prismaClient.tag.findMany({
    where: filters?.search ? {
      name: {contains: filters.search, mode: 'insensitive'},
    } : undefined,
    take: filters?.limit,
    orderBy: {name: 'asc'},
  })
}

export async function getTagById(id: string): Promise<Tag | null> {
  return prismaClient.tag.findUnique({
    where: {id},
  })
}

export async function getTagByName(name: string): Promise<Tag | null> {
  return prismaClient.tag.findUnique({
    where: {name},
  })
}

export async function createTag(data: Omit<Tag, 'id' | 'createdAt'>): Promise<Tag> {
  return prismaClient.tag.create({
    data,
  })
}

export async function updateTag(id: string, data: Partial<Omit<Tag, 'id' | 'createdAt'>>): Promise<Tag> {
  return prismaClient.tag.update({
    where: {id},
    data,
  })
}

export async function deleteTag(id: string): Promise<Tag> {
  return prismaClient.tag.delete({
    where: {id},
  })
}

