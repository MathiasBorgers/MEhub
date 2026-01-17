/**
 * Server actions voor Script CRUD operaties
 * Developers kunnen hun eigen scripts beheren
 * Admins kunnen alle scripts beheren
 */
'use server'

import {revalidatePath} from 'next/cache'
import {
  getScriptById,
  createScript as createScriptDal,
  updateScript as updateScriptDal,
  deleteScript as deleteScriptDal,
} from '@/dal/scripts'
import {protectedFormAction, protectedServerFunction} from '@/lib/serverFunctions'
import {createScriptSchema, updateScriptSchema} from '@/schemas/scriptSchemas'
import {Role} from '@prisma/client'

/**
 * Create a new script (Developer & Admin only)
 */
export const createScriptAction = protectedFormAction({
  schema: createScriptSchema,
  requiredRoles: [Role.Developer, Role.Admin],
  serverFn: async ({data, logger, profile}) => {
    logger.info(`User ${profile.username} creating new script: ${data.title}`)

    try {
      const script = await createScriptDal({
        ...data,
        authorId: profile.id, // Set author from session
      })
      logger.info(`Script created successfully: ${script.id}`)

      revalidatePath('/dashboard')
      revalidatePath('/marketplace')
      revalidatePath(`/profile/${profile.username}`)

      return {
        success: true,
        data: {scriptId: script.id},
      }
    } catch (error) {
      logger.error({error}, 'Failed to create script')
      return {
        success: false,
        errors: {
          errors: [(error as Error).message || 'Failed to create script in database']
        }
      }
    }
  },
  functionName: 'Create Script Action',
  globalErrorMessage: 'Failed to create script. Please try again.',
})

/**
 * Update an existing script (Owner or Admin only)
 */
export const updateScriptAction = protectedFormAction({
  schema: updateScriptSchema,
  requiredRoles: [Role.Developer, Role.Admin],
  serverFn: async ({data, logger, profile}) => {
    const {id, ...updateData} = data
    logger.info(`User ${profile.username} updating script: ${id}`)
    logger.info({updateData}, 'Update data received')

    // Check if script exists
    const existing = await getScriptById(id)
    if (!existing) {
      logger.warn(`Script not found: ${id}`)
      return {
        success: false,
        errors: {errors: ['Script not found']},
      }
    }

    logger.info(`Existing script found: ${existing.title}`)
    logger.info(`Script owner: ${existing.authorId}, Current user: ${profile.id}`)

    // Check authorization: must be owner or admin
    if (existing.authorId !== profile.id && profile.role !== Role.Admin) {
      logger.warn(`User ${profile.username} tried to update script ${id} without permission`)
      return {
        success: false,
        errors: {errors: ['You do not have permission to edit this script']},
      }
    }

    logger.info('Authorization check passed, updating script...')

    const script = await updateScriptDal(id, updateData)
    logger.info(`Script updated successfully: ${script.id}`)

    revalidatePath('/dashboard')
    revalidatePath('/marketplace')
    revalidatePath(`/script/${script.id}`)

    return {
      success: true,
      data: {scriptId: script.id},
    }
  },
  functionName: 'Update Script Action',
  globalErrorMessage: 'Failed to update script. Please try again.',
})

/**
 * Delete a script (Owner or Admin only)
 */
export const deleteScriptAction = protectedServerFunction({
  schema: updateScriptSchema.pick({id: true}),
  requiredRoles: [Role.Developer, Role.Admin],
  serverFn: async ({data, logger, profile}) => {
    logger.info(`User ${profile.username} deleting script: ${data.id}`)

    // Check if script exists
    const existing = await getScriptById(data.id)
    if (!existing) {
      logger.warn(`Script not found: ${data.id}`)
      throw new Error('Script not found')
    }

    // Check authorization: must be owner or admin
    if (existing.authorId !== profile.id && profile.role !== Role.Admin) {
      logger.warn(`User ${profile.username} tried to delete script ${data.id} without permission`)
      throw new Error('You do not have permission to delete this script')
    }

    const script = await deleteScriptDal(data.id)
    logger.info(`Script deleted successfully: ${script.id}`)

    revalidatePath('/dashboard')
    revalidatePath('/marketplace')
    revalidatePath(`/profile/${profile.username}`)
  },
  functionName: 'Delete Script Action',
  globalErrorMessage: 'Failed to delete script. Please try again.',
})

