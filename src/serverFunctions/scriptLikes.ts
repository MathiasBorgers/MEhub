/**
 * Server actions voor Script Like operaties
 */
'use server'

import {revalidatePath} from 'next/cache'
import {getScriptLike, createLike, deleteLike} from '@/dal/scriptLikes'
import {protectedFormAction} from '@/lib/serverFunctions'
import {Role} from '@/generated/prisma/enums'
import {z} from 'zod'

const toggleLikeSchema = z.object({
  scriptId: z.string().uuid(),
})

/**
 * Toggle like on a script (all authenticated users)
 */
export const toggleScriptLikeAction = protectedFormAction({
  schema: toggleLikeSchema,
  requiredRoles: [Role.User, Role.Developer, Role.Admin], // All authenticated users can like
  serverFn: async ({data, logger, profile}) => {
    logger.info(`User ${profile.username} toggling like for script: ${data.scriptId}`)

    // Check if user already liked this script
    const existingLike = await getScriptLike(profile.id, data.scriptId)

    if (existingLike) {
      // Unlike
      await deleteLike(profile.id, data.scriptId)
      logger.info(`User ${profile.username} unliked script: ${data.scriptId}`)
    } else {
      // Like
      await createLike(profile.id, data.scriptId)
      logger.info(`User ${profile.username} liked script: ${data.scriptId}`)
    }

    revalidatePath(`/script/${data.scriptId}`)
    revalidatePath('/marketplace')

    return {
      success: true,
      data: {liked: !existingLike},
    }
  },
  functionName: 'Toggle Script Like Action',
  globalErrorMessage: 'Failed to toggle like. Please try again.',
})

