import 'server-only'
import {prismaClient} from './prismaClient'
import type {ScriptLike} from '@prisma/client'

export async function getScriptLike(userId: string, scriptId: string): Promise<ScriptLike | null> {
  return prismaClient.scriptLike.findUnique({
    where: {
      userId_scriptId: {userId, scriptId},
    },
  })
}

export async function getLikeCount(scriptId: string): Promise<number> {
  return prismaClient.scriptLike.count({
    where: {scriptId},
  })
}

export async function createLike(userId: string, scriptId: string): Promise<ScriptLike> {
  return prismaClient.scriptLike.create({
    data: {
      userId,
      scriptId,
    },
  })
}

export async function deleteLike(userId: string, scriptId: string): Promise<ScriptLike> {
  return prismaClient.scriptLike.delete({
    where: {
      userId_scriptId: {userId, scriptId},
    },
  })
}

