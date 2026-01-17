/**
 * Server actions voor File CRUD operaties
 * Developers kunnen files uploaden voor hun scripts
 * Admins kunnen alle files beheren
 */
'use server'

import {revalidatePath} from 'next/cache'
import {
  getFileById,
  createFile as createFileDal,
  updateFile as updateFileDal,
  deleteFile as deleteFileDal,
} from '@/dal/files'
import {getScriptById} from '@/dal/scripts'
import {protectedFormAction, protectedServerFunction} from '@/lib/serverFunctions'
import {createFileSchema, updateFileSchema} from '@/schemas/fileSchemas'
import {Role} from '@/generated/prisma/enums'

/**
 * Create a new file for a script (Developer & Admin only)
 */
export const createFileAction = protectedFormAction({
  schema: createFileSchema,
  requiredRoles: [Role.Developer, Role.Admin],
  serverFn: async ({data, logger, profile}) => {
    logger.info(`User ${profile.username} creating new file: ${data.name} for script ${data.scriptId}`)

    // Check if script exists and user has permission
    const script = await getScriptById(data.scriptId)
    if (!script) {
      logger.warn(`Script not found: ${data.scriptId}`)
      return {
        success: false,
        errors: {errors: ['Script not found']},
      }
    }

    // Check authorization: must be script owner or admin
    if (script.authorId !== profile.id && profile.role !== Role.Admin) {
      logger.warn(`User ${profile.username} tried to add file to script ${data.scriptId} without permission`)
      return {
        success: false,
        errors: {errors: ['You do not have permission to add files to this script']},
      }
    }

    const file = await createFileDal(data)
    logger.info(`File created successfully: ${file.id}`)

    revalidatePath(`/script/${data.scriptId}`)
    revalidatePath('/dashboard')

    return {
      success: true,
      data: {fileId: file.id},
    }
  },
  functionName: 'Create File Action',
  globalErrorMessage: 'Failed to create file. Please try again.',
})

/**
 * Update an existing file (Owner or Admin only)
 */
export const updateFileAction = protectedFormAction({
  schema: updateFileSchema,
  requiredRoles: [Role.Developer, Role.Admin],
  serverFn: async ({data, logger, profile}) => {
    const {id, ...updateData} = data
    logger.info(`User ${profile.username} updating file: ${id}`)

    // Check if file exists
    const existingFile = await getFileById(id)
    if (!existingFile) {
      logger.warn(`File not found: ${id}`)
      return {
        success: false,
        errors: {errors: ['File not found']},
      }
    }

    // Check if user owns the script
    const script = await getScriptById(existingFile.scriptId)
    if (!script) {
      logger.error(`Script not found for file: ${existingFile.scriptId}`)
      return {
        success: false,
        errors: {errors: ['Associated script not found']},
      }
    }

    // Check authorization: must be script owner or admin
    if (script.authorId !== profile.id && profile.role !== Role.Admin) {
      logger.warn(`User ${profile.username} tried to update file ${id} without permission`)
      return {
        success: false,
        errors: {errors: ['You do not have permission to edit this file']},
      }
    }

    const file = await updateFileDal(id, updateData)
    logger.info(`File updated successfully: ${file.id}`)

    revalidatePath(`/script/${file.scriptId}`)
    revalidatePath('/dashboard')

    return {
      success: true,
      data: {fileId: file.id},
    }
  },
  functionName: 'Update File Action',
  globalErrorMessage: 'Failed to update file. Please try again.',
})

/**
 * Delete a file (Owner or Admin only)
 */
export const deleteFileAction = protectedServerFunction({
  schema: updateFileSchema.pick({id: true}),
  requiredRoles: [Role.Developer, Role.Admin],
  serverFn: async ({data, logger, profile}) => {
    logger.info(`User ${profile.username} deleting file: ${data.id}`)

    // Check if file exists
    const existingFile = await getFileById(data.id)
    if (!existingFile) {
      logger.warn(`File not found: ${data.id}`)
      throw new Error('File not found')
    }

    // Check if user owns the script
    const script = await getScriptById(existingFile.scriptId)
    if (!script) {
      logger.error(`Script not found for file: ${existingFile.scriptId}`)
      throw new Error('Associated script not found')
    }

    // Check authorization: must be script owner or admin
    if (script.authorId !== profile.id && profile.role !== Role.Admin) {
      logger.warn(`User ${profile.username} tried to delete file ${data.id} without permission`)
      throw new Error('You do not have permission to delete this file')
    }

    const file = await deleteFileDal(data.id)
    logger.info(`File deleted successfully: ${file.id}`)

    revalidatePath(`/script/${file.scriptId}`)
    revalidatePath('/dashboard')
  },
  functionName: 'Delete File Action',
  globalErrorMessage: 'Failed to delete file. Please try again.',
})

