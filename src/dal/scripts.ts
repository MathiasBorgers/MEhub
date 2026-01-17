import 'server-only'
import {prismaClient} from './prismaClient'
import type {Script, Prisma} from '@/generated/prisma/client'

export type ScriptWithRelations = Prisma.ScriptGetPayload<{
  include: {
    author: {select: {id: true, username: true, avatar: true}},
    category: true,
    tags: {include: {tag: true}},
    _count: {select: {reviews: true, scriptDownloads: true}},
  }
}>

export async function getScripts(filters?: {
  categoryId?: string
  authorId?: string
  search?: string
  tags?: string[]
  minRating?: number
  isActive?: boolean
  limit?: number
  offset?: number
  sortBy?: 'createdAt' | 'downloads' | 'averageRating' | 'title'
  sortOrder?: 'asc' | 'desc'
}): Promise<ScriptWithRelations[]> {
  return prismaClient.script.findMany({
    where: {
      categoryId: filters?.categoryId,
      authorId: filters?.authorId,
      isActive: filters?.isActive,
      averageRating: filters?.minRating ? {gte: filters.minRating} : undefined,
      AND: [
        filters?.search ? {
          OR: [
            {title: {contains: filters.search, mode: 'insensitive'}},
            {description: {contains: filters.search, mode: 'insensitive'}},
          ],
        } : {},
        filters?.tags && filters.tags.length > 0 ? {
          tags: {
            some: {
              tagId: {in: filters.tags},
            },
          },
        } : {},
      ],
    },
    include: {
      author: {select: {id: true, username: true, avatar: true}},
      category: true,
      tags: {include: {tag: true}},
      _count: {select: {reviews: true, scriptDownloads: true}},
    },
    take: filters?.limit || 20,
    skip: filters?.offset || 0,
    orderBy: {[filters?.sortBy || 'createdAt']: filters?.sortOrder || 'desc'},
  })
}

export async function getScriptById(id: string): Promise<ScriptWithRelations | null> {
  return prismaClient.script.findUnique({
    where: {id},
    include: {
      author: {select: {id: true, username: true, avatar: true, role: true, bio: true}},
      category: true,
      tags: {include: {tag: true}},
      files: true,
      _count: {select: {reviews: true, scriptDownloads: true}},
    },
  })
}

export async function createScript(data: {
  title: string
  description: string
  fullDescription: string
  version: string
  authorId: string
  categoryId: string
  requirements?: string[]
  features?: string[]
  screenshots?: string[]
  tagIds?: string[]
  luaContent?: string
}): Promise<Script> {
  const {tagIds, ...scriptData} = data

  return prismaClient.script.create({
    data: {
      ...scriptData,
      tags: tagIds ? {
        create: tagIds.map(tagId => ({tagId})),
      } : undefined,
    },
  })
}

export async function updateScript(
  id: string,
  data: Partial<Omit<Script, 'id' | 'authorId' | 'createdAt' | 'updatedAt'>> & {tagIds?: string[]}
): Promise<Script> {
  const {tagIds, ...scriptData} = data

  console.log('=== DAL updateScript ===')
  console.log('Script ID:', id)
  console.log('TagIds:', tagIds)
  console.log('Script data:', scriptData)

  const updatePayload = {
    ...scriptData,
    ...(tagIds ? {
      tags: {
        deleteMany: {},
        create: tagIds.map(tagId => ({tagId})),
      },
    } : {}),
  }

  console.log('Update payload:', JSON.stringify(updatePayload, null, 2))

  return prismaClient.script.update({
    where: {id},
    data: updatePayload,
  })
}

export async function deleteScript(id: string): Promise<Script> {
  return prismaClient.script.delete({
    where: {id},
  })
}

export async function incrementScriptDownloads(id: string): Promise<Script> {
  return prismaClient.script.update({
    where: {id},
    data: {
      downloads: {increment: 1},
    },
  })
}
