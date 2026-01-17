/**
 * Server actions voor Download tracking
 * Users kunnen scripts downloaden
 */
'use server'

import {revalidatePath} from 'next/cache'
import {headers} from 'next/headers'
import {
  getDownloadByUserAndScript,
  createDownload as createDownloadDal,
  getDownloadById,
  deleteDownload as deleteDownloadDal,
} from '@/dal/downloads'
import {getScriptById, incrementScriptDownloads} from '@/dal/scripts'
import {protectedServerFunction, protectedFormAction} from '@/lib/serverFunctions'
import {createDownloadSchema, downloadSchema} from '@/schemas/downloadSchemas'
import {Role} from '@/generated/prisma/enums'

/**
 * Track a script download
 */
export const trackDownloadAction = protectedFormAction<typeof createDownloadSchema, {downloadId?: string, alreadyDownloaded?: boolean}>({
  schema: createDownloadSchema,
  serverFn: async ({data, logger, profile}) => {
    logger.info(`User ${profile.username} downloading script: ${data.scriptId}`)

    // Check if script exists
    const script = await getScriptById(data.scriptId)
    if (!script) {
      logger.warn(`Script not found: ${data.scriptId}`)
      throw new Error('Script not found')
    }

    // Check if already downloaded
    const existing = await getDownloadByUserAndScript(profile.id, data.scriptId)
    if (existing) {
      logger.info(`User ${profile.username} already downloaded script ${data.scriptId}`)
      return {
        success: true,
        data: {alreadyDownloaded: true}
      }
    }

    // Get request metadata
    const headersList = await headers()
    const ipAddress = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || null
    const userAgent = headersList.get('user-agent') || null

    // Create download record
    const download = await createDownloadDal({
      userId: profile.id,
      scriptId: data.scriptId,
      ipAddress: ipAddress?.split(',')[0] || null, // Take first IP if multiple
      userAgent,
    })

    // Increment download counter
    await incrementScriptDownloads(data.scriptId)
    logger.info(`Download tracked successfully for script ${data.scriptId}`)

    revalidatePath(`/script/${data.scriptId}`)
    revalidatePath('/marketplace')
    revalidatePath('/dashboard')

    return {
      success: true,
      data: {downloadId: download.id}
    }
  },
  functionName: 'Track Download Action',
  globalErrorMessage: 'Failed to track download. Please try again.',
})

/**
 * Delete a download record (Owner or Admin only)
 * This allows users to "un-download" a script if needed
 */
export const deleteDownloadAction = protectedServerFunction({
  schema: downloadSchema.pick({id: true}),
  serverFn: async ({data, logger, profile}) => {
    logger.info(`User ${profile.username} deleting download: ${data.id}`)

    // Check if download exists
    const existing = await getDownloadById(data.id)
    if (!existing) {
      logger.warn(`Download not found: ${data.id}`)
      throw new Error('Download not found')
    }

    // Check authorization: must be owner or admin
    if (existing.userId !== profile.id && profile.role !== Role.Admin) {
      logger.warn(`User ${profile.username} tried to delete download ${data.id} without permission`)
      throw new Error('You do not have permission to delete this download')
    }

    const download = await deleteDownloadDal(data.id)
    logger.info(`Download deleted successfully: ${download.id}`)

    revalidatePath(`/script/${download.scriptId}`)
    revalidatePath('/dashboard')
  },
  functionName: 'Delete Download Action',
  globalErrorMessage: 'Failed to delete download. Please try again.',
})
