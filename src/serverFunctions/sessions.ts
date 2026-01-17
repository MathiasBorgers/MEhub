/**
 * Server actions voor Session beheer
 * Admins kunnen alle sessies bekijken en beheren
 * Users kunnen alleen hun eigen sessies beheren
 */
'use server'

import {revalidatePath} from 'next/cache'
import {
  getSessionById,
  deleteSession as deleteSessionDal,
  extendSession as extendSessionDal,
} from '@/dal/users'
import {protectedServerFunction} from '@/lib/serverFunctions'
import {deleteSessionSchema, extendSessionSchema} from '@/schemas/sessionSchemas'
import {Role} from '@/generated/prisma/enums'

/**
 * Revoke/Delete a session (Owner or Admin only)
 * This allows users to logout from other devices or admins to revoke sessions
 */
export const revokeSessionAction = protectedServerFunction({
  schema: deleteSessionSchema,
  serverFn: async ({data, logger, profile}) => {
    logger.info(`User ${profile.username} revoking session: ${data.id}`)

    // Check if session exists
    const session = await getSessionById(data.id)
    if (!session) {
      logger.warn(`Session not found: ${data.id}`)
      throw new Error('Session not found')
    }

    // Check authorization: must be session owner or admin
    if (session.userId !== profile.id && profile.role !== Role.Admin) {
      logger.warn(`User ${profile.username} tried to revoke session ${data.id} without permission`)
      throw new Error('You do not have permission to revoke this session')
    }

    await deleteSessionDal(data.id)
    logger.info(`Session revoked successfully: ${data.id}`)

    revalidatePath('/dashboard')
    revalidatePath('/profile')
  },
  functionName: 'Revoke Session Action',
  globalErrorMessage: 'Failed to revoke session. Please try again.',
})

/**
 * Extend a session (Owner or Admin only)
 */
export const extendSessionAction = protectedServerFunction({
  schema: extendSessionSchema,
  serverFn: async ({data, logger, profile}) => {
    logger.info(`User ${profile.username} extending session: ${data.id}`)

    // Check if session exists
    const session = await getSessionById(data.id)
    if (!session) {
      logger.warn(`Session not found: ${data.id}`)
      throw new Error('Session not found')
    }

    // Check authorization: must be session owner or admin
    if (session.userId !== profile.id && profile.role !== Role.Admin) {
      logger.warn(`User ${profile.username} tried to extend session ${data.id} without permission`)
      throw new Error('You do not have permission to extend this session')
    }

    await extendSessionDal(data.id, session.user.role)
    logger.info(`Session extended successfully: ${data.id}`)

    revalidatePath('/dashboard')
    revalidatePath('/profile')
  },
  functionName: 'Extend Session Action',
  globalErrorMessage: 'Failed to extend session. Please try again.',
})

