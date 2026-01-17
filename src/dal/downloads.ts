import 'server-only'
import {prismaClient} from './prismaClient'
import type {Download, Prisma} from '@/generated/prisma/client'

export type DownloadWithRelations = Prisma.DownloadGetPayload<{
  include: {
    user: {select: {id: true, username: true}},
    script: {select: {id: true, title: true}},
  }
}>

export async function getDownloads(filters?: {
  scriptId?: string
  userId?: string
  limit?: number
  offset?: number
}): Promise<DownloadWithRelations[]> {
  return prismaClient.download.findMany({
    where: {
      scriptId: filters?.scriptId,
      userId: filters?.userId,
    },
    include: {
      user: {select: {id: true, username: true}},
      script: {select: {id: true, title: true}},
    },
    take: filters?.limit || 20,
    skip: filters?.offset || 0,
    orderBy: {createdAt: 'desc'},
  })
}

export async function getDownloadById(id: string): Promise<DownloadWithRelations | null> {
  return prismaClient.download.findUnique({
    where: {id},
    include: {
      user: {select: {id: true, username: true}},
      script: {select: {id: true, title: true}},
    },
  })
}

export async function getDownloadByUserAndScript(userId: string, scriptId: string): Promise<Download | null> {
  return prismaClient.download.findUnique({
    where: {
      userId_scriptId: {userId, scriptId},
    },
  })
}

export async function createDownload(data: {
  userId: string
  scriptId: string
  ipAddress?: string | null
  userAgent?: string | null
}): Promise<Download> {
  return prismaClient.download.create({
    data,
  })
}

export async function deleteDownload(id: string): Promise<Download> {
  return prismaClient.download.delete({
    where: {id},
  })
}

